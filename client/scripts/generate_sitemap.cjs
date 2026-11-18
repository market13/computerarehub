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

if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (Array.isArray(manifest.categories) && manifest.categories.length > 0) {
      categories = manifest.categories;
    }
  } catch (err) {
    console.warn('Failed to parse manifest.json, using fallback category list:', err.message);
  }
}

/**
 * Helper to get ISO date string from file modification timestamp
 */
function getFileModDate(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return null;
}

const defaultMod = getFileModDate(manifestPath) || new Date().toISOString().split('T')[0];
const blogMod = getFileModDate(path.resolve(__dirname, '../src/data/blogPosts.js')) || defaultMod;
const builderMod = getFileModDate(path.resolve(__dirname, '../src/components/PCBuilderView.jsx')) || defaultMod;
const servicesMod = getFileModDate(path.resolve(__dirname, '../src/components/ServicesView.jsx')) || defaultMod;
const bulkOrderMod = getFileModDate(path.resolve(__dirname, '../src/components/BulkOrderView.jsx')) || defaultMod;
const aboutMod = getFileModDate(path.resolve(__dirname, '../src/components/AboutView.jsx')) || defaultMod;
const privacyMod = getFileModDate(path.resolve(__dirname, '../src/components/PrivacyPolicyView.jsx')) || defaultMod;
const termsMod = getFileModDate(path.resolve(__dirname, '../src/components/TermsView.jsx')) || defaultMod;
const warrantyMod = getFileModDate(path.resolve(__dirname, '../src/components/WarrantyReturnsView.jsx')) || defaultMod;
const shippingMod = getFileModDate(path.resolve(__dirname, '../src/components/ShippingDeliveryView.jsx')) || defaultMod;

const entries = [
  // Homepage
  {
    loc: 'https://computercaregzb.com/',
    lastmod: defaultMod,
    changefreq: 'daily',
    priority: '1.0'
  },
  // Custom PC Builder Configurator
  {
    loc: 'https://computercaregzb.com/builder',
    lastmod: builderMod,
    changefreq: 'daily',
    priority: '0.9'
  },
  // Complete Hardware Catalog
  {
    loc: 'https://computercaregzb.com/catalog',
    lastmod: defaultMod,
    changefreq: 'daily',
    priority: '0.9'
  },
  // Computer Repair & Hardware Services in Ghaziabad
  {
    loc: 'https://computercaregzb.com/services',
    lastmod: servicesMod,
    changefreq: 'weekly',
    priority: '0.9'
  },
  // B2B & Bulk Orders
  {
    loc: 'https://computercaregzb.com/bulk-order',
    lastmod: bulkOrderMod,
    changefreq: 'weekly',
    priority: '0.8'
  },
  // About Us
  {
    loc: 'https://computercaregzb.com/about',
    lastmod: aboutMod,
    changefreq: 'monthly',
    priority: '0.7'
  },
  // Warranty & Returns Policy
  {
    loc: 'https://computercaregzb.com/warranty-returns',
    lastmod: warrantyMod,
    changefreq: 'monthly',
    priority: '0.7'
  },
  // Shipping & Delivery
  {
    loc: 'https://computercaregzb.com/shipping-delivery',
    lastmod: shippingMod,
    changefreq: 'monthly',
    priority: '0.7'
  },
  // Privacy Policy
  {
    loc: 'https://computercaregzb.com/privacy-policy',
    lastmod: privacyMod,
    changefreq: 'monthly',
    priority: '0.5'
  },
  // Terms & Conditions
  {
    loc: 'https://computercaregzb.com/terms',
    lastmod: termsMod,
    changefreq: 'monthly',
    priority: '0.5'
  },
  // Local SEO Landing Pages
  {
    loc: 'https://computercaregzb.com/pc-repair-indirapuram',
    lastmod: servicesMod,
    changefreq: 'weekly',
    priority: '0.85'
  },
  {
    loc: 'https://computercaregzb.com/gaming-pc-vaishali',
    lastmod: builderMod,
    changefreq: 'weekly',
    priority: '0.85'
  },
  {
    loc: 'https://computercaregzb.com/computer-shop-raj-nagar-extension',
    lastmod: defaultMod,
    changefreq: 'weekly',
    priority: '0.85'
  },
  // Hardware Guides & Blog
  {
    loc: 'https://computercaregzb.com/blog',
    lastmod: blogMod,
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: 'https://computercaregzb.com/blog/best-gaming-pc-build-under-50000-2026',
    lastmod: blogMod,
    changefreq: 'monthly',
    priority: '0.75'
  },
  {
    loc: 'https://computercaregzb.com/blog/laptop-repair-cost-ghaziabad',
    lastmod: blogMod,
    changefreq: 'monthly',
    priority: '0.75'
  }
];

// Add all 19 hardware categories with per-category file modification date
categories.forEach((cat) => {
  const catFilePath = path.resolve(__dirname, `../public/data/categories/${cat}.json`);
  const catLastmod = getFileModDate(catFilePath) || defaultMod;

  entries.push({
    loc: `https://computercaregzb.com/catalog/${cat}`,
    lastmod: catLastmod,
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
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Successfully generated dynamic sitemap with ${entries.length} URLs at ${sitemapPath}`);
