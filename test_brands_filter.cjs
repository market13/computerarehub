const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('client/public/data/products.json', 'utf8'));

const ALLOWED_BRANDS = [
  'lenovo',
  'samsung',
  'hp',
  'cosmic byte',
  'zebronics',
  'lapcare',
  'ant esport',
  'ant esports',
  'ant value',
  'acer',
  'tvs',
  'tvs gold',
  'tvs champ',
  'consistent',
  'iball',
  'geonix',
  'prodot',
  'logitech',
  'dell'
];

function isAllowedBrand(item) {
  const vendor = (item.vendor || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const handle = (item.handle || '').toLowerCase();
  const brand = (item.brand || '').toLowerCase();
  const manufacturer = (item.manufacturer || '').toLowerCase();

  for (const b of ALLOWED_BRANDS) {
    // Exact or word boundary regex
    const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');

    if (regex.test(vendor) || regex.test(brand) || regex.test(manufacturer)) {
      return true;
    }
  }

  // Also check if title clearly starts with or features the brand as the primary vendor
  for (const b of ALLOWED_BRANDS) {
    const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(title)) {
      // Check if vendor isn't another explicitly distinct manufacturer like Asus/MSI/Gigabyte
      // But if vendor is Unknown or empty or PC Build or matches
      return true;
    }
  }

  return false;
}

const keptByCategory = {};
const removedVendors = {};
const keptVendors = {};

let totalKept = 0;
let totalRemoved = 0;

for (const [cat, items] of Object.entries(catalog)) {
  if (!Array.isArray(items)) continue;
  keptByCategory[cat] = [];
  for (const item of items) {
    if (isAllowedBrand(item)) {
      keptByCategory[cat].push(item);
      totalKept++;
      const v = item.vendor || 'Unknown';
      keptVendors[v] = (keptVendors[v] || 0) + 1;
    } else {
      totalRemoved++;
      const v = item.vendor || 'Unknown';
      removedVendors[v] = (removedVendors[v] || 0) + 1;
    }
  }
}

console.log('Total Kept:', totalKept);
console.log('Total Removed:', totalRemoved);
console.log('\nKept by Category:');
for (const [cat, items] of Object.entries(keptByCategory)) {
  console.log(`  ${cat}: ${items.length} items`);
}
console.log('\nKept Vendors:', keptVendors);
console.log('\nTop 20 Removed Vendors:', Object.entries(removedVendors).sort((a,b) => b[1] - a[1]).slice(0, 20));
