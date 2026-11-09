const fs = require('fs');
const path = require('path');

const clientDist = path.resolve(__dirname, '../dist');
const dataCategoriesDir = path.resolve(__dirname, '../public/data/categories');
const manifestPath = path.resolve(__dirname, '../public/data/manifest.json');

if (!fs.existsSync(clientDist)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = path.join(clientDist, 'index.html');
if (!fs.existsSync(baseIndexHtml)) {
  console.error('dist/index.html does not exist.');
  process.exit(1);
}

const baseHtmlTemplate = fs.readFileSync(baseIndexHtml, 'utf8');

// Load manifest categories
let categories = [
  'case', 'cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'cooler',
  'monitor', 'case_fan', 'gaming_mouse', 'gaming_keyboard', 'gaming_headset',
  'gaming_mousepad', 'gaming_chair', 'gaming_controller', 'webcam', 'microphone', 'gaming_pc'
];

if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (Array.isArray(manifest.categories) && manifest.categories.length > 0) {
      categories = manifest.categories;
    }
  } catch (e) {
    console.warn('Could not read categories from manifest:', e.message);
  }
}

function formatCategoryName(key) {
  const map = {
    case: 'PC Cabinets & Cases',
    cpu: 'Processors & CPUs',
    motherboard: 'Motherboards',
    gpu: 'Graphics Cards (GPUs)',
    ram: 'RAM & Desktop Memory',
    storage: 'Storage (SSDs & NVMe)',
    psu: 'Power Supplies (PSUs)',
    cooler: 'CPU Coolers & Liquid AIOs',
    monitor: 'Gaming & Workstation Monitors',
    case_fan: 'Cabinet Cooling Fans',
    gaming_mouse: 'Gaming Mice',
    gaming_keyboard: 'Gaming & Mechanical Keyboards',
    gaming_headset: 'Gaming Headphones & Headsets',
    gaming_mousepad: 'Precision Mousepads',
    gaming_chair: 'Gaming & Ergonomic Chairs',
    gaming_controller: 'Gamepads & Controllers',
    webcam: 'Streaming Webcams',
    microphone: 'Studio & Gaming Microphones',
    gaming_pc: 'Pre-Built Gaming PCs & Workstations'
  };
  return map[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function injectHtml(template, { title, description, canonicalUrl, content, extraSchema = null }) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${description}" />`);

  // Replace Canonical Link
  html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace OpenGraph Title, Description, and URL
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter Title and Description
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${description}" />`);

  // Inject Extra Schema if provided (before </head>)
  if (extraSchema) {
    const schemaTag = `\n    <script type="application/ld+json">\n${JSON.stringify(extraSchema, null, 2)}\n    </script>\n  </head>`;
    html = html.replace('</head>', schemaTag);
  }

  // Inject prerendered content into <div id="root"></div>
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${content}</div>`);

  return html;
}

// 1. Prerender Homepage
const homeContent = `
  <main style="max-width:1200px;margin:0 auto;padding:20px;font-family:sans-serif;">
    <header style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
      <h1 style="color:#1b2269;font-size:2rem;margin-bottom:8px;">Computer Care — India's Premier Custom PC Builder & Genuine Computer Hardware</h1>
      <p style="color:#475569;font-size:1.1rem;line-height:1.6;">
        Build and configure your dream custom gaming PC, 3D animation workstation, or office desktop with real-time zero-bottleneck compatibility verification. Sourced 100% genuine from authorized brand distributors across India.
      </p>
      <nav style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap;">
        <a href="/builder" style="color:#2b38d1;font-weight:bold;">Custom 3D PC Builder</a>
        <a href="/catalog" style="color:#2b38d1;font-weight:bold;">Hardware Catalog</a>
        <a href="/bulk-order" style="color:#2b38d1;font-weight:bold;">B2B Bulk Orders</a>
        <a href="https://wa.me/919810550222" style="color:#059669;font-weight:bold;">WhatsApp Helpline: +91 9810550222</a>
      </nav>
    </header>

    <section style="margin-bottom:32px;">
      <h2 style="color:#1b2269;font-size:1.5rem;border-bottom:2px solid #2b38d1;padding-bottom:6px;">Shop Hardware Components by Category</h2>
      <ul style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:12px;list-style:none;padding:0;margin-top:16px;">
        ${categories.map(cat => `
          <li style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;background:#fff;">
            <a href="/catalog/${cat}" style="color:#1e293b;text-decoration:none;font-weight:bold;display:block;">
              ${formatCategoryName(cat)}
            </a>
            <span style="font-size:0.8rem;color:#64748b;">Genuine Brand Warranty</span>
          </li>
        `).join('')}
      </ul>
    </section>

    <section style="margin-bottom:32px;background:#f8fafc;padding:20px;border-radius:12px;border:1px solid #e2e8f0;">
      <h2 style="color:#1b2269;font-size:1.5rem;">Custom PC Configurator & Compatibility Engine</h2>
      <p style="color:#475569;line-height:1.6;">
        Computer Care provides an automated deterministic hardware compatibility engine. When configuring your custom PC, our engine verifies:
      </p>
      <ul style="color:#334155;line-height:1.8;margin-left:20px;">
        <li><strong>CPU Socket Matching:</strong> Verifies motherboard socket standards including Intel LGA1700, LGA1200, LGA1155, and AMD AM5 / AM4.</li>
        <li><strong>RAM Generation & Standards:</strong> Prevents incompatible DDR5 and DDR4 memory mismatches on motherboard slots.</li>
        <li><strong>Physical Dimensions & Clearances:</strong> Ensures GPU length does not exceed PC cabinet interior clearance and CPU cooler height fits side panels.</li>
        <li><strong>Dynamic PSU Wattage Calculation:</strong> Calculates total system TDP under peak synthetic loads with 25% safety headroom.</li>
      </ul>
      <p style="margin-top:12px;">
        <a href="/builder" style="display:inline-block;background:#2b38d1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Launch Custom PC Builder</a>
      </p>
    </section>

    <section style="margin-bottom:32px;">
      <h2 style="color:#1b2269;font-size:1.5rem;">Frequently Asked Questions (FAQ)</h2>
      <div style="display:flex;flex-col;gap:12px;margin-top:16px;">
        <article style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#fff;">
          <h3 style="font-size:1.1rem;color:#1e293b;margin:0 0 6px 0;">How does Computer Care ensure custom PC parts compatibility?</h3>
          <p style="color:#475569;margin:0;font-size:0.95rem;line-height:1.5;">Our configurator checks CPU-motherboard sockets, DDR memory generation, GPU length vs case clearance, and PSU wattage capacity automatically in real time.</p>
        </article>
        <article style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#fff;">
          <h3 style="font-size:1.1rem;color:#1e293b;margin:0 0 6px 0;">Do all components carry official manufacturer warranties?</h3>
          <p style="color:#475569;margin:0;font-size:0.95rem;line-height:1.5;">Yes, 100% of products sold are genuine brand-sealed units backed by official manufacturer warranties across India.</p>
        </article>
        <article style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#fff;">
          <h3 style="font-size:1.1rem;color:#1e293b;margin:0 0 6px 0;">Does Computer Care deliver custom gaming rigs across India?</h3>
          <p style="color:#475569;margin:0;font-size:0.95rem;line-height:1.5;">Yes, we safely package, crate, and ship pre-assembled and custom configured desktop PCs to all major cities and states across India with door-to-door transit insurance.</p>
        </article>
      </div>
    </section>

    <footer style="border-top:1px solid #e2e8f0;padding-top:16px;color:#64748b;font-size:0.85rem;">
      <p>Computer Care &copy; 2026. Ghaziabad, Uttar Pradesh, India. Helpline: +91 9810550222 | Email: contact@computercare.in</p>
    </footer>
  </main>
`;

const renderedHome = injectHtml(baseHtmlTemplate, {
  title: "Computer Care | Custom PC Builds & Genuine Computer Hardware",
  description: "Computer Care - India's premier custom PC builder with live 3D cabinet visualization, authentic computer parts, and real-time hardware compatibility.",
  canonicalUrl: "https://computercare.in/",
  content: homeContent
});
fs.writeFileSync(baseIndexHtml, renderedHome, 'utf8');

// 2. Prerender /builder
const builderDir = path.join(clientDist, 'builder');
fs.mkdirSync(builderDir, { recursive: true });
const builderContent = `
  <main style="max-width:1200px;margin:0 auto;padding:20px;font-family:sans-serif;">
    <header style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
      <a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">&larr; Back to Computer Care Home</a>
      <h1 style="color:#1b2269;font-size:2rem;margin-top:8px;">Custom 3D PC Builder & Real-Time Hardware Configurator</h1>
      <p style="color:#475569;font-size:1.1rem;line-height:1.6;">
        Build your high-performance gaming rig, creative editing workstation, or AI development system with zero bottlenecks. Select components step-by-step with live compatibility verification.
      </p>
    </header>

    <section style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:16px;margin-bottom:32px;">
      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">1. Processor (CPU)</h2>
        <p style="color:#64748b;font-size:0.9rem;">Intel Core 14th/13th Gen & AMD Ryzen 9000/7000 Series for intense gaming and multitasking.</p>
        <a href="/catalog/cpu" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse CPUs &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">2. Motherboard</h2>
        <p style="color:#64748b;font-size:0.9rem;">Z790, B760, X670, B650, and H61 chipsets matching exact processor sockets and memory channels.</p>
        <a href="/catalog/motherboard" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse Motherboards &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">3. Graphics Card (GPU)</h2>
        <p style="color:#64748b;font-size:0.9rem;">NVIDIA GeForce RTX 50 & 40 Series GPUs with ray tracing and DLSS 3.5 acceleration.</p>
        <a href="/catalog/gpu" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse GPUs &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">4. Memory (RAM)</h2>
        <p style="color:#64748b;font-size:0.9rem;">High-frequency DDR5 and DDR4 dual-channel memory kits from Corsair, Kingston, XPG, and Lapcare.</p>
        <a href="/catalog/ram" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse RAM &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">5. Storage (SSD/NVMe)</h2>
        <p style="color:#64748b;font-size:0.9rem;">PCIe Gen 4 and Gen 5 M.2 NVMe SSDs delivering up to 7,000+ MB/s read speeds for instant load times.</p>
        <a href="/catalog/storage" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse Storage &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">6. PC Cabinet & Case</h2>
        <p style="color:#64748b;font-size:0.9rem;">Panoramic dual-chamber fishbowl cases, mesh airflow mid-towers with pre-installed ARGB fans.</p>
        <a href="/catalog/case" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse Cases &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">7. Power Supply (PSU)</h2>
        <p style="color:#64748b;font-size:0.9rem;">80 Plus Bronze and Gold certified modular power supplies with dedicated PCIe 5.0 12VHPWR cables.</p>
        <a href="/catalog/psu" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse PSUs &rarr;</a>
      </article>

      <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
        <h2 style="font-size:1.2rem;color:#1e293b;">8. CPU Cooling</h2>
        <p style="color:#64748b;font-size:0.9rem;">360mm and 240mm AIO liquid coolers and dual-tower air coolers for whisper-quiet thermal control.</p>
        <a href="/catalog/cooler" style="color:#2b38d1;font-weight:bold;font-size:0.9rem;">Browse Coolers &rarr;</a>
      </article>
    </section>

    <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin-bottom:24px;">
      <h3 style="margin-top:0;color:#1e293b;">Need Expert Assistance?</h3>
      <p style="color:#475569;margin-bottom:8px;">Speak with our hardware specialists for free custom build recommendations, balance checks, and quotation assistance.</p>
      <a href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20need%20help%20choosing%20PC%20parts" style="color:#059669;font-weight:bold;">Chat on WhatsApp (+91 9810550222)</a>
    </div>
  </main>
`;
fs.writeFileSync(
  path.join(builderDir, 'index.html'),
  injectHtml(baseHtmlTemplate, {
    title: 'Custom 3D PC Builder & Real-time Compatibility | Computer Care',
    description: 'Configure your dream gaming rig or workstation with real-time socket, DDR standard, GPU dimension, and PSU wattage checks.',
    canonicalUrl: 'https://computercare.in/builder',
    content: builderContent
  }),
  'utf8'
);

// 3. Prerender /catalog
const catalogDir = path.join(clientDist, 'catalog');
fs.mkdirSync(catalogDir, { recursive: true });
const catalogContent = `
  <main style="max-width:1200px;margin:0 auto;padding:20px;font-family:sans-serif;">
    <header style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
      <a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">&larr; Back to Computer Care Home</a>
      <h1 style="color:#1b2269;font-size:2rem;margin-top:8px;">Genuine Computer Hardware Components Catalog</h1>
      <p style="color:#475569;font-size:1.1rem;line-height:1.6;">
        Browse authentic desktop hardware components, processors, graphics cards, motherboards, memory, gaming monitors, and peripherals with official brand warranties.
      </p>
    </header>

    <section>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:16px;">
        ${categories.map(cat => `
          <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;">
            <h2 style="font-size:1.2rem;color:#1e293b;margin-top:0;">${formatCategoryName(cat)}</h2>
            <p style="color:#64748b;font-size:0.85rem;">100% Genuine, Brand Warranty, Insured Shipping</p>
            <a href="/catalog/${cat}" style="display:inline-block;margin-top:8px;color:#2b38d1;font-weight:bold;text-decoration:none;">
              View All ${formatCategoryName(cat)} &rarr;
            </a>
          </article>
        `).join('')}
      </div>
    </section>
  </main>
`;
fs.writeFileSync(
  path.join(catalogDir, 'index.html'),
  injectHtml(baseHtmlTemplate, {
    title: 'Hardware Components Catalog | Computer Care',
    description: 'Browse authentic computer hardware components, CPUs, graphics cards, motherboards, RAM, cabinets, and monitors.',
    canonicalUrl: 'https://computercare.in/catalog',
    content: catalogContent
  }),
  'utf8'
);

// 4. Prerender /bulk-order
const bulkDir = path.join(clientDist, 'bulk-order');
fs.mkdirSync(bulkDir, { recursive: true });
const bulkContent = `
  <main style="max-width:1200px;margin:0 auto;padding:20px;font-family:sans-serif;">
    <header style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
      <a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">&larr; Back to Computer Care Home</a>
      <h1 style="color:#1b2269;font-size:2rem;margin-top:8px;">B2B & Institutional Bulk Hardware Procurement</h1>
      <p style="color:#475569;font-size:1.1rem;line-height:1.6;">
        Special wholesale procurement quotations for offices, gaming cafes, animation studios, and educational labs across India.
      </p>
    </header>

    <section style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;margin-bottom:32px;">
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:20px;background:#fff;">
        <h2 style="color:#1e293b;font-size:1.3rem;">Turnkey Computer Lab Setups</h2>
        <p style="color:#64748b;line-height:1.6;">Turnkey hardware procurement for schools, colleges, and training institutes. Standardized desktop builds, genuine brand warranty, and pan-India on-site support.</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:20px;background:#fff;">
        <h2 style="color:#1e293b;font-size:1.3rem;">Esports Arena & Cafe Deployment</h2>
        <p style="color:#64748b;line-height:1.6;">High-refresh gaming setups engineered for commercial esports arenas. High-airflow chassis, robust cooling, and dedicated business pricing.</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:20px;background:#fff;">
        <h2 style="color:#1e293b;font-size:1.3rem;">GST Invoicing & Input Tax Credit</h2>
        <p style="color:#64748b;line-height:1.6;">All bulk orders receive official GST tax invoices for enterprise expense claims and input tax credit benefits.</p>
      </div>
    </section>

    <div style="background:#f8fafc;padding:20px;border-radius:10px;border:1px solid #e2e8f0;">
      <h3 style="margin-top:0;color:#1e293b;">Submit Your Bulk Procurement Inquiry</h3>
      <p style="color:#475569;">Contact our dedicated B2B sales team directly on WhatsApp or call +91 9810550222 for same-day quotation dispatch.</p>
      <a href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20have%20a%20bulk%20hardware%20inquiry" style="display:inline-block;background:#059669;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Inquire via WhatsApp (+91 9810550222)</a>
    </div>
  </main>
`;
fs.writeFileSync(
  path.join(bulkDir, 'index.html'),
  injectHtml(baseHtmlTemplate, {
    title: 'B2B & Institutional Bulk Hardware Orders | Computer Care',
    description: 'Special wholesale procurement quotations for offices, gaming cafes, CAD studios, and educational labs.',
    canonicalUrl: 'https://computercare.in/bulk-order',
    content: bulkContent
  }),
  'utf8'
);

// 5. Prerender all 19 Category Deep-Links (/catalog/<category>)
categories.forEach((cat) => {
  const catDir = path.join(clientDist, 'catalog', cat);
  fs.mkdirSync(catDir, { recursive: true });

  const catName = formatCategoryName(cat);
  const catFilePath = path.join(dataCategoriesDir, `${cat}.json`);

  let products = [];
  if (fs.existsSync(catFilePath)) {
    try {
      products = JSON.parse(fs.readFileSync(catFilePath, 'utf8'));
    } catch (e) {
      console.warn(`Could not read category products for ${cat}:`, e.message);
    }
  }

  // Generate ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${catName} - Authentic Hardware`,
    "description": `Shop 100% brand-warranty ${catName} at Computer Care with fast pan-India delivery.`,
    "url": `https://computercare.in/catalog/${cat}`,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 10).map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": p.title,
        "image": p.image ? `https://computercare.in${p.image.startsWith('/') ? '' : '/'}${p.image}` : undefined,
        "sku": p.sku || `CC-${p.id}`,
        "brand": {
          "@type": "Brand",
          "name": p.vendor
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.price,
          "availability": p.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Computer Care"
          }
        }
      }
    }))
  };

  const catContent = `
    <main style="max-width:1200px;margin:0 auto;padding:20px;font-family:sans-serif;">
      <nav style="font-size:0.85rem;color:#64748b;margin-bottom:12px;">
        <a href="/" style="color:#64748b;text-decoration:none;">Home</a> &gt; 
        <a href="/catalog" style="color:#64748b;text-decoration:none;">Catalog</a> &gt; 
        <strong style="color:#1e293b;">${catName}</strong>
      </nav>

      <header style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#1b2269;font-size:2rem;margin-bottom:8px;">${catName}</h1>
        <p style="color:#475569;font-size:1.05rem;line-height:1.5;">
          Explore authentic ${catName.toLowerCase()} with official manufacturer warranty, transparent pricing, and nationwide insured shipping.
        </p>
      </header>

      <section>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:20px;">
          ${products.slice(0, 24).map(p => `
            <article style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;display:flex;flex-direction:column;justify-content:between;">
              <div>
                <span style="font-size:0.75rem;font-weight:bold;color:#64748b;text-transform:uppercase;">${p.vendor}</span>
                <h2 style="font-size:1rem;color:#1e293b;margin:6px 0 10px 0;line-height:1.4;">${p.title}</h2>
                <div style="font-size:1.25rem;font-weight:bold;color:#1b2269;">₹${p.price.toLocaleString('en-IN')}</div>
                ${p.compare_at_price > p.price ? `<div style="font-size:0.85rem;color:#94a3b8;text-decoration:line-through;">₹${p.compare_at_price.toLocaleString('en-IN')}</div>` : ''}
              </div>
              <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:0.8rem;color:#059669;font-weight:bold;">● In Stock</span>
                <a href="/builder" style="font-size:0.8rem;color:#2b38d1;font-weight:bold;text-decoration:none;">Add to Rig &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <div style="margin-top:40px;padding:20px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
        <h3 style="margin-top:0;color:#1e293b;">Need help selecting ${catName.toLowerCase()}?</h3>
        <p style="color:#475569;margin-bottom:12px;">Contact Computer Care hardware specialists for compatibility verification and direct WhatsApp quotation.</p>
        <a href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20have%20a%20question%20about%20${encodeURIComponent(catName)}" style="display:inline-block;background:#2b38d1;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:0.9rem;">Chat on WhatsApp</a>
      </div>
    </main>
  `;

  fs.writeFileSync(
    path.join(catDir, 'index.html'),
    injectHtml(baseHtmlTemplate, {
      title: `${catName} - Authentic Hardware Components | Computer Care`,
      description: `Shop verified 100% brand-warranty ${catName} at honest prices with pan-India insured shipping.`,
      canonicalUrl: `https://computercare.in/catalog/${cat}`,
      content: catContent,
      extraSchema: itemListSchema
    }),
    'utf8'
  );
});

// 6. Prerender /admin as noindex
const adminDir = path.join(clientDist, 'admin');
fs.mkdirSync(adminDir, { recursive: true });
let adminHtml = baseHtmlTemplate;
adminHtml = adminHtml.replace(/<title>.*?<\/title>/s, '<title>Administrator Management Portal | Computer Care</title>');
adminHtml = adminHtml.replace('<div id="root"></div>', '<div id="root"><main style="padding:40px;text-align:center;font-family:sans-serif;"><h1>Administrator Portal</h1><p>Store management portal.</p></main></div>');
adminHtml = adminHtml.replace(/<meta name="robots" content=".*?" \/>/i, '<meta name="robots" content="noindex, nofollow" />');
fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf8');

console.log(`Prerendered all routes successfully: /, /builder, /catalog, /bulk-order, /admin, and ${categories.length} category deep-links.`);
