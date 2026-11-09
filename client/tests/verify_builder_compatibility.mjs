import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkCompatibility, findCompatibleDefaultBuild } from '../src/utils/compatibility.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../public/data/products.json');

console.log('--- Computer Care Builder Compatibility Audit Check ---');

if (!fs.existsSync(productsPath)) {
  console.error(`ERROR: Products file not found at ${productsPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// 1. Verify CPU category items are real processors and not pre-builts
const cpus = data.cpu || [];
console.log(`Checking ${cpus.length} CPU products...`);

const invalidCpus = cpus.filter(p => {
  const title = (p.title || '').toLowerCase();
  return p.vendor === 'PC Build' || title.includes('custom pc build') || title.includes('pre-built');
});

if (invalidCpus.length > 0) {
  console.error(`FAIL: Found ${invalidCpus.length} pre-built systems inside the 'cpu' category:`);
  invalidCpus.forEach(p => console.error(`  - [ID: ${p.id}] ${p.title} (vendor: ${p.vendor})`));
  process.exit(1);
}

console.log('PASS: All items in CPU category are real standalone processors (0 pre-builts).');

// 2. Verify default seeded build
const defaultBuild = findCompatibleDefaultBuild(data);
if (!defaultBuild) {
  console.error('FAIL: Could not generate a compatible default build from catalog data.');
  process.exit(1);
}

console.log('\nDefault Seeded Rig:');
console.log(`  - CPU: ${defaultBuild.cpu?.title} [Socket: ${defaultBuild.cpu?.specs?.socket}]`);
console.log(`  - Motherboard: ${defaultBuild.motherboard?.title} [Socket: ${defaultBuild.motherboard?.specs?.socket}, Form: ${defaultBuild.motherboard?.specs?.form_factor}, RAM: ${defaultBuild.motherboard?.specs?.ram_type}]`);
console.log(`  - RAM: ${defaultBuild.ram?.title} [Standard: ${defaultBuild.ram?.specs?.ram_type}]`);
console.log(`  - Case: ${defaultBuild.case?.title} [Supported: ${defaultBuild.case?.specs?.supported_motherboards?.join(', ')}]`);
console.log(`  - GPU: ${defaultBuild.gpu?.title}`);
console.log(`  - PSU: ${defaultBuild.psu?.title} [${defaultBuild.psu?.specs?.wattage}W]`);

// 3. Verify compatibility engine check
const compatResult = checkCompatibility(defaultBuild);

if (!compatResult.isCompatible || compatResult.issues.length > 0) {
  console.error('\nFAIL: Default build has compatibility issues:');
  compatResult.issues.forEach(iss => console.error(`  - [${iss.title}]: ${iss.message}`));
  process.exit(1);
}

console.log(`\nPASS: Default build is 100% compatible! (Estimated consumption: ~${compatResult.estimatedWattage}W, PSU: ${defaultBuild.psu?.specs?.wattage}W, 0 critical issues).`);
console.log('--- Builder Compatibility Verification Succeeded ---\n');
