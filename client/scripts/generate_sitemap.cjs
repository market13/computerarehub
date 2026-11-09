const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../public/data/manifest.json');
const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');

let categories = [
  'case',
  'cpu',
  'motherboard',
  'gpu',
  'ram',
  'storage',
  'psu',
  'cooler',
  'monitor',
  'case_fan',
  'gaming_mouse',
  'gaming_keyboard',
  'gaming_headset',
  'gaming_mousepad',
  'gaming_chair',
  'gaming_controller',
  'webcam',
  'microphone',
  'gaming_pc'
];

let lastmod = new Date().toISOString().split('T')[0];

if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (Array.isArray(manifest.categories) && manifest.categories.length > 0) {
      categories = manifest.categories;
    }
    if (manifest.updatedAt) {
      lastmod = manifest.updatedAt.split('T')[0];
    }
  } catch (err) {
    console.warn('Failed to parse manifest.json, using fallback category list:', err.message);
  }
}

const entries = [
  // Homepage
  {
    loc: 'https://computercare.in/',
    lastmod,
    changefreq: 'daily',
    priority: '1.0'
  },
  // Custom PC Builder Configurator
  {
    loc: 'https://computercare.in/builder',
    lastmod,
    changefreq: 'daily',
    priority: '0.9'
  },
  // Complete Hardware Catalog
  {
    loc: 'https://computercare.in/catalog',
    lastmod,
    changefreq: 'daily',
    priority: '0.9'
  },
  // B2B & Bulk Orders
  {
    loc: 'https://computercare.in/bulk-order',
    lastmod,
    changefreq: 'weekly',
    priority: '0.8'
  }
];

// Add all 19 hardware categories
categories.forEach((cat) => {
  entries.push({
    loc: `https://computercare.in/catalog/${cat}`,
    lastmod,
    changefreq: 'daily',
    priority: '0.8'
  });
});

// Build XML string
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Successfully generated dynamic sitemap with ${entries.length} URLs at ${sitemapPath}`);
