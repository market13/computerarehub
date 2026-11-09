import fs from 'fs';

const brandPatterns = [
  /\bgamdias\b/i,
  /\bgamidas\b/i,
  /\bhyperx\b/i,
  /\bhyper\s*x\b/i,
  /\bglorious\b/i,
  /\brapoo\b/i
];

function matchesTargetBrand(item) {
  const vendor = (item.vendor || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const handle = (item.handle || '').toLowerCase();
  const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';
  const combined = `${vendor} ${title} ${handle} ${tags}`;

  for (const pattern of brandPatterns) {
    if (pattern.test(vendor) || pattern.test(combined)) {
      return true;
    }
  }
  return false;
}

const filePaths = [
  'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/public/data/products.json',
  'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/dist/data/products.json'
];

for (const filePath of filePaths) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping non-existent ${filePath}`);
    continue;
  }

  console.log(`\nProcessing ${filePath}...`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const catalog = JSON.parse(raw);

  let totalBefore = 0;
  let totalAfter = 0;
  let totalRemoved = 0;
  const removedCategories = {};
  const removedVendors = {};

  const cleanCatalog = {};

  for (const [cat, items] of Object.entries(catalog)) {
    if (!Array.isArray(items)) {
      cleanCatalog[cat] = items;
      continue;
    }
    totalBefore += items.length;
    const kept = [];

    for (const item of items) {
      if (matchesTargetBrand(item)) {
        totalRemoved++;
        removedCategories[cat] = (removedCategories[cat] || 0) + 1;
        const v = item.vendor || 'Unknown';
        removedVendors[v] = (removedVendors[v] || 0) + 1;
      } else {
        kept.push(item);
      }
    }

    cleanCatalog[cat] = kept;
    totalAfter += kept.length;
  }

  fs.writeFileSync(filePath, JSON.stringify(cleanCatalog, null, 2), 'utf8');
  console.log(`✓ Products before: ${totalBefore}`);
  console.log(`✓ Products removed: ${totalRemoved}`);
  console.log(`✓ Products remaining: ${totalAfter}`);
  console.log('Removed by category:', removedCategories);
  console.log('Removed by vendor:', removedVendors);
}

console.log('\n=== COMPLETE: TARGET BRANDS REMOVED SUCCESSFULLY ===');
