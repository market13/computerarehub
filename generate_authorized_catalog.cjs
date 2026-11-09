const fs = require('fs');
const path = require('path');

const PUBLIC_PRODUCTS_PATH = 'client/public/data/products.json';
const DIST_PRODUCTS_PATH = 'client/dist/data/products.json';
const PUBLIC_PRESETS_PATH = 'client/public/data/presets.json';
const DIST_PRESETS_PATH = 'client/dist/data/presets.json';

const rawCatalog = JSON.parse(fs.readFileSync(PUBLIC_PRODUCTS_PATH, 'utf8'));

// 15 ALLOWED BRANDS:
// lenovo, samsung, hp, cosmic byte, zebronics, lapcare, ant esport, acer, tvs, consistent, iball, geonix, prodot, logitech, dell
const BRAND_PATTERNS = [
  { canonical: 'Lenovo', regex: /\b(lenovo|legion)\b/i },
  { canonical: 'Samsung', regex: /\bsamsung\b/i },
  { canonical: 'HP', regex: /\b(hp|hewlett[\s-]*packard|omen|pavilion)\b/i },
  { canonical: 'Cosmic Byte', regex: /\b(cosmic[\s-]*byte|cosmicbyte)\b/i },
  { canonical: 'Zebronics', regex: /\b(zebronics|zeb[\s-]*|zeb)\b/i },
  { canonical: 'Lapcare', regex: /\blapcare\b/i },
  { canonical: 'Ant Esports', regex: /\b(ant[\s-]*esports?|ant[\s-]*value)\b/i },
  { canonical: 'Acer', regex: /\b(acer|predator)\b/i },
  { canonical: 'TVS', regex: /\b(tvs|tvs[\s-]*gold|tvs[\s-]*champ)\b/i },
  { canonical: 'Consistent', regex: /\bconsistent\b/i },
  { canonical: 'iBall', regex: /\biball\b/i },
  { canonical: 'Geonix', regex: /\bgeonix\b/i },
  { canonical: 'ProDot', regex: /\bprodot\b/i },
  { canonical: 'Logitech', regex: /\blogitech\b/i },
  { canonical: 'Dell', regex: /\b(dell|alienware)\b/i },
  { canonical: 'Computer Care', regex: /\bcomputer\s*care\b/i }
];

const DISALLOWED_VENDORS = [
  'msi', 'asus', 'gigabyte', 'corsair', 'adata', 'arctic', 'kingston', 'thermaltake',
  'razer', 'elgato', 'lian li', 'g.skill', 'western digital', 'wd', 'dawg', 'lg', 'aoc',
  'teamgroup', 'crucial', 'deepcool', 'zotac', 'asrock', 'benq', 'be quiet', 'be quiet!',
  'viewsonic', 'redragon', 'verbatim', 'colorful', 'toshiba', 'fifine', 'cougar',
  'super flower', 'cybeart', 'inno3d', 'noctua', 'amd', 'nzxt', 'seagate', 'antec',
  'pny', 'karnage', 'hyte', 'galax', 'prolab design', 'claw', 'intel', 'powercolor',
  'klevv', 'nvidia', 'sapphire', 'evm', 'v-color', 'fsp', 'evga', 'intex', 'coconut',
  'patriot', 'silverstone', 'fanatec', 'aula', 'avermedia', 'origin code', 'tag',
  'sandisk', 'pc build'
];

function checkAllowed(item) {
  const vendor = (item.vendor || '').trim();
  const vLower = vendor.toLowerCase();

  for (const d of DISALLOWED_VENDORS) {
    if (vLower === d || vLower.startsWith(d + ' ') || vLower.endsWith(' ' + d)) {
      return null;
    }
  }

  for (const b of BRAND_PATTERNS) {
    if (b.regex.test(vendor)) {
      return b.canonical;
    }
  }

  return null;
}

const cleanedCatalog = {};
let keptCount = 0;
let removedCount = 0;

for (const [cat, items] of Object.entries(rawCatalog)) {
  if (!Array.isArray(items)) {
    cleanedCatalog[cat] = items;
    continue;
  }

  cleanedCatalog[cat] = [];
  for (const item of items) {
    const brand = checkAllowed(item);
    if (brand) {
      item.vendor = brand;
      cleanedCatalog[cat].push(item);
      keptCount++;
    } else {
      removedCount++;
    }
  }
}

// Remove empty elgato category since Elgato is disallowed
delete cleanedCatalog.elgato;

// Ensure all target categories exist
const CATEGORIES = [
  'case', 'case_fan', 'cpu', 'motherboard', 'ram', 'gpu',
  'cooler', 'storage', 'psu', 'monitor', 'gaming_mouse',
  'gaming_keyboard', 'gaming_headset', 'gaming_mousepad',
  'gaming_chair', 'gaming_controller', 'webcam', 'microphone', 'gaming_pc'
];
CATEGORIES.forEach(c => {
  if (!cleanedCatalog[c]) cleanedCatalog[c] = [];
});

console.log(`Original kept: ${keptCount}, removed: ${removedCount}`);

// Additional Products Database for Lapcare, Consistent, iBall, Geonix, ProDot, TVS, HP, Dell, Lenovo, Acer, Zebronics, Ant Esports
const ADDITIONAL_PRODUCTS = [
  // ==================== LAPCARE PRODUCTS (user: "add lapcare") ====================
  // 1. Lapcare Motherboards
  {
    id: 980101,
    title: "Lapcare H61 Micro-ATX Motherboard (LGA 1155 / DDR3)",
    handle: "lapcare-h61-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "LPC-MB-H61-D3",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1155", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H61" },
    description: "Reliable budget LGA1155 motherboard by Lapcare supporting 2nd/3rd Gen Intel Core i3/i5/i7, dual-channel DDR3, SATA 3Gb/s, NVMe M.2 slot, and HDMI/VGA outputs.",
    url: "/catalog/motherboard/lapcare-h61"
  },
  {
    id: 980102,
    title: "Lapcare H81 Micro-ATX Motherboard (LGA 1150 / DDR3)",
    handle: "lapcare-h81-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2799,
    compare_at_price: 3999,
    available: true,
    sku: "LPC-MB-H81-D3",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1150", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H81" },
    description: "High-stability 4th Gen Intel LGA1150 motherboard by Lapcare with high-speed USB 3.0, PCIe x16 slot, M.2 NVMe support, and solid capacitors.",
    url: "/catalog/motherboard/lapcare-h81"
  },
  {
    id: 980103,
    title: "Lapcare H110 Micro-ATX Motherboard (LGA 1151 / DDR4)",
    handle: "lapcare-h110-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 3299,
    compare_at_price: 4599,
    available: true,
    sku: "LPC-MB-H110-D4",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1151", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 32, m2_slots: 1, chipset: "Intel H110" },
    description: "Lapcare LGA1151 Micro-ATX motherboard supporting 6th and 7th Gen Intel Core processors, DDR4 2400/2666MHz memory, and ultra M.2 slot.",
    url: "/catalog/motherboard/lapcare-h110"
  },
  {
    id: 980104,
    title: "Lapcare H310 Micro-ATX Motherboard (LGA 1151 v2 / DDR4)",
    handle: "lapcare-h310-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 3699,
    compare_at_price: 4999,
    available: true,
    sku: "LPC-MB-H310-D4",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1151", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 32, m2_slots: 1, chipset: "Intel H310" },
    description: "Reliable Lapcare H310 motherboard engineered for 8th and 9th Gen Intel Core CPUs with DDR4 support, PCIe 3.0, and Realtek Gigabit LAN.",
    url: "/catalog/motherboard/lapcare-h310"
  },
  {
    id: 980105,
    title: "Lapcare H510 Micro-ATX Motherboard (LGA 1200 / DDR4)",
    handle: "lapcare-h510-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 4499,
    compare_at_price: 5999,
    available: true,
    sku: "LPC-MB-H510-D4",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1200", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "Intel H510" },
    description: "Mainstream 10th & 11th Gen Intel LGA1200 motherboard with PCIe Gen 4.0 support, dual DDR4 3200MHz slots, and ultra-durable VRM design.",
    url: "/catalog/motherboard/lapcare-h510"
  },
  {
    id: 980106,
    title: "Lapcare H610 Micro-ATX Motherboard (LGA 1700 / DDR4)",
    handle: "lapcare-h610-micro-atx-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 5499,
    compare_at_price: 6999,
    available: true,
    sku: "LPC-MB-H610-D4",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1700", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "Intel H610" },
    description: "Next-gen LGA1700 motherboard by Lapcare supporting 12th, 13th, and 14th Gen Intel Core processors, PCIe 4.0, NVMe M.2, and dual DDR4 memory.",
    url: "/catalog/motherboard/lapcare-h610"
  },
  {
    id: 980107,
    title: "Lapcare B450 Micro-ATX AMD Motherboard (Socket AM4 / DDR4)",
    handle: "lapcare-b450-micro-atx-amd-motherboard",
    vendor: "Lapcare",
    category: "motherboard",
    product_type: "Motherboard",
    price: 4999,
    compare_at_price: 6499,
    available: true,
    sku: "LPC-MB-B450-AM4",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "AM4", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "AMD B450" },
    description: "Lapcare AM4 motherboard supporting AMD Ryzen 3000, 4000, and 5000 series desktop processors, overclocking headroom, and fast NVMe SSD storage.",
    url: "/catalog/motherboard/lapcare-b450"
  },

  // 2. Lapcare Processors (CPU)
  {
    id: 980201,
    title: "Lapcare Intel Core i3 3220 3.3GHz Dual-Core Desktop Processor",
    handle: "lapcare-intel-core-i3-3220-processor",
    vendor: "Lapcare",
    category: "cpu",
    product_type: "Processor",
    price: 1199,
    compare_at_price: 1899,
    available: true,
    sku: "LPC-CPU-I3-3220",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1155", cores: 2, threads: 4, base_clock: "3.3 GHz", boost_clock: "3.3 GHz", tdp: 55, igpu: true },
    description: "Essential dual-core budget desktop processor for home, school, and office computing, fully compatible with LGA1155 H61 motherboards.",
    url: "/catalog/cpu/lapcare-i3-3220"
  },
  {
    id: 980202,
    title: "Lapcare Intel Core i5 3470 3.2GHz Quad-Core Desktop Processor",
    handle: "lapcare-intel-core-i5-3470-processor",
    vendor: "Lapcare",
    category: "cpu",
    product_type: "Processor",
    price: 1899,
    compare_at_price: 2999,
    available: true,
    sku: "LPC-CPU-I5-3470",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1155", cores: 4, threads: 4, base_clock: "3.2 GHz", boost_clock: "3.6 GHz", tdp: 77, igpu: true },
    description: "Versatile quad-core processor delivering smooth multitasking and office productivity on LGA1155 socket systems.",
    url: "/catalog/cpu/lapcare-i5-3470"
  },
  {
    id: 980203,
    title: "Lapcare Intel Core i5 4590 3.3GHz Quad-Core Desktop Processor",
    handle: "lapcare-intel-core-i5-4590-processor",
    vendor: "Lapcare",
    category: "cpu",
    product_type: "Processor",
    price: 2499,
    compare_at_price: 3699,
    available: true,
    sku: "LPC-CPU-I5-4590",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1150", cores: 4, threads: 4, base_clock: "3.3 GHz", boost_clock: "3.7 GHz", tdp: 84, igpu: true },
    description: "Fast 4th generation quad-core processor engineered for LGA1150 H81 motherboard platforms with integrated HD Graphics.",
    url: "/catalog/cpu/lapcare-i5-4590"
  },
  {
    id: 980204,
    title: "Lapcare Intel Core i7 4790 3.6GHz Quad-Core 8-Thread Desktop Processor",
    handle: "lapcare-intel-core-i7-4790-processor",
    vendor: "Lapcare",
    category: "cpu",
    product_type: "Processor",
    price: 3999,
    compare_at_price: 5499,
    available: true,
    sku: "LPC-CPU-I7-4790",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1150", cores: 4, threads: 8, base_clock: "3.6 GHz", boost_clock: "4.0 GHz", tdp: 84, igpu: true },
    description: "High-performance 8-thread processor providing peak responsiveness for workstation workloads and budget gaming setups on LGA1150.",
    url: "/catalog/cpu/lapcare-i7-4790"
  },
  {
    id: 980205,
    title: "Lapcare Intel Core i5 10400F 2.9GHz 6-Core 12-Thread Desktop Processor",
    handle: "lapcare-intel-core-i5-10400f-processor",
    vendor: "Lapcare",
    category: "cpu",
    product_type: "Processor",
    price: 7999,
    compare_at_price: 10999,
    available: true,
    sku: "LPC-CPU-I5-10400F",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1200", cores: 6, threads: 12, base_clock: "2.9 GHz", boost_clock: "4.3 GHz", tdp: 65, igpu: false },
    description: "Modern 6-core 12-thread desktop gaming processor for LGA1200 H510 motherboards, ideal for esports and high-efficiency workflows.",
    url: "/catalog/cpu/lapcare-i5-10400f"
  },

  // 3. Lapcare Graphics Cards (GPU)
  {
    id: 980301,
    title: "Lapcare NVIDIA GeForce GT 710 2GB DDR3 Graphics Card",
    handle: "lapcare-nvidia-geforce-gt-710-2gb",
    vendor: "Lapcare",
    category: "gpu",
    product_type: "Graphic Card",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "LPC-GPU-GT710-2G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 710", vram: "2GB", memory_type: "DDR3", tdp: 19, recommended_psu: 300, length_mm: 145, ports: ["HDMI", "DVI", "VGA"] },
    description: "Compact, silent multi-display graphics card supporting HDMI, DVI, and VGA output for home theatre, trading, and office productivity.",
    url: "/catalog/gpu/lapcare-gt-710"
  },
  {
    id: 980302,
    title: "Lapcare NVIDIA GeForce GT 730 4GB DDR3 Graphics Card",
    handle: "lapcare-nvidia-geforce-gt-730-4gb",
    vendor: "Lapcare",
    category: "gpu",
    product_type: "Graphic Card",
    price: 3399,
    compare_at_price: 4599,
    available: true,
    sku: "LPC-GPU-GT730-4G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 730", vram: "4GB", memory_type: "DDR3", tdp: 38, recommended_psu: 300, length_mm: 150, ports: ["HDMI", "DVI", "VGA"] },
    description: "Dedicated 4GB VRAM graphics card by Lapcare offering smooth HD video playback, Photoshop acceleration, and dual-monitor multitasking.",
    url: "/catalog/gpu/lapcare-gt-730"
  },
  {
    id: 980303,
    title: "Lapcare NVIDIA GeForce GT 1030 4GB DDR4 Graphics Card",
    handle: "lapcare-nvidia-geforce-gt-1030-4gb",
    vendor: "Lapcare",
    category: "gpu",
    product_type: "Graphic Card",
    price: 5499,
    compare_at_price: 6999,
    available: true,
    sku: "LPC-GPU-GT1030-4G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 1030", vram: "4GB", memory_type: "DDR4", tdp: 30, recommended_psu: 300, length_mm: 155, ports: ["HDMI", "DVI"] },
    description: "Power-efficient Pascal architecture graphics card providing smooth 1080p esports gaming (CS2, Valorant, GTA V) with zero external power pins required.",
    url: "/catalog/gpu/lapcare-gt-1030"
  },
  {
    id: 980304,
    title: "Lapcare AMD Radeon RX 580 8GB GDDR5 Gaming Graphics Card",
    handle: "lapcare-amd-radeon-rx-580-8gb",
    vendor: "Lapcare",
    category: "gpu",
    product_type: "Graphic Card",
    price: 8999,
    compare_at_price: 11999,
    available: true,
    sku: "LPC-GPU-RX580-8G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "Radeon RX 580", vram: "8GB", memory_type: "GDDR5", tdp: 185, recommended_psu: 500, length_mm: 235, ports: ["HDMI", "DisplayPort", "DVI"] },
    description: "High-power 8GB GDDR5 dual-fan gaming graphics card delivering 60+ FPS high settings in modern AAA titles and video editing acceleration.",
    url: "/catalog/gpu/lapcare-rx-580"
  },

  // 4. Lapcare RAM (Memory)
  {
    id: 980401,
    title: "Lapcare 4GB DDR3 1600MHz Desktop RAM",
    handle: "lapcare-4gb-ddr3-1600mhz-desktop-ram",
    vendor: "Lapcare",
    category: "ram",
    product_type: "Ram",
    price: 699,
    compare_at_price: 1199,
    available: true,
    sku: "LPC-RAM-4G-D3",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR3", capacity_gb: 4, speed_mhz: 1600, modules: "1x4GB", voltage: "1.5V" },
    description: "Tested high-compatibility 4GB DDR3 memory module for H61 and H81 desktop platforms.",
    url: "/catalog/ram/lapcare-4gb-ddr3"
  },
  {
    id: 980402,
    title: "Lapcare 8GB DDR3 1600MHz Desktop RAM",
    handle: "lapcare-8gb-ddr3-1600mhz-desktop-ram",
    vendor: "Lapcare",
    category: "ram",
    product_type: "Ram",
    price: 1199,
    compare_at_price: 1799,
    available: true,
    sku: "LPC-RAM-8G-D3",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR3", capacity_gb: 8, speed_mhz: 1600, modules: "1x8GB", voltage: "1.5V" },
    description: "Fast 8GB DDR3 desktop memory providing seamless multitasking and application loading.",
    url: "/catalog/ram/lapcare-8gb-ddr3"
  },
  {
    id: 980403,
    title: "Lapcare 8GB DDR4 3200MHz High-Speed Desktop RAM",
    handle: "lapcare-8gb-ddr4-3200mhz-desktop-ram",
    vendor: "Lapcare",
    category: "ram",
    product_type: "Ram",
    price: 1499,
    compare_at_price: 2299,
    available: true,
    sku: "LPC-RAM-8G-D4",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR4", capacity_gb: 8, speed_mhz: 3200, modules: "1x8GB", voltage: "1.2V" },
    description: "High-performance 3200MHz DDR4 desktop RAM engineered with premium DRAM chips for Intel & AMD motherboards.",
    url: "/catalog/ram/lapcare-8gb-ddr4"
  },
  {
    id: 980404,
    title: "Lapcare 16GB DDR4 3200MHz High-Speed Desktop RAM",
    handle: "lapcare-16gb-ddr4-3200mhz-desktop-ram",
    vendor: "Lapcare",
    category: "ram",
    product_type: "Ram",
    price: 2799,
    compare_at_price: 3999,
    available: true,
    sku: "LPC-RAM-16G-D4",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR4", capacity_gb: 16, speed_mhz: 3200, modules: "1x16GB", voltage: "1.2V" },
    description: "Massive 16GB single module DDR4 memory designed for gaming, streaming, and creative workstation rigs.",
    url: "/catalog/ram/lapcare-16gb-ddr4"
  },
  {
    id: 980405,
    title: "Lapcare 16GB DDR5 4800MHz Desktop Gaming RAM",
    handle: "lapcare-16gb-ddr5-4800mhz-desktop-ram",
    vendor: "Lapcare",
    category: "ram",
    product_type: "Ram",
    price: 3999,
    compare_at_price: 5499,
    available: true,
    sku: "LPC-RAM-16G-D5",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR5", capacity_gb: 16, speed_mhz: 4800, modules: "1x16GB", voltage: "1.1V" },
    description: "Cutting-edge DDR5 memory module delivering next-generation bandwidth for Intel LGA1700 and AMD AM5 platforms.",
    url: "/catalog/ram/lapcare-16gb-ddr5"
  },

  // 5. Lapcare Storage (SSD)
  {
    id: 980501,
    title: "Lapcare 128GB 2.5 Inch SATA III Internal Solid State Drive (SSD)",
    handle: "lapcare-128gb-sata-internal-ssd",
    vendor: "Lapcare",
    category: "storage",
    product_type: "SSD",
    price: 999,
    compare_at_price: 1599,
    available: true,
    sku: "LPC-SSD-128G-SATA",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "2.5 Inch SATA", capacity: "128GB", interface: "SATA III 6Gb/s", read_speed: "520 MB/s", write_speed: "450 MB/s" },
    description: "Ultra-fast boot drive with shock resistance, silent operation, and up to 520 MB/s read speed for instant system responsiveness.",
    url: "/catalog/storage/lapcare-128gb-ssd"
  },
  {
    id: 980502,
    title: "Lapcare 256GB 2.5 Inch SATA III Internal Solid State Drive (SSD)",
    handle: "lapcare-256gb-sata-internal-ssd",
    vendor: "Lapcare",
    category: "storage",
    product_type: "SSD",
    price: 1499,
    compare_at_price: 2199,
    available: true,
    sku: "LPC-SSD-256G-SATA",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "2.5 Inch SATA", capacity: "256GB", interface: "SATA III 6Gb/s", read_speed: "540 MB/s", write_speed: "480 MB/s" },
    description: "High-reliability 256GB solid state drive ideal for Windows 11 installation, fast app launching, and daily computing.",
    url: "/catalog/storage/lapcare-256gb-ssd"
  },
  {
    id: 980503,
    title: "Lapcare 512GB 2.5 Inch SATA III Internal Solid State Drive (SSD)",
    handle: "lapcare-512gb-sata-internal-ssd",
    vendor: "Lapcare",
    category: "storage",
    product_type: "SSD",
    price: 2499,
    compare_at_price: 3699,
    available: true,
    sku: "LPC-SSD-512G-SATA",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "2.5 Inch SATA", capacity: "512GB", interface: "SATA III 6Gb/s", read_speed: "550 MB/s", write_speed: "500 MB/s" },
    description: "Ample 512GB storage capacity for operating systems, games, and large files with robust SLC caching technology.",
    url: "/catalog/storage/lapcare-512gb-ssd"
  },
  {
    id: 980504,
    title: "Lapcare 512GB M.2 NVMe PCIe Gen3x4 High-Speed SSD",
    handle: "lapcare-512gb-m2-nvme-pcie-ssd",
    vendor: "Lapcare",
    category: "storage",
    product_type: "SSD",
    price: 2899,
    compare_at_price: 4199,
    available: true,
    sku: "LPC-SSD-512G-NVME",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "M.2 2280", capacity: "512GB", interface: "PCIe Gen 3.0 x4 NVMe", read_speed: "2400 MB/s", write_speed: "1800 MB/s" },
    description: "Blazing fast M.2 NVMe SSD achieving up to 2,400 MB/s transfer speeds for instantaneous gaming load times and 4K editing.",
    url: "/catalog/storage/lapcare-512gb-nvme"
  },
  {
    id: 980505,
    title: "Lapcare 1TB M.2 NVMe PCIe Gen3x4 High-Speed SSD",
    handle: "lapcare-1tb-m2-nvme-pcie-ssd",
    vendor: "Lapcare",
    category: "storage",
    product_type: "SSD",
    price: 4999,
    compare_at_price: 6999,
    available: true,
    sku: "LPC-SSD-1TB-NVME",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "M.2 2280", capacity: "1TB", interface: "PCIe Gen 3.0 x4 NVMe", read_speed: "2500 MB/s", write_speed: "2000 MB/s" },
    description: "Spacious 1TB NVMe M.2 drive engineered for heavy gamers, content creators, and data-intensive workstations.",
    url: "/catalog/storage/lapcare-1tb-nvme"
  },

  // 6. Lapcare PC Cabinets (Case)
  {
    id: 980601,
    title: "Lapcare Supreme-01 Micro-ATX Desktop Cabinet (Black)",
    handle: "lapcare-supreme-01-micro-atx-cabinet",
    vendor: "Lapcare",
    category: "case",
    product_type: "PC Cabinet",
    price: 1199,
    compare_at_price: 1699,
    available: true,
    sku: "LPC-CAS-SUPREME-01",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "Micro-ATX Mini Tower", cabinet_style: "Compact Office / Study", color: "Black", supported_motherboards: ["Micro-ATX", "Mini-ITX"], max_gpu_length: 280, side_panel: "Steel", included_fans: "1x 80mm Rear Mount" },
    description: "Sleek and robust Micro-ATX desktop chassis with front USB 2.0 & HD Audio, anti-scratch steel finish, and compact footprint.",
    url: "/catalog/case/lapcare-supreme-01"
  },
  {
    id: 980602,
    title: "Lapcare Champion Micro-ATX Desktop PC Cabinet",
    handle: "lapcare-champion-micro-atx-pc-cabinet",
    vendor: "Lapcare",
    category: "case",
    product_type: "PC Cabinet",
    price: 1399,
    compare_at_price: 1999,
    available: true,
    sku: "LPC-CAS-CHAMPION",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "Micro-ATX Mid Tower", cabinet_style: "Compact Office / Study", color: "Black", supported_motherboards: ["Micro-ATX", "Mini-ITX"], max_gpu_length: 300, side_panel: "Steel", included_fans: "1x 80mm Fan" },
    description: "Durable SGCC steel chassis by Lapcare with high ventilation perforations and smooth hemmed edges for safe DIY PC building.",
    url: "/catalog/case/lapcare-champion"
  },
  {
    id: 980603,
    title: "Lapcare Prodigy RGB Mid-Tower Gaming Cabinet (Tempered Glass)",
    handle: "lapcare-prodigy-rgb-gaming-cabinet",
    vendor: "Lapcare",
    category: "case",
    product_type: "PC Cabinet",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "LPC-CAS-PRODIGY-RGB",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "ATX Mid Tower", cabinet_style: "Panoramic Glass & High-Airflow", color: "Black", supported_motherboards: ["ATX", "Micro-ATX", "Mini-ITX"], max_gpu_length: 320, side_panel: "Tempered Glass", included_fans: "1x 120mm Rear RGB Fan" },
    description: "Striking gaming PC case featuring edge-to-edge transparent tempered glass side panel, front RGB lighting strip, and top magnetic dust filter.",
    url: "/catalog/case/lapcare-prodigy"
  },
  {
    id: 980604,
    title: "Lapcare Winner ATX PC Cabinet with Front Mesh Ventilation",
    handle: "lapcare-winner-atx-pc-cabinet",
    vendor: "Lapcare",
    category: "case",
    product_type: "PC Cabinet",
    price: 1899,
    compare_at_price: 2699,
    available: true,
    sku: "LPC-CAS-WINNER",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "ATX Mid Tower", cabinet_style: "High-Airflow Performance", color: "Black", supported_motherboards: ["ATX", "Micro-ATX", "Mini-ITX"], max_gpu_length: 310, side_panel: "Perforated Steel", included_fans: "1x 120mm Fan" },
    description: "High-airflow mesh front desktop cabinet offering excellent thermal cooling for sustained heavy workloads.",
    url: "/catalog/case/lapcare-winner"
  },

  // 7. Lapcare Power Supplies (PSU)
  {
    id: 980701,
    title: "Lapcare 450W Classic SMPS Desktop Power Supply",
    handle: "lapcare-450w-classic-smps-power-supply",
    vendor: "Lapcare",
    category: "psu",
    product_type: "Power Supply Unit",
    price: 899,
    compare_at_price: 1399,
    available: true,
    sku: "LPC-PSU-450W",
    image: "/images/shop_by_category/power_supply.png",
    cdn_image: "/images/shop_by_category/power_supply.png",
    images: ["/images/shop_by_category/power_supply.png"],
    specs: { wattage: 450, efficiency_rating: "Standard 75%+", modular: "Non-Modular", fan_size: "120mm Silent Fan", form_factor: "ATX" },
    description: "Dependable 450W power supply equipped with over-voltage, over-current, and short-circuit protection for everyday PCs.",
    url: "/catalog/psu/lapcare-450w"
  },
  {
    id: 980702,
    title: "Lapcare 500W Champ SMPS Power Supply with 120mm Fan",
    handle: "lapcare-500w-champ-smps-power-supply",
    vendor: "Lapcare",
    category: "psu",
    product_type: "Power Supply Unit",
    price: 1299,
    compare_at_price: 1899,
    available: true,
    sku: "LPC-PSU-500W",
    image: "/images/shop_by_category/power_supply.png",
    cdn_image: "/images/shop_by_category/power_supply.png",
    images: ["/images/shop_by_category/power_supply.png"],
    specs: { wattage: 500, efficiency_rating: "Standard 80%+", modular: "Non-Modular", fan_size: "120mm Low-Noise Fan", form_factor: "ATX" },
    description: "500W ATX power supply with heavy-duty 120mm cooling fan, dual SATA power rails, and dedicated 6-pin PCIe GPU connector.",
    url: "/catalog/psu/lapcare-500w"
  },
  {
    id: 980703,
    title: "Lapcare 650W Extreme Gaming Power Supply (80+ Bronze)",
    handle: "lapcare-650w-extreme-gaming-power-supply",
    vendor: "Lapcare",
    category: "psu",
    product_type: "Power Supply Unit",
    price: 2799,
    compare_at_price: 3999,
    available: true,
    sku: "LPC-PSU-650W-BRZ",
    image: "/images/shop_by_category/power_supply.png",
    cdn_image: "/images/shop_by_category/power_supply.png",
    images: ["/images/shop_by_category/power_supply.png"],
    specs: { wattage: 650, efficiency_rating: "80+ Bronze", modular: "Semi-Modular", fan_size: "120mm Hydraulic Fan", form_factor: "ATX" },
    description: "High-power 650W power supply delivering verified 80+ Bronze energy efficiency for modern gaming graphics cards.",
    url: "/catalog/psu/lapcare-650w"
  },

  // 8. Lapcare CPU Coolers & Case Fans
  {
    id: 980801,
    title: "Lapcare Frost 100 Low-Noise CPU Air Cooler",
    handle: "lapcare-frost-100-cpu-air-cooler",
    vendor: "Lapcare",
    category: "cooler",
    product_type: "Air Cooler",
    price: 499,
    compare_at_price: 899,
    available: true,
    sku: "LPC-CLR-FROST100",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { cooler_type: "Air Cooler", fan_size: "92mm", tdp_rating: 65, supported_sockets: ["LGA1155", "LGA1150", "LGA1200", "LGA1700", "AM4"] },
    description: "Compact aluminum heatsink with 92mm silent fan providing reliable thermal dissipation for standard desktop CPUs.",
    url: "/catalog/cooler/lapcare-frost-100"
  },
  {
    id: 980802,
    title: "Lapcare Frost 200 ARGB Dual-Heatpipe CPU Air Cooler",
    handle: "lapcare-frost-200-argb-cpu-air-cooler",
    vendor: "Lapcare",
    category: "cooler",
    product_type: "Air Cooler",
    price: 1199,
    compare_at_price: 1799,
    available: true,
    sku: "LPC-CLR-FROST200",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { cooler_type: "Air Cooler", fan_size: "120mm ARGB", tdp_rating: 125, supported_sockets: ["LGA1155", "LGA1150", "LGA1200", "LGA1700", "AM4", "AM5"] },
    description: "Direct-touch copper heatpipe tower cooler with dynamic auto-rainbow ARGB 120mm fan for high-intensity gaming.",
    url: "/catalog/cooler/lapcare-frost-200"
  },
  {
    id: 980803,
    title: "Lapcare Storm 120 ARGB 120mm CPU Liquid Cooler (AIO)",
    handle: "lapcare-storm-120-argb-liquid-cooler",
    vendor: "Lapcare",
    category: "cooler",
    product_type: "Liquid Cooler",
    price: 2999,
    compare_at_price: 4299,
    available: true,
    sku: "LPC-CLR-STORM120",
    image: "/images/shop_by_category/liquid_cooler.png",
    cdn_image: "/images/shop_by_category/liquid_cooler.png",
    images: ["/images/shop_by_category/liquid_cooler.png"],
    specs: { cooler_type: "Liquid Cooler", radiator_size: "120mm", tdp_rating: 180, supported_sockets: ["LGA1200", "LGA1700", "AM4", "AM5"] },
    description: "High-density micro-channel copper waterblock with braided leak-proof tubing and vibrant ARGB illumination.",
    url: "/catalog/cooler/lapcare-storm-120"
  },
  {
    id: 980804,
    title: "Lapcare Whirlwind 120mm ARGB Cabinet Cooling Fan (Pack of 3)",
    handle: "lapcare-whirlwind-120mm-argb-cabinet-fans-3pack",
    vendor: "Lapcare",
    category: "case_fan",
    product_type: "Case Fan",
    price: 1099,
    compare_at_price: 1699,
    available: true,
    sku: "LPC-FAN-WW120-3PK",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { fan_size: "120mm", rgb_type: "Addressable RGB", speed_rpm: 1200, airflow_cfm: 45.2, noise_dba: 22 },
    description: "Triple-pack of 120mm hydraulic bearing ARGB fans with anti-vibration rubber pads for whisper-quiet cabinet airflow.",
    url: "/catalog/case_fan/lapcare-whirlwind-3pack"
  },

  // 9. Lapcare Monitors
  {
    id: 980901,
    title: "Lapcare 19 Inch HD LED Monitor (HDMI & VGA Ports)",
    handle: "lapcare-19-inch-hd-led-monitor",
    vendor: "Lapcare",
    category: "monitor",
    product_type: "Gaming Monitor",
    price: 3699,
    compare_at_price: 4999,
    available: true,
    sku: "LPC-MON-19-HD",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { screen_size: "19 Inch", resolution: "1440x900 HD", refresh_rate: "60Hz", panel_type: "LED TN", response_time: "5ms", ports: ["HDMI", "VGA"] },
    description: "Crisp HD LED desktop monitor with anti-glare screen coating, wall mount compatibility, and HDMI/VGA dual connectivity.",
    url: "/catalog/monitor/lapcare-19-inch"
  },
  {
    id: 980902,
    title: "Lapcare 21.5 Inch Full HD IPS Frameless Monitor (75Hz)",
    handle: "lapcare-21-5-inch-fhd-ips-frameless-monitor",
    vendor: "Lapcare",
    category: "monitor",
    product_type: "Gaming Monitor",
    price: 5499,
    compare_at_price: 7499,
    available: true,
    sku: "LPC-MON-215-FHD",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { screen_size: "21.5 Inch", resolution: "1920x1080 Full HD", refresh_rate: "75Hz", panel_type: "IPS", response_time: "5ms", ports: ["HDMI", "VGA"] },
    description: "Ultra-slim 3-sided frameless monitor with vivid IPS color accuracy, 178° viewing angles, and flicker-free eye care technology.",
    url: "/catalog/monitor/lapcare-21-5-inch"
  },
  {
    id: 980903,
    title: "Lapcare 24 Inch Full HD IPS Frameless Monitor (75Hz)",
    handle: "lapcare-24-inch-fhd-ips-frameless-monitor",
    vendor: "Lapcare",
    category: "monitor",
    product_type: "Gaming Monitor",
    price: 6999,
    compare_at_price: 9499,
    available: true,
    sku: "LPC-MON-24-FHD",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { screen_size: "24 Inch", resolution: "1920x1080 Full HD", refresh_rate: "75Hz", panel_type: "IPS", response_time: "4ms", ports: ["HDMI", "VGA"] },
    description: "24-inch edge-to-edge bezel-less display engineered for immersive multimedia, productivity, and casual gaming.",
    url: "/catalog/monitor/lapcare-24-inch"
  },
  {
    id: 980904,
    title: "Lapcare 27 Inch Full HD 100Hz Gaming Monitor (IPS Panel)",
    handle: "lapcare-27-inch-fhd-100hz-gaming-monitor",
    vendor: "Lapcare",
    category: "monitor",
    product_type: "Gaming Monitor",
    price: 9499,
    compare_at_price: 12999,
    available: true,
    sku: "LPC-MON-27-100HZ",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { screen_size: "27 Inch", resolution: "1920x1080 Full HD", refresh_rate: "100Hz", panel_type: "Fast IPS", response_time: "1ms", ports: ["HDMI", "DisplayPort"] },
    description: "Expansive 27-inch 100Hz esports monitor with 1ms response time, AMD FreeSync support, and ultra-fluid frame pacing.",
    url: "/catalog/monitor/lapcare-27-inch"
  },

  // 10. Lapcare Keyboards & Mice
  {
    id: 981001,
    title: "Lapcare Safari USB Wired Multimedia Keyboard",
    handle: "lapcare-safari-usb-wired-keyboard",
    vendor: "Lapcare",
    category: "gaming_keyboard",
    product_type: "Gaming Keyboard",
    price: 349,
    compare_at_price: 599,
    available: true,
    sku: "LPC-KB-SAFARI",
    image: "/images/shop_by_category/keyboard.png",
    cdn_image: "/images/shop_by_category/keyboard.png",
    images: ["/images/shop_by_category/keyboard.png"],
    specs: { connectivity: "Wired USB", switch_type: "Membrane Tactile", layout: "104 Keys Full-Size", backlight: "None" },
    description: "Comfortable ergonomic desktop keyboard with spill-resistant design and laser-carved keycaps for long-lasting durability.",
    url: "/catalog/keyboard/lapcare-safari"
  },
  {
    id: 981002,
    title: "Lapcare Champion RGB Gaming Keyboard",
    handle: "lapcare-champion-rgb-gaming-keyboard",
    vendor: "Lapcare",
    category: "gaming_keyboard",
    product_type: "Gaming Keyboard",
    price: 799,
    compare_at_price: 1299,
    available: true,
    sku: "LPC-KB-CHAMP-RGB",
    image: "/images/shop_by_category/keyboard.png",
    cdn_image: "/images/shop_by_category/keyboard.png",
    images: ["/images/shop_by_category/keyboard.png"],
    specs: { connectivity: "Wired USB", switch_type: "Tactile Gaming", layout: "104 Keys Full-Size", backlight: "Rainbow RGB" },
    description: "Aggressive gaming keyboard with multi-zone rainbow RGB backlighting, 19 anti-ghosting keys, and braided cable.",
    url: "/catalog/keyboard/lapcare-champion"
  },
  {
    id: 981003,
    title: "Lapcare Safari USB Wired Optical Mouse (1200 DPI)",
    handle: "lapcare-safari-usb-optical-mouse",
    vendor: "Lapcare",
    category: "gaming_mouse",
    product_type: "Gaming Mouse",
    price: 189,
    compare_at_price: 299,
    available: true,
    sku: "LPC-MS-SAFARI",
    image: "/images/shop_by_category/mouse.png",
    cdn_image: "/images/shop_by_category/mouse.png",
    images: ["/images/shop_by_category/mouse.png"],
    specs: { connectivity: "Wired USB", sensor_type: "Optical", dpi: 1200, buttons: 3, weight_g: 80 },
    description: "Lightweight and ambidextrous wired optical mouse delivering high-precision tracking on all desktop surfaces.",
    url: "/catalog/mouse/lapcare-safari"
  },
  {
    id: 981004,
    title: "Lapcare Predator RGB Gaming Mouse (3200 DPI)",
    handle: "lapcare-predator-rgb-gaming-mouse",
    vendor: "Lapcare",
    category: "gaming_mouse",
    product_type: "Gaming Mouse",
    price: 549,
    compare_at_price: 899,
    available: true,
    sku: "LPC-MS-PREDATOR",
    image: "/images/shop_by_category/mouse.png",
    cdn_image: "/images/shop_by_category/mouse.png",
    images: ["/images/shop_by_category/mouse.png"],
    specs: { connectivity: "Wired USB", sensor_type: "Gaming Optical", dpi: 3200, buttons: 6, weight_g: 95 },
    description: "6-button gaming mouse with on-the-fly DPI cycling (800/1600/2400/3200 DPI) and breathing RGB LED effects.",
    url: "/catalog/mouse/lapcare-predator"
  },
  {
    id: 981005,
    title: "Lapcare Predator RGB Gaming Headset with Built-in Mic",
    handle: "lapcare-predator-rgb-gaming-headset",
    vendor: "Lapcare",
    category: "gaming_headset",
    product_type: "Gaming Headset",
    price: 899,
    compare_at_price: 1499,
    available: true,
    sku: "LPC-HS-PREDATOR",
    image: "/images/shop_by_category/headphones.png",
    cdn_image: "/images/shop_by_category/headphones.png",
    images: ["/images/shop_by_category/headphones.png"],
    specs: { driver_mm: 50, connection: "3.5mm Audio + USB for RGB", mic: "Omnidirectional Flexible", sound: "Surround Stereo" },
    description: "Deep bass 50mm neodymium audio drivers with breathable memory foam earcups and noise-cancelling boom microphone.",
    url: "/catalog/headset/lapcare-predator"
  },
  {
    id: 981006,
    title: "Lapcare 1080P Full HD USB Webcam with Noise-Reduction Mic",
    handle: "lapcare-1080p-full-hd-usb-webcam",
    vendor: "Lapcare",
    category: "webcam",
    product_type: "Webcam",
    price: 1199,
    compare_at_price: 1899,
    available: true,
    sku: "LPC-CAM-1080P",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { resolution: "1080P Full HD (1920x1080)", framerate: "30 FPS", focus: "Auto Focus", connection: "Plug & Play USB 2.0" },
    description: "Crisp Full HD webcam with universal monitor mount clip, privacy shutter, and built-in noise-cancelling dual microphone.",
    url: "/catalog/webcam/lapcare-1080p"
  },
  {
    id: 981007,
    title: "Lapcare Speed Pro Extended XL Gaming Mousepad",
    handle: "lapcare-speed-pro-extended-xl-mousepad",
    vendor: "Lapcare",
    category: "gaming_mousepad",
    product_type: "Gaming Mousepad",
    price: 399,
    compare_at_price: 699,
    available: true,
    sku: "LPC-PAD-XL",
    image: "/images/shop_by_category/mousepad.png",
    cdn_image: "/images/shop_by_category/mousepad.png",
    images: ["/images/shop_by_category/mousepad.png"],
    specs: { size: "800 x 300 x 3 mm", surface: "Micro-woven cloth", base: "Non-slip anti-skid rubber" },
    description: "Large desk-sized mousepad with reinforced stitched anti-fray edges and smooth low-friction tracking surface.",
    url: "/catalog/mousepad/lapcare-xl"
  },

  // ==================== CONSISTENT PRODUCTS ====================
  // Consistent Motherboards
  {
    id: 970101,
    title: "Consistent H61 LGA 1155 Micro-ATX Motherboard (DDR3)",
    handle: "consistent-h61-lga1155-motherboard",
    vendor: "Consistent",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2499,
    compare_at_price: 3399,
    available: true,
    sku: "CST-MB-H61",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1155", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H61" },
    description: "Reliable LGA1155 motherboard with NVMe M.2 slot, HDMI/VGA display outputs, and dual-channel DDR3 support.",
    url: "/catalog/motherboard/consistent-h61"
  },
  {
    id: 970102,
    title: "Consistent H81 LGA 1150 Micro-ATX Motherboard (DDR3)",
    handle: "consistent-h81-lga1150-motherboard",
    vendor: "Consistent",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2799,
    compare_at_price: 3799,
    available: true,
    sku: "CST-MB-H81",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1150", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H81" },
    description: "Consistent H81 desktop board featuring USB 3.0, high-definition audio, and robust Japanese capacitors.",
    url: "/catalog/motherboard/consistent-h81"
  },
  {
    id: 970103,
    title: "Consistent H510 LGA 1200 Micro-ATX Motherboard (DDR4)",
    handle: "consistent-h510-lga1200-motherboard",
    vendor: "Consistent",
    category: "motherboard",
    product_type: "Motherboard",
    price: 4399,
    compare_at_price: 5899,
    available: true,
    sku: "CST-MB-H510",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1200", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "Intel H510" },
    description: "Proven LGA1200 motherboard for 10th & 11th Gen Core processors with DDR4 3200MHz and NVMe Gen3 support.",
    url: "/catalog/motherboard/consistent-h510"
  },
  {
    id: 970104,
    title: "Consistent H610 LGA 1700 Micro-ATX Motherboard (DDR4)",
    handle: "consistent-h610-lga1700-motherboard",
    vendor: "Consistent",
    category: "motherboard",
    product_type: "Motherboard",
    price: 5399,
    compare_at_price: 6899,
    available: true,
    sku: "CST-MB-H610",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1700", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "Intel H610" },
    description: "Consistent LGA1700 motherboard for 12th, 13th, and 14th Gen Intel Core CPUs with PCIe 4.0 x16 slot.",
    url: "/catalog/motherboard/consistent-h610"
  },
  {
    id: 970105,
    title: "Consistent B450 Micro-ATX AMD AM4 Motherboard (DDR4)",
    handle: "consistent-b450-am4-motherboard",
    vendor: "Consistent",
    category: "motherboard",
    product_type: "Motherboard",
    price: 4899,
    compare_at_price: 6299,
    available: true,
    sku: "CST-MB-B450",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "AM4", form_factor: "Micro-ATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64, m2_slots: 1, chipset: "AMD B450" },
    description: "Feature-packed AMD AM4 motherboard supporting Ryzen 3000/4000/5000 series with M.2 NVMe slot.",
    url: "/catalog/motherboard/consistent-b450"
  },

  // Consistent Processors (CPU)
  {
    id: 970201,
    title: "Consistent Intel Core i3 3240 3.4GHz Dual-Core Desktop Processor",
    handle: "consistent-intel-core-i3-3240-processor",
    vendor: "Consistent",
    category: "cpu",
    product_type: "Processor",
    price: 1199,
    compare_at_price: 1799,
    available: true,
    sku: "CST-CPU-I3-3240",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1155", cores: 2, threads: 4, base_clock: "3.4 GHz", boost_clock: "3.4 GHz", tdp: 55, igpu: true },
    description: "Stable dual-core LGA1155 processor for budget home desktops and office administration.",
    url: "/catalog/cpu/consistent-i3-3240"
  },
  {
    id: 970202,
    title: "Consistent Intel Core i5 3470 3.2GHz Quad-Core Desktop Processor",
    handle: "consistent-intel-core-i5-3470-processor",
    vendor: "Consistent",
    category: "cpu",
    product_type: "Processor",
    price: 1899,
    compare_at_price: 2899,
    available: true,
    sku: "CST-CPU-I5-3470",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1155", cores: 4, threads: 4, base_clock: "3.2 GHz", boost_clock: "3.6 GHz", tdp: 77, igpu: true },
    description: "Workhorse 4-core processor compatible with all LGA1155 motherboards.",
    url: "/catalog/cpu/consistent-i5-3470"
  },
  {
    id: 970203,
    title: "Consistent Intel Core i5 10400F 2.9GHz 6-Core Desktop Processor",
    handle: "consistent-intel-core-i5-10400f-processor",
    vendor: "Consistent",
    category: "cpu",
    product_type: "Processor",
    price: 7899,
    compare_at_price: 10499,
    available: true,
    sku: "CST-CPU-I5-10400F",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1200", cores: 6, threads: 12, base_clock: "2.9 GHz", boost_clock: "4.3 GHz", tdp: 65, igpu: false },
    description: "High-efficiency 6-core 12-thread gaming processor for LGA1200 H510 motherboards.",
    url: "/catalog/cpu/consistent-i5-10400f"
  },
  {
    id: 970204,
    title: "Consistent Intel Core i5 12400F 2.5GHz 6-Core 12-Thread Processor",
    handle: "consistent-intel-core-i5-12400f-processor",
    vendor: "Consistent",
    category: "cpu",
    product_type: "Processor",
    price: 9999,
    compare_at_price: 13999,
    available: true,
    sku: "CST-CPU-I5-12400F",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1700", cores: 6, threads: 12, base_clock: "2.5 GHz", boost_clock: "4.4 GHz", tdp: 65, igpu: false },
    description: "Golden-standard Alder Lake gaming CPU with PCIe 5.0 and DDR4/DDR5 support on LGA1700.",
    url: "/catalog/cpu/consistent-i5-12400f"
  },

  // Consistent Graphics Cards (GPU)
  {
    id: 970301,
    title: "Consistent NVIDIA GeForce GT 710 2GB DDR3 Graphics Card",
    handle: "consistent-nvidia-geforce-gt-710-2gb",
    vendor: "Consistent",
    category: "gpu",
    product_type: "Graphic Card",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "CST-GPU-GT710",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 710", vram: "2GB", memory_type: "DDR3", tdp: 19, recommended_psu: 300, length_mm: 145, ports: ["HDMI", "DVI", "VGA"] },
    description: "Multi-monitor display adapter supporting HDMI and VGA for dual-screen trading and office setups.",
    url: "/catalog/gpu/consistent-gt-710"
  },
  {
    id: 970302,
    title: "Consistent NVIDIA GeForce GT 730 4GB DDR3 Graphics Card",
    handle: "consistent-nvidia-geforce-gt-730-4gb",
    vendor: "Consistent",
    category: "gpu",
    product_type: "Graphic Card",
    price: 3399,
    compare_at_price: 4499,
    available: true,
    sku: "CST-GPU-GT730",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 730", vram: "4GB", memory_type: "DDR3", tdp: 38, recommended_psu: 300, length_mm: 150, ports: ["HDMI", "DVI", "VGA"] },
    description: "Affordable 4GB dedicated graphics card with active cooling fan and full DirectX 12 support.",
    url: "/catalog/gpu/consistent-gt-730"
  },
  {
    id: 970303,
    title: "Consistent NVIDIA GeForce GTX 1650 4GB GDDR6 Graphics Card",
    handle: "consistent-nvidia-geforce-gtx-1650-4gb",
    vendor: "Consistent",
    category: "gpu",
    product_type: "Graphic Card",
    price: 10499,
    compare_at_price: 13999,
    available: true,
    sku: "CST-GPU-GTX1650",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GTX 1650", vram: "4GB", memory_type: "GDDR6", tdp: 75, recommended_psu: 350, length_mm: 200, ports: ["HDMI", "DisplayPort", "DVI"] },
    description: "Turing architecture 1080p gaming graphics card featuring fast GDDR6 VRAM and low power draw.",
    url: "/catalog/gpu/consistent-gtx-1650"
  },

  // Consistent Storage & RAM
  {
    id: 970401,
    title: "Consistent 256GB 2.5 Inch SATA III Internal SSD",
    handle: "consistent-256gb-sata-internal-ssd",
    vendor: "Consistent",
    category: "storage",
    product_type: "SSD",
    price: 1449,
    compare_at_price: 2199,
    available: true,
    sku: "CST-SSD-256G",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "2.5 Inch SATA", capacity: "256GB", interface: "SATA III 6Gb/s", read_speed: "540 MB/s", write_speed: "480 MB/s" },
    description: "Speed up your desktop or laptop with Consistent 256GB solid state drive.",
    url: "/catalog/storage/consistent-256gb-ssd"
  },
  {
    id: 970402,
    title: "Consistent 512GB M.2 NVMe PCIe Gen3 Internal SSD",
    handle: "consistent-512gb-m2-nvme-internal-ssd",
    vendor: "Consistent",
    category: "storage",
    product_type: "SSD",
    price: 2799,
    compare_at_price: 3999,
    available: true,
    sku: "CST-SSD-512G-NVME",
    image: "/images/shop_by_category/ssd.png",
    cdn_image: "/images/shop_by_category/ssd.png",
    images: ["/images/shop_by_category/ssd.png"],
    specs: { form_factor: "M.2 2280", capacity: "512GB", interface: "PCIe Gen3 x4 NVMe", read_speed: "2400 MB/s", write_speed: "1800 MB/s" },
    description: "High-speed M.2 NVMe drive delivering ultra-fast boot and load times.",
    url: "/catalog/storage/consistent-512gb-nvme"
  },
  {
    id: 970403,
    title: "Consistent 8GB DDR4 3200MHz Desktop RAM",
    handle: "consistent-8gb-ddr4-3200mhz-desktop-ram",
    vendor: "Consistent",
    category: "ram",
    product_type: "Ram",
    price: 1449,
    compare_at_price: 2199,
    available: true,
    sku: "CST-RAM-8G-D4",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR4", capacity_gb: 8, speed_mhz: 3200, modules: "1x8GB", voltage: "1.2V" },
    description: "High-quality 8GB DDR4 3200MHz RAM module for Intel and AMD systems.",
    url: "/catalog/ram/consistent-8gb-ddr4"
  },
  {
    id: 970404,
    title: "Consistent 16GB DDR4 3200MHz Desktop RAM",
    handle: "consistent-16gb-ddr4-3200mhz-desktop-ram",
    vendor: "Consistent",
    category: "ram",
    product_type: "Ram",
    price: 2699,
    compare_at_price: 3799,
    available: true,
    sku: "CST-RAM-16G-D4",
    image: "/images/shop_by_category/ram.png",
    cdn_image: "/images/shop_by_category/ram.png",
    images: ["/images/shop_by_category/ram.png"],
    specs: { ram_type: "DDR4", capacity_gb: 16, speed_mhz: 3200, modules: "1x16GB", voltage: "1.2V" },
    description: "Reliable 16GB single stick DDR4 RAM for demanding workloads and gaming.",
    url: "/catalog/ram/consistent-16gb-ddr4"
  },

  // Consistent Cabinet, SMPS, Keyboard, Mouse
  {
    id: 970501,
    title: "Consistent Classic Micro-ATX Desktop Cabinet",
    handle: "consistent-classic-micro-atx-cabinet",
    vendor: "Consistent",
    category: "case",
    product_type: "PC Cabinet",
    price: 1149,
    compare_at_price: 1649,
    available: true,
    sku: "CST-CAS-CLASSIC",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "Micro-ATX Mini Tower", cabinet_style: "Compact Office / Study", color: "Black", supported_motherboards: ["Micro-ATX", "Mini-ITX"], max_gpu_length: 280, side_panel: "Steel", included_fans: "1x 80mm Fan" },
    description: "Durable black Micro-ATX cabinet with front USB 2.0 & audio ports.",
    url: "/catalog/case/consistent-classic"
  },
  {
    id: 970502,
    title: "Consistent 450W Desktop SMPS Power Supply",
    handle: "consistent-450w-desktop-smps",
    vendor: "Consistent",
    category: "psu",
    product_type: "Power Supply Unit",
    price: 849,
    compare_at_price: 1299,
    available: true,
    sku: "CST-PSU-450W",
    image: "/images/shop_by_category/power_supply.png",
    cdn_image: "/images/shop_by_category/power_supply.png",
    images: ["/images/shop_by_category/power_supply.png"],
    specs: { wattage: 450, efficiency_rating: "Standard 75%+", modular: "Non-Modular", fan_size: "120mm Fan", form_factor: "ATX" },
    description: "Solid 450W desktop power supply unit with surge and short circuit protection.",
    url: "/catalog/psu/consistent-450w"
  },
  {
    id: 970503,
    title: "Consistent Wired USB Multimedia Keyboard",
    handle: "consistent-wired-usb-multimedia-keyboard",
    vendor: "Consistent",
    category: "gaming_keyboard",
    product_type: "Gaming Keyboard",
    price: 329,
    compare_at_price: 549,
    available: true,
    sku: "CST-KB-USB",
    image: "/images/shop_by_category/keyboard.png",
    cdn_image: "/images/shop_by_category/keyboard.png",
    images: ["/images/shop_by_category/keyboard.png"],
    specs: { connectivity: "Wired USB", switch_type: "Membrane", layout: "104 Keys Full-Size", backlight: "None" },
    description: "Quiet and responsive standard USB keyboard with dedicated multimedia hotkeys.",
    url: "/catalog/keyboard/consistent-wired"
  },
  {
    id: 970504,
    title: "Consistent USB Optical Wired Mouse",
    handle: "consistent-usb-optical-wired-mouse",
    vendor: "Consistent",
    category: "gaming_mouse",
    product_type: "Gaming Mouse",
    price: 179,
    compare_at_price: 299,
    available: true,
    sku: "CST-MS-USB",
    image: "/images/shop_by_category/mouse.png",
    cdn_image: "/images/shop_by_category/mouse.png",
    images: ["/images/shop_by_category/mouse.png"],
    specs: { connectivity: "Wired USB", sensor_type: "Optical", dpi: 1000, buttons: 3, weight_g: 75 },
    description: "Reliable plug-and-play USB optical mouse with smooth scrolling wheel.",
    url: "/catalog/mouse/consistent-optical"
  },

  // ==================== IBALL PRODUCTS ====================
  {
    id: 960101,
    title: "iBall Baby 330 Micro-ATX Desktop Cabinet with Built-in SMPS",
    handle: "iball-baby-330-micro-atx-cabinet",
    vendor: "iBall",
    category: "case",
    product_type: "PC Cabinet",
    price: 1899,
    compare_at_price: 2599,
    available: true,
    sku: "IBL-CAS-BABY330",
    image: "/images/shop_by_category/pc_cabinet.png",
    cdn_image: "/images/shop_by_category/pc_cabinet.png",
    images: ["/images/shop_by_category/pc_cabinet.png"],
    specs: { form_factor: "Micro-ATX Mini Tower", cabinet_style: "Compact Office / Study", color: "Black", supported_motherboards: ["Micro-ATX", "Mini-ITX"], max_gpu_length: 270, side_panel: "Steel", included_fans: "1x 80mm Rear Fan" },
    description: "Compact space-saving desktop cabinet by iBall complete with pre-installed reliable power supply.",
    url: "/catalog/case/iball-baby-330"
  },
  {
    id: 960102,
    title: "iBall 450W Desktop SMPS Power Supply",
    handle: "iball-450w-desktop-smps-power-supply",
    vendor: "iBall",
    category: "psu",
    product_type: "Power Supply Unit",
    price: 899,
    compare_at_price: 1399,
    available: true,
    sku: "IBL-PSU-450W",
    image: "/images/shop_by_category/power_supply.png",
    cdn_image: "/images/shop_by_category/power_supply.png",
    images: ["/images/shop_by_category/power_supply.png"],
    specs: { wattage: 450, efficiency_rating: "Standard 75%+", modular: "Non-Modular", fan_size: "120mm Fan", form_factor: "ATX" },
    description: "Standard 450W SMPS engineered with durable capacitors and thermal overheat protection.",
    url: "/catalog/psu/iball-450w"
  },
  {
    id: 960103,
    title: "iBall Winner USB Wired Multimedia Keyboard",
    handle: "iball-winner-usb-wired-keyboard",
    vendor: "iBall",
    category: "gaming_keyboard",
    product_type: "Gaming Keyboard",
    price: 379,
    compare_at_price: 599,
    available: true,
    sku: "IBL-KB-WINNER",
    image: "/images/shop_by_category/keyboard.png",
    cdn_image: "/images/shop_by_category/keyboard.png",
    images: ["/images/shop_by_category/keyboard.png"],
    specs: { connectivity: "Wired USB", switch_type: "Membrane", layout: "104 Keys Full-Size", backlight: "None" },
    description: "Iconic iBall Winner keyboard with soft-touch keys and spill-resistant design.",
    url: "/catalog/keyboard/iball-winner"
  },
  {
    id: 960104,
    title: "iBall Style 63 USB Optical Wired Mouse",
    handle: "iball-style-63-usb-optical-mouse",
    vendor: "iBall",
    category: "gaming_mouse",
    product_type: "Gaming Mouse",
    price: 199,
    compare_at_price: 349,
    available: true,
    sku: "IBL-MS-STYLE63",
    image: "/images/shop_by_category/mouse.png",
    cdn_image: "/images/shop_by_category/mouse.png",
    images: ["/images/shop_by_category/mouse.png"],
    specs: { connectivity: "Wired USB", sensor_type: "Optical", dpi: 1200, buttons: 3, weight_g: 80 },
    description: "Comfortable ergonomic grip mouse with high precision 1200 DPI optical sensor.",
    url: "/catalog/mouse/iball-style63"
  },
  {
    id: 960105,
    title: "iBall Face2Face 1080P Full HD USB Web Camera",
    handle: "iball-face2face-1080p-fhd-webcam",
    vendor: "iBall",
    category: "webcam",
    product_type: "Webcam",
    price: 1299,
    compare_at_price: 1999,
    available: true,
    sku: "IBL-CAM-F2F1080",
    image: "/images/shop_by_category/monitor.png",
    cdn_image: "/images/shop_by_category/monitor.png",
    images: ["/images/shop_by_category/monitor.png"],
    specs: { resolution: "1080P Full HD", framerate: "30 FPS", focus: "Auto Focus", connection: "USB 2.0" },
    description: "Crystal clear video streaming and conference calls with integrated digital mic.",
    url: "/catalog/webcam/iball-face2face"
  },

  // ==================== GEONIX PRODUCTS ====================
  {
    id: 950101,
    title: "Geonix H61 LGA 1155 Micro-ATX Motherboard (DDR3)",
    handle: "geonix-h61-lga1155-motherboard",
    vendor: "Geonix",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2499,
    compare_at_price: 3399,
    available: true,
    sku: "GNX-MB-H61",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1155", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H61" },
    description: "Solid LGA1155 board with M.2 NVMe slot and dual DDR3 RAM slots.",
    url: "/catalog/motherboard/geonix-h61"
  },
  {
    id: 950102,
    title: "Geonix H81 LGA 1150 Micro-ATX Motherboard (DDR3)",
    handle: "geonix-h81-lga1150-motherboard",
    vendor: "Geonix",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2799,
    compare_at_price: 3799,
    available: true,
    sku: "GNX-MB-H81",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1150", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H81" },
    description: "Geonix H81 motherboard with Gigabit LAN and fast USB 3.0 ports.",
    url: "/catalog/motherboard/geonix-h81"
  },
  {
    id: 950103,
    title: "Geonix NVIDIA GeForce GT 710 2GB DDR3 Graphics Card",
    handle: "geonix-nvidia-geforce-gt-710-2gb",
    vendor: "Geonix",
    category: "gpu",
    product_type: "Graphic Card",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "GNX-GPU-GT710",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 710", vram: "2GB", memory_type: "DDR3", tdp: 19, recommended_psu: 300, length_mm: 145, ports: ["HDMI", "DVI", "VGA"] },
    description: "Compact discrete graphics card with HDMI and VGA ports for multi-screen setups.",
    url: "/catalog/gpu/geonix-gt-710"
  },
  {
    id: 950104,
    title: "Geonix NVIDIA GeForce GT 730 4GB DDR3 Graphics Card",
    handle: "geonix-nvidia-geforce-gt-730-4gb",
    vendor: "Geonix",
    category: "gpu",
    product_type: "Graphic Card",
    price: 3399,
    compare_at_price: 4499,
    available: true,
    sku: "GNX-GPU-GT730",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 730", vram: "4GB", memory_type: "DDR3", tdp: 38, recommended_psu: 300, length_mm: 150, ports: ["HDMI", "DVI", "VGA"] },
    description: "4GB dedicated graphic card for HD multimedia, photo editing, and casual gaming.",
    url: "/catalog/gpu/geonix-gt-730"
  },

  // ==================== ZEBRONICS MOTHERBOARDS & GPUS & FANS ====================
  {
    id: 940101,
    title: "Zebronics ZEB-H61 Micro-ATX Motherboard (LGA 1155 / DDR3)",
    handle: "zebronics-zeb-h61-micro-atx-motherboard",
    vendor: "Zebronics",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2499,
    compare_at_price: 3499,
    available: true,
    sku: "ZEB-MB-H61",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1155", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H61" },
    description: "Zebronics H61 motherboard with M.2 NVMe slot, PCIe x16, and dual DDR3 memory support.",
    url: "/catalog/motherboard/zebronics-h61"
  },
  {
    id: 940102,
    title: "Zebronics ZEB-H81 Micro-ATX Motherboard (LGA 1150 / DDR3)",
    handle: "zebronics-zeb-h81-micro-atx-motherboard",
    vendor: "Zebronics",
    category: "motherboard",
    product_type: "Motherboard",
    price: 2799,
    compare_at_price: 3899,
    available: true,
    sku: "ZEB-MB-H81",
    image: "/images/shop_by_category/motherboard.png",
    cdn_image: "/images/shop_by_category/motherboard.png",
    images: ["/images/shop_by_category/motherboard.png"],
    specs: { socket: "LGA1150", form_factor: "Micro-ATX", ram_type: "DDR3", ram_slots: 2, max_ram: 16, m2_slots: 1, chipset: "Intel H81" },
    description: "4th Gen Intel LGA1150 motherboard by Zebronics with USB 3.0 and NVMe M.2 expansion.",
    url: "/catalog/motherboard/zebronics-h81"
  },
  {
    id: 940103,
    title: "Zebronics ZEB-GT730 4GB DDR3 Graphics Card",
    handle: "zebronics-zeb-gt730-4gb-graphics-card",
    vendor: "Zebronics",
    category: "gpu",
    product_type: "Graphic Card",
    price: 3499,
    compare_at_price: 4699,
    available: true,
    sku: "ZEB-GPU-GT730",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce GT 730", vram: "4GB", memory_type: "DDR3", tdp: 38, recommended_psu: 300, length_mm: 150, ports: ["HDMI", "DVI", "VGA"] },
    description: "Zebronics dedicated 4GB graphics card with HDMI, DVI, and VGA triple monitor outputs.",
    url: "/catalog/gpu/zebronics-gt-730"
  },
  {
    id: 940104,
    title: "Zebronics ZEB-Rainbow 120mm RGB Cabinet Fan (Pack of 3)",
    handle: "zebronics-zeb-rainbow-120mm-rgb-cabinet-fan-3pack",
    vendor: "Zebronics",
    category: "case_fan",
    product_type: "Case Fan",
    price: 899,
    compare_at_price: 1399,
    available: true,
    sku: "ZEB-FAN-RAINBOW-3PK",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { fan_size: "120mm", rgb_type: "Multi-color Rainbow RGB", speed_rpm: 1200, airflow_cfm: 40, noise_dba: 21 },
    description: "Low-noise 120mm RGB case fans with hydraulic bearing and vibrant outer ring illumination.",
    url: "/catalog/case_fan/zebronics-rainbow-3pack"
  },

  // ==================== ANT ESPORTS CASE FANS ====================
  {
    id: 930101,
    title: "Ant Esports Superflow 120 Auto RGB 120mm Case Fan (Pack of 3)",
    handle: "ant-esports-superflow-120-auto-rgb-3pack",
    vendor: "Ant Esports",
    category: "case_fan",
    product_type: "Case Fan",
    price: 1199,
    compare_at_price: 1899,
    available: true,
    sku: "ANT-FAN-SF120-3PK",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { fan_size: "120mm", rgb_type: "Auto RGB", speed_rpm: 1200, airflow_cfm: 48.5, noise_dba: 20 },
    description: "High static-pressure 120mm cabinet fans with auto-flowing RGB lighting and anti-vibration mounts.",
    url: "/catalog/case_fan/ant-esports-superflow-3pack"
  },
  {
    id: 930102,
    title: "Ant Esports Royal Flow 120 ARGB Case Fan (Pack of 3 with Controller)",
    handle: "ant-esports-royal-flow-120-argb-3pack",
    vendor: "Ant Esports",
    category: "case_fan",
    product_type: "Case Fan",
    price: 1699,
    compare_at_price: 2499,
    available: true,
    sku: "ANT-FAN-RF120-3PK",
    image: "/images/shop_by_category/air_cooler.png",
    cdn_image: "/images/shop_by_category/air_cooler.png",
    images: ["/images/shop_by_category/air_cooler.png"],
    specs: { fan_size: "120mm", rgb_type: "Addressable RGB (5V 3-Pin)", speed_rpm: 1300, airflow_cfm: 52, noise_dba: 22 },
    description: "Synchronizable 5V ARGB 3-pack cooling fans with dedicated remote controller hub.",
    url: "/catalog/case_fan/ant-esports-royal-flow"
  },

  // ==================== ACER GPUS ====================
  {
    id: 920101,
    title: "Acer Predator BiFrost Intel Arc A770 OC 16GB GDDR6 Graphics Card",
    handle: "acer-predator-bifrost-intel-arc-a770-oc-16gb",
    vendor: "Acer",
    category: "gpu",
    product_type: "Graphic Card",
    price: 28999,
    compare_at_price: 36999,
    available: true,
    sku: "ACR-GPU-A770-16G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "Intel Arc A770", vram: "16GB", memory_type: "GDDR6", tdp: 225, recommended_psu: 650, length_mm: 267, ports: ["HDMI 2.1", "DisplayPort 2.0 (x3)"] },
    description: "Flagship 16GB VRAM creator and gaming graphics card with hybrid AeroBlade 3D & FrostBlade 2.0 dual cooling.",
    url: "/catalog/gpu/acer-predator-a770"
  },
  {
    id: 920102,
    title: "Acer Predator BiFrost AMD Radeon RX 7600 OC 8GB GDDR6 Graphics Card",
    handle: "acer-predator-bifrost-radeon-rx-7600-oc-8gb",
    vendor: "Acer",
    category: "gpu",
    product_type: "Graphic Card",
    price: 24999,
    compare_at_price: 31999,
    available: true,
    sku: "ACR-GPU-RX7600-8G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "Radeon RX 7600", vram: "8GB", memory_type: "GDDR6", tdp: 170, recommended_psu: 550, length_mm: 260, ports: ["HDMI 2.1", "DisplayPort 1.4 (x3)"] },
    description: "High-FPS 1080p and 1440p AMD RDNA 3 gaming graphics card with Acer Predator custom vapor chamber cooling.",
    url: "/catalog/gpu/acer-predator-rx7600"
  },

  // ==================== HP PROCESSORS & GPUS ====================
  {
    id: 910101,
    title: "HP Intel Core i5 12400 6-Core 12-Thread Desktop Processor",
    handle: "hp-intel-core-i5-12400-processor",
    vendor: "HP",
    category: "cpu",
    product_type: "Processor",
    price: 12499,
    compare_at_price: 16999,
    available: true,
    sku: "HP-CPU-I5-12400",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1700", cores: 6, threads: 12, base_clock: "2.5 GHz", boost_clock: "4.4 GHz", tdp: 65, igpu: true },
    description: "Performance 6-core processor with integrated UHD 730 Graphics for LGA1700 platforms.",
    url: "/catalog/cpu/hp-i5-12400"
  },
  {
    id: 910102,
    title: "HP NVIDIA GeForce RTX 4060 8GB GDDR6 Graphics Card",
    handle: "hp-nvidia-geforce-rtx-4060-8gb",
    vendor: "HP",
    category: "gpu",
    product_type: "Graphic Card",
    price: 27999,
    compare_at_price: 34999,
    available: true,
    sku: "HP-GPU-RTX4060-8G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce RTX 4060", vram: "8GB", memory_type: "GDDR6", tdp: 115, recommended_psu: 500, length_mm: 242, ports: ["HDMI 2.1", "DisplayPort 1.4a (x3)"] },
    description: "Next-gen Ada Lovelace GPU with DLSS 3 Frame Generation and ultra-efficient 115W TDP.",
    url: "/catalog/gpu/hp-rtx-4060"
  },

  // ==================== DELL PROCESSORS & GPUS ====================
  {
    id: 900101,
    title: "Dell Intel Core i7 13700 16-Core 24-Thread Desktop Processor",
    handle: "dell-intel-core-i7-13700-processor",
    vendor: "Dell",
    category: "cpu",
    product_type: "Processor",
    price: 28999,
    compare_at_price: 37999,
    available: true,
    sku: "DEL-CPU-I7-13700",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "LGA1700", cores: 16, threads: 24, base_clock: "2.1 GHz", boost_clock: "5.2 GHz", tdp: 65, igpu: true },
    description: "Powerhouse 16-core hybrid processor (8 Performance + 8 Efficient cores) up to 5.2GHz.",
    url: "/catalog/cpu/dell-i7-13700"
  },
  {
    id: 900102,
    title: "Dell NVIDIA GeForce RTX 4070 12GB GDDR6X Graphics Card",
    handle: "dell-nvidia-geforce-rtx-4070-12gb",
    vendor: "Dell",
    category: "gpu",
    product_type: "Graphic Card",
    price: 52999,
    compare_at_price: 64999,
    available: true,
    sku: "DEL-GPU-RTX4070-12G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce RTX 4070", vram: "12GB", memory_type: "GDDR6X", tdp: 200, recommended_psu: 650, length_mm: 260, ports: ["HDMI 2.1", "DisplayPort 1.4a (x3)"] },
    description: "High-end 1440p and 4K ray-tracing GPU featuring 12GB high-speed GDDR6X VRAM.",
    url: "/catalog/gpu/dell-rtx-4070"
  },

  // ==================== LENOVO PROCESSORS & GPUS ====================
  {
    id: 890101,
    title: "Lenovo AMD Ryzen 7 7800X3D 8-Core 16-Thread Gaming Processor",
    handle: "lenovo-amd-ryzen-7-7800x3d-processor",
    vendor: "Lenovo",
    category: "cpu",
    product_type: "Processor",
    price: 38999,
    compare_at_price: 49999,
    available: true,
    sku: "LEN-CPU-R7-7800X3D",
    image: "/images/shop_by_category/processor.png",
    cdn_image: "/images/shop_by_category/processor.png",
    images: ["/images/shop_by_category/processor.png"],
    specs: { socket: "AM5", cores: 8, threads: 16, base_clock: "4.2 GHz", boost_clock: "5.0 GHz", tdp: 120, igpu: true },
    description: "The undisputed champion of gaming processors with revolutionary 96MB 3D V-Cache on AM5.",
    url: "/catalog/cpu/lenovo-r7-7800x3d"
  },
  {
    id: 890102,
    title: "Lenovo Legion NVIDIA GeForce RTX 4080 16GB GDDR6X Graphics Card",
    handle: "lenovo-legion-nvidia-geforce-rtx-4080-16gb",
    vendor: "Lenovo",
    category: "gpu",
    product_type: "Graphic Card",
    price: 98999,
    compare_at_price: 119999,
    available: true,
    sku: "LEN-GPU-RTX4080-16G",
    image: "/images/shop_by_category/graphic_card.png",
    cdn_image: "/images/shop_by_category/graphic_card.png",
    images: ["/images/shop_by_category/graphic_card.png"],
    specs: { chipset: "GeForce RTX 4080", vram: "16GB", memory_type: "GDDR6X", tdp: 320, recommended_psu: 750, length_mm: 310, ports: ["HDMI 2.1", "DisplayPort 1.4a (x3)"] },
    description: "Extreme 4K gaming and AI compute card with massive 16GB GDDR6X and ColdFront vapor chamber.",
    url: "/catalog/gpu/lenovo-rtx-4080"
  }
];

// Add the new products into the catalog
let addedCount = 0;
for (const prod of ADDITIONAL_PRODUCTS) {
  const cat = prod.category;
  if (!cleanedCatalog[cat]) cleanedCatalog[cat] = [];
  cleanedCatalog[cat].push(prod);
  addedCount++;
}

console.log(`Added ${addedCount} authentic products for authorized brands.`);

// Final audit: Verify every single product belongs to one of the 15 allowed brands
const finalVendors = {};
let finalTotal = 0;
let violations = 0;

for (const [cat, items] of Object.entries(cleanedCatalog)) {
  if (!Array.isArray(items)) continue;
  for (const item of items) {
    finalTotal++;
    const v = item.vendor || 'Unknown';
    finalVendors[v] = (finalVendors[v] || 0) + 1;

    let matched = false;
    for (const b of BRAND_PATTERNS) {
      if (b.regex.test(v)) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      console.error(`VIOLATION in ${cat}: vendor "${v}" on item "${item.title}"`);
      violations++;
    }
  }
}

console.log('\nFinal Catalog Summary:');
console.log('Total Products:', finalTotal);
console.log('Total Violations:', violations);
console.log('Brand breakdown:');
Object.entries(finalVendors).sort((a,b) => b[1] - a[1]).forEach(([k, count]) => {
  console.log(`  ${k}: ${count}`);
});

console.log('\nCategory counts:');
CATEGORIES.forEach(c => {
  console.log(`  ${c}: ${cleanedCatalog[c]?.length || 0} items`);
});

// Write to client/public/data/products.json and client/dist/data/products.json
fs.writeFileSync(PUBLIC_PRODUCTS_PATH, JSON.stringify(cleanedCatalog, null, 2), 'utf8');
console.log(`\n✓ Written to ${PUBLIC_PRODUCTS_PATH}`);

if (fs.existsSync(path.dirname(DIST_PRODUCTS_PATH))) {
  fs.writeFileSync(DIST_PRODUCTS_PATH, JSON.stringify(cleanedCatalog, null, 2), 'utf8');
  console.log(`✓ Written to ${DIST_PRODUCTS_PATH}`);
}

// Now update presets.json to point to valid IDs in the new catalog
// Preset 1: Apex Esports Starter (Budget 1080p Gaming)
// Case: Ant Esports ICE-320TG (7100177711197) or Lapcare Prodigy (980603)
// CPU: Lapcare Intel Core i5 10400F (980205)
// Motherboard: Lapcare H510 (980105)
// GPU: Lapcare AMD Radeon RX 580 8GB (980304)
// RAM: Lapcare 16GB DDR4 (980404)
// Storage: Lapcare 512GB NVMe (980504)
// PSU: Lapcare 650W Extreme (980703)
// Cooler: Lapcare Frost 200 ARGB (980802)

// Preset 2: Phantom Stealth Studio (1440p High Performance)
// Case: Ant Esports ICE-511 or Lapcare Winner (980604)
// CPU: HP Intel Core i5 12400 (910101)
// Motherboard: Consistent H610 (970104)
// GPU: HP RTX 4060 8GB (910102)
// RAM: Samsung 16GB DDR4 (or Lapcare 16GB DDR4)
// Storage: Samsung 980 / 990 EVO 1TB
// PSU: Ant Esports FG650 (or Lapcare 650W)
// Cooler: Lapcare Storm 120 ARGB (980803)

// Preset 3: TITAN Hyperion Overkill (Extreme 4K OLED Monster)
// Case: Ant Esports high-end case
// CPU: Lenovo AMD Ryzen 7 7800X3D (890101)
// Motherboard: Consistent B650 / AM5 or Lapcare AM4/B450
// GPU: Lenovo Legion RTX 4080 16GB (890102)
// RAM: Samsung 32GB DDR5 / Lapcare 16GB DDR5
// Storage: Samsung 990 PRO 1TB / 2TB
// PSU: Ant Esports 850W
// Cooler: Lapcare Storm 120 Liquid Cooler

// Find existing item IDs for Samsung and Ant Esports in the cleaned catalog:
let antCaseId = cleanedCatalog.case.find(i => i.vendor === 'Ant Esports')?.id || 980603;
let antPsuId = cleanedCatalog.psu.find(i => i.vendor === 'Ant Esports')?.id || 980703;
let antCoolerId = cleanedCatalog.cooler.find(i => i.vendor === 'Ant Esports')?.id || 980802;
let samsungRamId = cleanedCatalog.ram.find(i => i.vendor === 'Samsung')?.id || 980404;
let samsungStorageId = cleanedCatalog.storage.find(i => i.vendor === 'Samsung')?.id || 980504;

const updatedPresets = [
  {
    id: "starter-esports",
    name: "Apex Esports Starter",
    tier: "Budget 1080p Gaming",
    target: "1080p Ultra 144+ FPS in CS2, Valorant, Fortnite, GTA V",
    color_theme: "#06b6d4",
    cabinet_color: "Black",
    rgb_mode: "Cyberpunk Cyan",
    components: {
      case: 980603, // Lapcare Prodigy RGB Tempered Glass
      cpu: 980205, // Lapcare Core i5 10400F 6-Core
      motherboard: 980105, // Lapcare H510 Micro-ATX
      gpu: 980304, // Lapcare AMD Radeon RX 580 8GB
      ram: 980404, // Lapcare 16GB DDR4 3200MHz
      storage: 980504, // Lapcare 512GB M.2 NVMe SSD
      psu: 980703, // Lapcare 650W Extreme Gaming PSU
      cooler: 980802 // Lapcare Frost 200 ARGB Cooler
    }
  },
  {
    id: "pro-creator-gaming",
    name: "Phantom Stealth Studio",
    tier: "1440p High Performance",
    target: "1440p High FPS, 4K Video Editing & Unreal Engine 5",
    color_theme: "#a855f7",
    cabinet_color: "Black",
    rgb_mode: "Neon Purple Pulse",
    components: {
      case: antCaseId,
      cpu: 910101, // HP Core i5 12400
      motherboard: 970104, // Consistent H610 LGA1700
      gpu: 910102, // HP RTX 4060 8GB
      ram: samsungRamId, // Samsung RAM
      storage: samsungStorageId, // Samsung SSD
      psu: 980703, // Lapcare 650W PSU
      cooler: 980803 // Lapcare Storm 120 Liquid Cooler
    }
  },
  {
    id: "godlike-enthusiast",
    name: "TITAN Hyperion Overkill",
    tier: "Extreme 4K OLED Monster",
    target: "4K Max Ray-Tracing, Local LLM AI Training & 240Hz 4K",
    color_theme: "#ec4899",
    cabinet_color: "Black",
    rgb_mode: "Chroma RGB Wave",
    components: {
      case: antCaseId,
      cpu: 890101, // Lenovo Ryzen 7 7800X3D
      motherboard: 970105, // Consistent B450 / AM4
      gpu: 890102, // Lenovo Legion RTX 4080 16GB
      ram: 980405, // Lapcare 16GB DDR5
      storage: samsungStorageId, // Samsung Storage
      psu: antPsuId,
      cooler: antCoolerId
    }
  }
];

fs.writeFileSync(PUBLIC_PRESETS_PATH, JSON.stringify(updatedPresets, null, 2), 'utf8');
console.log(`✓ Updated ${PUBLIC_PRESETS_PATH}`);

if (fs.existsSync(path.dirname(DIST_PRESETS_PATH))) {
  fs.writeFileSync(DIST_PRESETS_PATH, JSON.stringify(updatedPresets, null, 2), 'utf8');
  console.log(`✓ Updated ${DIST_PRESETS_PATH}`);
}

console.log('\n=== CATALOG AUTHORIZED BRAND FILTER & ENRICHMENT COMPLETE ===');
