const fs = require('fs');
const path = require('path');

const PUBLIC_PRODUCTS_PATH = 'client/public/data/products.json';
const DIST_PRODUCTS_PATH = 'client/dist/data/products.json';
const PUBLIC_PRESETS_PATH = 'client/public/data/presets.json';
const DIST_PRESETS_PATH = 'client/dist/data/presets.json';

const rawCatalog = JSON.parse(fs.readFileSync(PUBLIC_PRODUCTS_PATH, 'utf8'));

// 15 ALLOWED BRANDS:
// lenovo, samsung, hp, cosmic byte, zebronics, lapcare, ant esport, acer, tvs, consistent, iball, geonix, prodot, logitech, dell
const BRAND_PATTERNS = [
  { canonical: 'Lenovo', regex: /\b(lenovo|legion)\b/i },
  { canonical: 'Samsung', regex: /\bsamsung\b/i },
  { canonical: 'HP', regex: /\b(hp|hewlett[\s-]*packard|omen|pavilion)\b/i },
  { canonical: 'Cosmic Byte', regex: /\b(cosmic[\s-]*byte|cosmicbyte)\b/i },
  { canonical: 'Zebronics', regex: /\b(zebronics|zeb[\s-]*|zeb)\b/i },
  { canonical: 'Lapcare', regex: /\blapcare\b/i },
  { canonical: 'Ant Esports', regex: /\b(ant[\s-]*esports?|ant[\s-]*value)\b/i },
  { canonical: 'Acer', regex: /\b(acer|predator)\b/i },
  { canonical: 'TVS', regex: /\b(tvs|tvs[\s-]*gold|tvs[\s-]*champ)\b/i },
  { canonical: 'Consistent', regex: /\bconsistent\b/i },
  { canonical: 'iBall', regex: /\biball\b/i },
  { canonical: 'Geonix', regex: /\bgeonix\b/i },
  { canonical: 'ProDot', regex: /\bprodot\b/i },
  { canonical: 'Logitech', regex: /\blogitech\b/i },
  { canonical: 'Dell', regex: /\b(dell|alienware)\b/i },
  { canonical: 'Computer Care', regex: /\bcomputer\s*care\b/i }
];

const DISALLOWED_VENDORS = [
  'msi', 'asus', 'gigabyte', 'corsair', 'adata', 'arctic', 'kingston', 'thermaltake',
  'razer', 'elgato', 'lian li', 'g.skill', 'western digital', 'wd', 'dawg', 'lg', 'aoc',
  'teamgroup', 'crucial', 'deepcool', 'zotac', 'asrock', 'benq', 'be quiet', 'be quiet!',
  'viewsonic', 'redragon', 'verbatim', 'colorful', 'toshiba', 'fifine', 'cougar',
  'super flower', 'cybeart', 'inno3d', 'noctua', 'amd', 'nzxt', 'seagate', 'antec',
  'pny', 'karnage', 'hyte', 'galax', 'prolab design', 'claw', 'intel', 'powercolor',
  'klevv', 'nvidia', 'sapphire', 'evm', 'v-color', 'fsp', 'evga', 'intex', 'coconut',
  'patriot', 'silverstone', 'fanatec', 'aula', 'avermedia', 'origin code', 'tag',
  'sandisk', 'pc build'
];

function checkAllowed(item) {
  const vendor = (item.vendor || '').trim();
  const vLower = vendor.toLowerCase();

  for (const d of DISALLOWED_VENDORS) {
    if (vLower === d || vLower.startsWith(d + ' ') || vLower.endsWith(' ' + d)) {
      return null;
    }
  }

  for (const b of BRAND_PATTERNS) {
    if (b.regex.test(vendor)) {
      return b.canonical;
    }
  }

  return null;
}

const cleanedCatalog = {};
let keptCount = 0;
let removedCount = 0;

for (const [cat, items] of Object.entries(rawCatalog)) {
  if (!Array.isArray(items)) {
    cleanedCatalog[cat] = items;
    continue;
  }

  cleanedCatalog[cat] = [];
  for (const item of items) {
    const brand = checkAllowed(item);
    if (brand) {
      item.vendor = brand;
      cleanedCatalog[cat].push(item);
      keptCount++;
    } else {
      removedCount++;
    }
  }
}

console.log(`Original products processed. Kept: ${keptCount}, Removed: ${removedCount}`);
