const fs = require('fs');
const path = require('path');

const productsPath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/public/data/products.json';
const presetsPath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/public/data/presets.json';

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const presets = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));

// 1. Allowed existing brands
const allowedVendors = ['ant esports', 'cooler master', 'asus', 'dawg', 'zebronics'];

const existingCases = (products.case || []).filter(c => {
  if (!c.vendor) return false;
  const v = c.vendor.toLowerCase().trim();
  return allowedVendors.includes(v);
});

console.log(`Kept ${existingCases.length} existing cases matching allowed vendors`);

// 2. Define the cheaper Intex & Geonix options
const intexGeonixCases = [
  // --- INTEX (Cheaper Options) ---
  {
    id: 9901001001,
    title: 'INTEX IT-308 Classic Micro-ATX Desktop Cabinet (Black)',
    handle: 'intex-it-308-classic-cabinet-black',
    vendor: 'Intex',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 899,
    compare_at_price: 1299,
    available: true,
    sku: 'INTEX-CAS-IT308-BLK',
    image: '/images/products/case/intex-it-308-cabinet.jpg',
    cdn_image: '/images/products/case/intex-it-308-cabinet.jpg',
    images: ['/images/products/case/intex-it-308-cabinet.jpg'],
    cdn_images: ['/images/products/case/intex-it-308-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mini Tower',
      cabinet_style: 'Compact Office / Study',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 260,
      side_panel: 'Perforated Steel',
      included_fans: '1x 80mm Rear Exhaust Mount'
    },
    description: 'Ultra-affordable Micro-ATX desktop cabinet crafted with 0.4mm anti-rust SGCC steel, smooth hemmed edges for safe building, and front USB 2.0 & HD Audio. Ideal for budget home, student, and office workstations.',
    url: '/catalog/case/intex-it-308'
  },
  {
    id: 9901001002,
    title: 'INTEX IT-212 Office Micro-ATX Mid Tower Cabinet (Black)',
    handle: 'intex-it-212-office-cabinet-black',
    vendor: 'Intex',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 999,
    compare_at_price: 1499,
    available: true,
    sku: 'INTEX-CAS-IT212-BLK',
    image: '/images/products/case/intex-it-212-cabinet.jpg',
    cdn_image: '/images/products/case/intex-it-212-cabinet.jpg',
    images: ['/images/products/case/intex-it-212-cabinet.jpg'],
    cdn_images: ['/images/products/case/intex-it-212-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mini Tower',
      cabinet_style: 'Modern Business Desktop',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 270,
      side_panel: 'Vented Steel',
      included_fans: 'Side Ventilation Grille'
    },
    description: 'Reliable office tower chassis featuring a textured brushed front panel, dedicated USB 3.0 & dual USB 2.0 ports, and multiple drive bays for SSD and HDD expansion.',
    url: '/catalog/case/intex-it-212'
  },
  {
    id: 9901001003,
    title: 'INTEX Corona Slim Tower Cabinet with 450W SMPS (Black)',
    handle: 'intex-corona-cabinet-with-450w-smps-black',
    vendor: 'Intex',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1449,
    compare_at_price: 2199,
    available: true,
    sku: 'INTEX-CAS-CORONA-450W',
    image: '/images/products/case/intex-corona-smps-cabinet.jpg',
    cdn_image: '/images/products/case/intex-corona-smps-cabinet.jpg',
    images: ['/images/products/case/intex-corona-smps-cabinet.jpg'],
    cdn_images: ['/images/products/case/intex-corona-smps-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mini Tower',
      cabinet_style: 'Integrated Power Combo',
      color: 'Piano Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 275,
      side_panel: 'Ventilated Steel',
      included_fans: 'Built-in 450W Power Supply Unit'
    },
    description: 'Complete cost-effective solution with a pre-installed factory-tested Intex 450W power supply unit, high-gloss piano black bezel, and reliable thermal dissipation for standard desktop setups.',
    url: '/catalog/case/intex-corona-450w'
  },
  {
    id: 9901001004,
    title: 'INTEX Wave Gaming Micro-ATX Cabinet with Rainbow LED (Black)',
    handle: 'intex-wave-gaming-rgb-cabinet-black',
    vendor: 'Intex',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1699,
    compare_at_price: 2499,
    available: true,
    sku: 'INTEX-CAS-WAVE-RGB',
    image: '/images/products/case/intex-wave-rgb-cabinet.jpg',
    cdn_image: '/images/products/case/intex-wave-rgb-cabinet.jpg',
    images: ['/images/products/case/intex-wave-rgb-cabinet.jpg'],
    cdn_images: ['/images/products/case/intex-wave-rgb-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mid Tower',
      cabinet_style: 'Gaming RGB with Acrylic Window',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 300,
      side_panel: 'Transparent Acrylic Window',
      included_fans: 'Integrated Multi-Color LED Strip'
    },
    description: 'Budget gaming cabinet boasting a stylish multi-color rainbow LED front slash, transparent acrylic side panel, and support for up to 300mm graphics cards at an unbeatable price point.',
    url: '/catalog/case/intex-wave-rgb'
  },

  // --- GEONIX (Cheaper Options) ---
  {
    id: 9901002001,
    title: 'GEONIX GX-C100 Micro-ATX Compact Tower Cabinet (Black)',
    handle: 'geonix-gx-c100-micro-atx-cabinet-black',
    vendor: 'Geonix',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1049,
    compare_at_price: 1499,
    available: true,
    sku: 'GEONIX-CAS-GXC100-BLK',
    image: '/images/products/case/geonix-gx-c100-cabinet.jpg',
    cdn_image: '/images/products/case/geonix-gx-c100-cabinet.jpg',
    images: ['/images/products/case/geonix-gx-c100-cabinet.jpg'],
    cdn_images: ['/images/products/case/geonix-gx-c100-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mini Tower',
      cabinet_style: 'Compact Study / Business',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 260,
      side_panel: 'SPCC Steel Panel',
      included_fans: 'Rear 80mm Fan Mount'
    },
    description: 'Dependable Grade-A SPCC steel cabinet with a sleek minimalist front profile, dual front USB and HD Audio ports, engineered for students, accounting workstations, and everyday home PCs.',
    url: '/catalog/case/geonix-gx-c100'
  },
  {
    id: 9901002002,
    title: 'GEONIX GX-Slim Dual-Orientation Desktop Cabinet (Black)',
    handle: 'geonix-gx-slim-desktop-cabinet-black',
    vendor: 'Geonix',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1199,
    compare_at_price: 1699,
    available: true,
    sku: 'GEONIX-CAS-GXSLIM-BLK',
    image: '/images/products/case/geonix-gx-slim-cabinet.jpg',
    cdn_image: '/images/products/case/geonix-gx-slim-cabinet.jpg',
    images: ['/images/products/case/geonix-gx-slim-cabinet.jpg'],
    cdn_images: ['/images/products/case/geonix-gx-slim-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Slim Tower',
      cabinet_style: 'Ultra-Slim 95mm (Dual Orientation)',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 220,
      side_panel: 'Perforated Air Exhaust Panel',
      included_fans: 'Top 80mm Silent Exhaust Fan'
    },
    description: 'Space-saving 95mm slim PC cabinet designed to sit horizontally under a monitor or stand vertically on a desk. Perfect for compact office desks, retail billing counters, and classrooms.',
    url: '/catalog/case/geonix-gx-slim'
  },
  {
    id: 9901002003,
    title: 'GEONIX GX-450 Business Desktop Cabinet with 450W SMPS (Black)',
    handle: 'geonix-gx-450-cabinet-with-450w-smps-black',
    vendor: 'Geonix',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1499,
    compare_at_price: 2249,
    available: true,
    sku: 'GEONIX-CAS-GX450-SMPS',
    image: '/images/products/case/geonix-gx-450-smps-cabinet.jpg',
    cdn_image: '/images/products/case/geonix-gx-450-smps-cabinet.jpg',
    images: ['/images/products/case/geonix-gx-450-smps-cabinet.jpg'],
    cdn_images: ['/images/products/case/geonix-gx-450-smps-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mini Tower',
      cabinet_style: 'Complete Power-Pack Chassis',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 270,
      side_panel: 'Durable Coated Steel',
      included_fans: 'Integrated 450W Silent Fan PSU'
    },
    description: 'High-value bundled combo featuring a durable Micro-ATX chassis with an integrated 450W power supply unit, multi-format drive cage, and comprehensive Geonix manufacturer warranty.',
    url: '/catalog/case/geonix-gx-450'
  },
  {
    id: 9901002004,
    title: 'GEONIX Marvel RGB Micro-ATX Gaming Cabinet (Black)',
    handle: 'geonix-marvel-rgb-micro-atx-gaming-cabinet-black',
    vendor: 'Geonix',
    category: 'case',
    product_type: 'PC Cabinet',
    price: 1749,
    compare_at_price: 2599,
    available: true,
    sku: 'GEONIX-CAS-MARVEL-RGB',
    image: '/images/products/case/geonix-marvel-rgb-cabinet.jpg',
    cdn_image: '/images/products/case/geonix-marvel-rgb-cabinet.jpg',
    images: ['/images/products/case/geonix-marvel-rgb-cabinet.jpg'],
    cdn_images: ['/images/products/case/geonix-marvel-rgb-cabinet.jpg'],
    specs: {
      form_factor: 'Micro-ATX Mid Tower',
      cabinet_style: 'Front Mesh & ARGB Lighting',
      color: 'Black',
      supported_motherboards: ['Micro-ATX', 'Mini-ITX'],
      max_gpu_length: 290,
      side_panel: 'Full Acrylic View Window',
      included_fans: '1x 80mm Rear Fan Included'
    },
    description: 'Modern budget gaming chassis featuring dual addressable RGB front light lines, high-airflow front intake mesh, full acrylic transparent side window, and support for standard ATX power supplies.',
    url: '/catalog/case/geonix-marvel-rgb'
  }
];

// Combine the new budget Intex & Geonix options with the allowed existing cases
products.case = [...intexGeonixCases, ...existingCases];

console.log(`Total cases now: ${products.case.length}`);
console.log('Vendors in case:', [...new Set(products.case.map(c => c.vendor))]);

// 3. Update presets to use valid existing cases
// Apex Esports Starter -> Ant Esports ICE-320TG
// Phantom Stealth Studio -> Cooler Master Masterbox TD500 Mesh
// TITAN Hyperion Overkill -> ASUS ROG Hyperion GR701
presets.forEach(pr => {
  if (pr.name.includes('Apex Esports')) {
    pr.components.case = 7100177711197;
  } else if (pr.name.includes('Phantom Stealth')) {
    pr.components.case = 7100171616349;
  } else if (pr.name.includes('TITAN Hyperion')) {
    pr.components.case = 7106473459805;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
fs.writeFileSync(presetsPath, JSON.stringify(presets, null, 2), 'utf8');
console.log('Successfully saved products.json and presets.json!');
