const fs = require('fs');
const path = require('path');

const clientDist = path.resolve(__dirname, '../dist');
if (fs.existsSync(clientDist)) {
  const indexHtml = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const routes = ['builder', 'catalog', 'bulk-order', 'admin'];
    routes.forEach(r => {
      const dir = path.join(clientDist, r);
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(indexHtml, path.join(dir, 'index.html'));
    });
    console.log(`Prerendered main routes: ${routes.join(', ')}`);
  }
}
