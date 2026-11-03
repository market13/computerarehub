const fs = require('fs');

const productsPath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/public/data/products.json';
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const newPrebuilt = {
  id: 'gaming_pc_care_i3_3rdgen_zebronics_19in_9999',
  title: 'Computer Care Complete PC Setup (Intel Core i3 3rd Gen / 8GB RAM / 256GB SSD / Zebronics 19-inch HD Monitor) Full Desktop Pre-Built Combo',
  vendor: 'Computer Care',
  price: 9999,
  compare_at_price: 16999,
  category: 'gaming_pc',
  available: true,
  sku: 'CC-PC-I3-3RDGEN-8GB-256SSD-ZEB19',
  image: '/images/products/gaming_pc/computercare-i3-3rdgen-zebronics-19inch-combo.jpg',
  cdn_image: '/images/products/gaming_pc/computercare-i3-3rdgen-zebronics-19inch-combo.jpg',
  images: [
    '/images/products/gaming_pc/computercare-i3-3rdgen-zebronics-19inch-combo.jpg',
    '/images/products/case/intex-it-308-cabinet.jpg'
  ],
  handle: 'computer-care-complete-pc-setup-intel-i3-3rdgen-8gb-ram-256gb-ssd-zebronics-19in-monitor',
  url: '/catalog/gaming_pc/intel-i3-3rdgen-zebronics-19in-combo',
  description: `Complete Plug & Play Desktop Computer Setup with Zebronics 19-inch HD Monitor:

• Processor: Intel Core i3 3rd Generation (i3-3220 / i3-3240, 3.30 GHz, Dual Core / 4 Threads)
• Memory (RAM): 8GB DDR3 1600MHz High-Speed Memory
• Storage: 256GB Solid State Drive (SSD) for lightning-fast 5-second Windows boot and instant app loading
• Monitor: Zebronics 19-inch (18.5" / 19" HD LED Wide Display, Crisp 1366x768 Resolution, HDMI & VGA inputs, Wall-Mountable)
• Motherboard: Intel H61 Express Micro-ATX Motherboard with Gigabit Ethernet LAN, USB 2.0 & HD 6-Channel Audio
• Graphics: Integrated Intel HD Graphics 2500 (Supports 1080p Full HD video playback and dual monitor display)
• Cabinet: Sleek Matte Black Desktop Cabinet with front high-speed USB ports and 3.5mm headphone/mic jacks
• Power Supply: Energy-efficient 450W SMPS with automatic surge protection
• Operating System: Windows 10/11 Compatible (Clean install, lifetime activation support, zero bloatware)
• Package Contents: 1x CPU Tower, 1x Zebronics 19-inch HD Monitor, 2x Power Cords, 1x Display Cable, Warranty Card
• Ideal For: School & College Studies, Tally Prime / Busy / Excel Accounting, Online Classes & Video Conferencing, Internet Browsing, Home Media, and Office Multitasking
• Warranty: 1 Year Comprehensive Hardware Warranty with Dedicated Support from Computer Care Ghaziabad (Shiva Tower, UP - 201009)`,
  tags: [
    'CATQ_PC Build',
    'Pre-Built PC',
    'Budget PC',
    '10k PC',
    'Complete PC Setup',
    'PC with Monitor',
    'Zebronics Monitor',
    'Intel Core i3 3rd Gen',
    '8GB RAM',
    '256GB SSD',
    'Computer Care Exclusive'
  ],
  specs: {
    vendor: 'Computer Care',
    processor: 'Intel Core i3 3rd Gen (3.30 GHz)',
    ram: '8GB DDR3',
    storage: '256GB Fast SSD',
    monitor: 'Zebronics 19-inch HD LED',
    motherboard: 'Intel H61 Express',
    in_stock: true,
    pc_tier: 'Complete Desktop Setup (PC + 19" Monitor at ₹9,999)'
  },
  in_stock: true
};

// Filter out any existing item with same id if already present
const existing = (products.gaming_pc || []).filter(x => x.id !== newPrebuilt.id);

// Put the new i3 3rd Gen + 19" Zebronics monitor PC at the top of pre-builts!
products.gaming_pc = [newPrebuilt, ...existing];

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Added new pre-built PC! Total pre-builts: ${products.gaming_pc.length}`);
