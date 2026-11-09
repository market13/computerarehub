import fs from 'fs';
import path from 'path';

// EXACT 15 ALLOWED BRANDS:
// lenovo, samsung, hp, cosmic byte, zebronics, lapcare, ant esport, acer, tvs, consistent, iball, geonix, prodot, logitech, dell
const ALLOWED_BRAND_PATTERNS = [
  { name: 'Lenovo', regex: /\b(lenovo|legion)\b/i },
  { name: 'Samsung', regex: /\bsamsung\b/i },
  { name: 'HP', regex: /\b(hp|hewlett[\s-]*packard|omen|pavilion)\b/i },
  { name: 'Cosmic Byte', regex: /\b(cosmic[\s-]*byte|cosmicbyte)\b/i },
  { name: 'Zebronics', regex: /\b(zebronics|zeb[\s-]*|zeb)\b/i },
  { name: 'Lapcare', regex: /\blapcare\b/i },
  { name: 'Ant Esports', regex: /\b(ant[\s-]*esports?|ant[\s-]*value)\b/i },
  { name: 'Acer', regex: /\b(acer|predator)\b/i },
  { name: 'TVS', regex: /\b(tvs|tvs[\s-]*gold|tvs[\s-]*champ)\b/i },
  { name: 'Consistent', regex: /\bconsistent(\s+infosystems)?\b/i },
  { name: 'iBall', regex: /\biball\b/i },
  { name: 'Geonix', regex: /\bgeonix\b/i },
  { name: 'ProDot', regex: /\bprodot\b/i },
  { name: 'Logitech', regex: /\blogitech\b/i },
  { name: 'Dell', regex: /\b(dell|alienware)\b/i },
  // Maintain Computer Care official store prebuilt custom PCs
  { name: 'Computer Care', regex: /\bcomputer\s*care\b/i }
];

// Disallowed brands that should be strictly excluded even if mentioned in description
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

function getAllowedBrand(item) {
  const vendor = (item.vendor || '').trim();
  const title = (item.title || '').trim();
  const vLower = vendor.toLowerCase();

  // If vendor is explicitly in disallowed list, reject
  for (const d of DISALLOWED_VENDORS) {
    if (vLower === d || vLower.startsWith(d + ' ') || vLower.endsWith(' ' + d)) {
      return null;
    }
  }

  // Check vendor against allowed list
  for (const b of ALLOWED_BRAND_PATTERNS) {
    if (b.regex.test(vendor)) {
      return b.name;
    }
  }

  // If vendor is unknown / empty, check title starting brand
  for (const b of ALLOWED_BRAND_PATTERNS) {
    if (b.regex.test(title)) {
      // Make sure it doesn't match disallowed vendor in title
      let hasDisallowed = false;
      for (const d of DISALLOWED_VENDORS) {
        const dReg = new RegExp(`\\b${d}\\b`, 'i');
        if (dReg.test(vendor)) {
          hasDisallowed = true;
          break;
        }
      }
      if (!hasDisallowed) {
        return b.name;
      }
    }
  }

  return null;
}

console.log('Script loaded successfully.');
