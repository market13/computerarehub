const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../dist/catalog/case/index.html');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let match;
const schemas = [];

while ((match = regex.exec(html)) !== null) {
  try {
    schemas.push(JSON.parse(match[1]));
  } catch (err) {
    console.error('Failed to parse schema:', err.message);
  }
}

const itemList = schemas.find(s => s['@type'] === 'ItemList');
if (!itemList) {
  console.error('❌ No ItemList schema found in dist/catalog/case/index.html');
  process.exit(1);
}

console.log(`✅ ItemList schema found with ${itemList.itemListElement.length} items`);

const sx7 = itemList.itemListElement.find(item => item.item && item.item.name && item.item.name.includes('SX7'));
if (!sx7) {
  console.error('❌ SX7 product not found in ItemList schema');
  process.exit(1);
}

console.log('\n--- Corrected SX7 Product JSON-LD in ItemList ---');
console.log(JSON.stringify(sx7, null, 2));

const skuRegex = /^[A-Za-z0-9-]+$/;
let allPassed = true;

itemList.itemListElement.forEach((entry, idx) => {
  const p = entry.item;
  if (!p) {
    console.error(`❌ Item ${idx + 1} has no item property`);
    allPassed = false;
    return;
  }

  // 1. SKU validation
  if (!p.sku || typeof p.sku !== 'string' || !skuRegex.test(p.sku)) {
    console.error(`❌ Position ${entry.position}: Invalid SKU "${p.sku}" for ${p.name}`);
    allPassed = false;
  }

  // 2. Image validation
  if (!p.image || typeof p.image !== 'string' || !p.image.startsWith('https://') || p.image.includes('https://computercaregzb.com/http')) {
    console.error(`❌ Position ${entry.position}: Invalid image "${p.image}" for ${p.name}`);
    allPassed = false;
  }

  // 3. Name validation
  if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') {
    console.error(`❌ Position ${entry.position}: Missing name`);
    allPassed = false;
  }

  // 4. Offer validation
  if (p.offers) {
    if (p.offers['@type'] !== 'Offer') {
      console.error(`❌ Position ${entry.position}: Invalid offer @type "${p.offers['@type']}"`);
      allPassed = false;
    }
    if (p.offers.priceCurrency !== 'INR') {
      console.error(`❌ Position ${entry.position}: Invalid priceCurrency "${p.offers.priceCurrency}"`);
      allPassed = false;
    }
    if (typeof p.offers.price !== 'number' || p.offers.price <= 0) {
      console.error(`❌ Position ${entry.position}: Invalid price "${p.offers.price}"`);
      allPassed = false;
    }
    if (!p.offers.availability || (!p.offers.availability.includes('InStock') && !p.offers.availability.includes('OutOfStock'))) {
      console.error(`❌ Position ${entry.position}: Invalid availability "${p.offers.availability}"`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\n✅ ALL products in /catalog/case/ schema are 100% compliant and valid for Google Search Console Merchant Listings!');
} else {
  console.error('\n❌ Some products in /catalog/case/ failed schema compliance.');
  process.exit(1);
}

// Audit all categories in dist/catalog/
const distCatalogDir = path.resolve(__dirname, '../dist/catalog');
const categories = fs.readdirSync(distCatalogDir).filter(f => fs.statSync(path.join(distCatalogDir, f)).isDirectory());
let allCategoriesPassed = true;
let totalAuditedProducts = 0;

for (const cat of categories) {
  const catFile = path.join(distCatalogDir, cat, 'index.html');
  if (!fs.existsSync(catFile)) continue;
  const content = fs.readFileSync(catFile, 'utf8');
  const catMatches = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of catMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed['@type'] === 'ItemList' && Array.isArray(parsed.itemListElement)) {
        parsed.itemListElement.forEach((el) => {
          const item = el.item;
          if (item && item['@type'] === 'Product') {
            totalAuditedProducts++;
            if (item.sku && !skuRegex.test(item.sku)) {
              console.error(`❌ [${cat}] Invalid SKU "${item.sku}" for ${item.name}`);
              allCategoriesPassed = false;
            }
            if (item.image && item.image.includes('computercaregzb.com/http')) {
              console.error(`❌ [${cat}] Double prefixed image "${item.image}" for ${item.name}`);
              allCategoriesPassed = false;
            }
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing schema in ${cat}:`, err.message);
    }
  }
}

if (allCategoriesPassed) {
  console.log(`✅ ALL ${categories.length} categories (${totalAuditedProducts} products audited) across the entire catalog are 100% compliant!`);
} else {
  console.error('❌ Issues detected in other categories.');
  process.exit(1);
}

