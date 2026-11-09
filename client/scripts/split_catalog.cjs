const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const clientDir = path.resolve(__dirname, '..');
const productsJsonPath = path.join(clientDir, 'public/data/products.json');
const targetCategoriesDir = path.join(clientDir, 'public/data/categories');
const targetManifestPath = path.join(clientDir, 'public/data/manifest.json');

if (!fs.existsSync(productsJsonPath)) {
  console.error('products.json not found at:', productsJsonPath);
  process.exit(1);
}

const raw = fs.readFileSync(productsJsonPath, 'utf8');
const data = JSON.parse(raw);

const buildHash = crypto.createHash('md5').update(raw).digest('hex').slice(0, 10);
const buildVersion = `1.2.0-${buildHash}`;

if (!fs.existsSync(targetCategoriesDir)) {
  fs.mkdirSync(targetCategoriesDir, { recursive: true });
}

const categoryCounts = {};
const categoryFiles = {};
let totalProducts = 0;

for (const [catKey, items] of Object.entries(data)) {
  categoryCounts[catKey] = items.length;
  totalProducts += items.length;
  const catFilePath = path.join(targetCategoriesDir, `${catKey}.json`);
  fs.writeFileSync(catFilePath, JSON.stringify(items, null, 2), 'utf8');
  categoryFiles[catKey] = `/data/categories/${catKey}.json`;
}

function findInitialBuild() {
  const cpus = (data.cpu || []).filter(c => c.vendor !== 'PC Build' && !(c.title || '').toLowerCase().includes('custom pc build'));
  const motherboards = data.motherboard || [];
  const rams = data.ram || [];
  const cases = data.case || [];
  const gpus = data.gpu || [];
  const psus = data.psu || [];
  const coolers = data.cooler || [];
  const storages = data.storage || [];
  const fans = data.case_fan || [];
  const monitors = data.monitor || [];

  for (const cpu of cpus) {
    const socket = cpu.specs?.socket;
    if (!socket) continue;
    const mb = motherboards.find(m => m.specs?.socket && m.specs.socket.toLowerCase() === socket.toLowerCase());
    if (!mb) continue;
    const ram = rams.find(r => r.specs?.ram_type && r.specs.ram_type.toUpperCase() === mb.specs?.ram_type?.toUpperCase());
    if (!ram) continue;
    const cabinet = cases.find(c => {
      const supp = c.specs?.supported_motherboards || ['ATX', 'Micro-ATX', 'Mini-ITX'];
      return !mb.specs?.form_factor || supp.some(s => s.toLowerCase() === mb.specs.form_factor.toLowerCase());
    });
    if (!cabinet) continue;

    return {
      cpu,
      motherboard: mb,
      ram,
      case: cabinet,
      gpu: gpus[0] || null,
      psu: psus.find(p => (p.specs?.wattage || 0) >= 550) || psus[0] || null,
      cooler: coolers[0] || null,
      storage: storages[0] || null,
      case_fan: fans[0] || null,
      monitor: monitors[0] || null
    };
  }
  return null;
}

const initialBuild = findInitialBuild();

const homeFeatured = {};
['cpu', 'gpu', 'motherboard', 'ram', 'case', 'storage', 'monitor', 'gaming_keyboard', 'gaming_mouse'].forEach(cat => {
  if (data[cat] && data[cat].length > 0) {
    homeFeatured[cat] = data[cat].slice(0, 4);
  }
});

let updatedAt = new Date().toISOString();
if (fs.existsSync(targetManifestPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(targetManifestPath, 'utf8'));
    if (existing.buildHash === buildHash && existing.updatedAt) {
      updatedAt = existing.updatedAt;
    }
  } catch {}
}

const manifest = {
  version: buildVersion,
  buildHash,
  updatedAt,
  totalProducts,
  categories: Object.keys(data),
  categoryCounts,
  categoryFiles,
  initialBuild,
  homeFeatured
};

fs.writeFileSync(targetManifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`Split ${Object.keys(data).length} categories into ${targetCategoriesDir}`);
console.log(`Generated manifest.json (${totalProducts} products, hash: ${buildHash})`);
