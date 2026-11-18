const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('client/public/data/products.json', 'utf8'));

const pcBuilds = [];
for (const [cat, items] of Object.entries(catalog)) {
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item.vendor === 'PC Build') {
        pcBuilds.push({ cat, title: item.title, brand: item.brand, manufacturer: item.manufacturer, id: item.id });
      }
    }
  }
}
console.log('Total items with vendor "PC Build":', pcBuilds.length);
console.log('Sample items with vendor "PC Build":', pcBuilds.slice(0, 10));
const cats = {};
pcBuilds.forEach(p => cats[p.cat] = (cats[p.cat] || 0) + 1);
console.log('Categories of PC Build vendor:', cats);
