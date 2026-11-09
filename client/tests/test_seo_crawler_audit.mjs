import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== STARTING SEO, GEO & AI CRAWLER AUDIT TEST ===\n');

// 1. Robots.txt Test
console.log('--- 1. Robots.txt Audit ---');
const robotsPath = path.join(distDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'dist/robots.txt exists');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('User-agent: OAI-SearchBot'), 'robots.txt explicitly defines User-agent: OAI-SearchBot');
assert(robotsContent.includes('User-agent: ChatGPT-User'), 'robots.txt explicitly defines User-agent: ChatGPT-User');
assert(robotsContent.includes('User-agent: GPTBot'), 'robots.txt explicitly defines User-agent: GPTBot');
assert(robotsContent.includes('User-agent: PerplexityBot'), 'robots.txt explicitly defines User-agent: PerplexityBot');
assert(robotsContent.includes('User-agent: ClaudeBot'), 'robots.txt explicitly defines User-agent: ClaudeBot');
assert(robotsContent.includes('Disallow: /admin'), 'robots.txt protects /admin from indexation');
assert(robotsContent.includes('Sitemap: https://computercare.in/sitemap.xml'), 'robots.txt references sitemap.xml');

// 2. Dynamic XML Sitemap Test
console.log('\n--- 2. Dynamic XML Sitemap Audit ---');
const sitemapPath = path.join(distDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.startsWith('<?xml'), 'sitemap.xml has valid XML declaration');
assert(sitemapContent.includes('<urlset'), 'sitemap.xml has <urlset>');
assert(sitemapContent.includes('<loc>https://computercare.in/</loc>'), 'sitemap.xml includes homepage');
assert(sitemapContent.includes('<loc>https://computercare.in/builder</loc>'), 'sitemap.xml includes /builder');
assert(sitemapContent.includes('<loc>https://computercare.in/catalog</loc>'), 'sitemap.xml includes /catalog');
assert(sitemapContent.includes('<loc>https://computercare.in/bulk-order</loc>'), 'sitemap.xml includes /bulk-order');

const sampleCategories = ['cpu', 'gpu', 'motherboard', 'case', 'ram', 'storage', 'psu', 'cooler', 'monitor'];
sampleCategories.forEach(cat => {
  assert(sitemapContent.includes(`<loc>https://computercare.in/catalog/${cat}</loc>`), `sitemap.xml includes category /catalog/${cat}`);
});

// Count total URL entries
const urlMatches = sitemapContent.match(/<url>/g);
assert(urlMatches && urlMatches.length >= 23, `sitemap.xml contains full URL suite (found ${urlMatches ? urlMatches.length : 0} entries)`);

// 3. Schema.org JSON-LD Structured Data Audit
console.log('\n--- 3. Schema.org JSON-LD Structured Data Audit ---');
const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const scriptMatches = homeHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
assert(scriptMatches && scriptMatches.length > 0, 'index.html contains JSON-LD structured data block');

let parsedSchemas = [];
scriptMatches.forEach(tag => {
  const jsonText = tag.replace(/<script type="application\/ld\+json">/i, '').replace(/<\/script>/i, '').trim();
  try {
    const data = JSON.parse(jsonText);
    if (data['@graph']) {
      parsedSchemas.push(...data['@graph']);
    } else {
      parsedSchemas.push(data);
    }
  } catch (e) {
    assert(false, `JSON-LD parsing error: ${e.message}`);
  }
});

const storeSchema = parsedSchemas.find(s => {
  const types = Array.isArray(s['@type']) ? s['@type'] : [s['@type']];
  return types.includes('ComputerStore');
});
assert(Boolean(storeSchema), 'Schema includes ComputerStore');
assert(storeSchema?.telephone === '+919810550222', 'ComputerStore telephone is accurate (+919810550222)');
assert(storeSchema?.address?.addressLocality === 'Ghaziabad', 'ComputerStore locality is Ghaziabad');

const orgSchema = parsedSchemas.find(s => {
  const types = Array.isArray(s['@type']) ? s['@type'] : [s['@type']];
  return types.includes('Organization');
});
assert(Boolean(orgSchema), 'Schema includes Organization');

const services = parsedSchemas.filter(s => s['@type'] === 'Service');
assert(services.length >= 3, `Schema includes at least 3 Service definitions (found ${services.length})`);

const faqSchema = parsedSchemas.find(s => s['@type'] === 'FAQPage');
assert(Boolean(faqSchema), 'Schema includes FAQPage');
assert(faqSchema?.mainEntity && faqSchema.mainEntity.length >= 8, `FAQPage contains at least 8 Q&As (found ${faqSchema?.mainEntity?.length || 0})`);

// 4. Crawlability without JavaScript Audit
console.log('\n--- 4. Crawlability without JavaScript Audit ---');
// Verify homepage has rich HTML inside #root
assert(homeHtml.includes('<h1 style="color:#1b2269;font-size:2rem;margin-bottom:8px;">Computer Care — India\'s Premier Custom PC Builder & Genuine Computer Hardware</h1>'), 'Homepage #root contains prominent static <h1>');
assert(homeHtml.includes('Shop Hardware Components by Category'), 'Homepage #root contains static categories list');
assert(homeHtml.includes('<noscript>'), 'Homepage contains accessible <noscript> navigation fallback');

// Verify builder page
const builderHtml = fs.readFileSync(path.join(distDir, 'builder/index.html'), 'utf8');
assert(builderHtml.includes('Custom 3D PC Builder & Real-Time Hardware Configurator'), 'Builder page has prerendered <h1>');
assert(builderHtml.includes('<link rel="canonical" href="https://computercare.in/builder" />'), 'Builder page has canonical URL https://computercare.in/builder');

// Verify catalog and category page
const cpuHtml = fs.readFileSync(path.join(distDir, 'catalog/cpu/index.html'), 'utf8');
assert(cpuHtml.includes('Processors & CPUs'), 'Category page /catalog/cpu has prerendered title');
assert(cpuHtml.includes('<link rel="canonical" href="https://computercare.in/catalog/cpu" />'), 'Category page has canonical URL https://computercare.in/catalog/cpu');
assert(cpuHtml.includes('"@type": "ItemList"'), 'Category page has route-specific ItemList JSON-LD schema');
assert(cpuHtml.includes('₹'), 'Category page displays static INR product prices in raw HTML');

// Verify admin page noindex
const adminHtml = fs.readFileSync(path.join(distDir, 'admin/index.html'), 'utf8');
assert(adminHtml.includes('noindex'), 'Admin route page has noindex meta protection');

// 5. llms.txt Grounding Audit
console.log('\n--- 5. llms.txt Grounding Audit ---');
const llmsPath = path.join(distDir, 'llms.txt');
assert(fs.existsSync(llmsPath), 'dist/llms.txt exists');
const llmsContent = fs.readFileSync(llmsPath, 'utf8');
assert(llmsContent.includes('Computer Care'), 'llms.txt contains brand identity');
assert(llmsContent.includes('Deterministic Compatibility Engine'), 'llms.txt explains compatibility engine');
assert(llmsContent.includes('Lenovo, Samsung, HP, Cosmic Byte, Zebronics, Lapcare'), 'llms.txt lists authorized hardware brands');
assert(llmsContent.includes('+91 9810550222'), 'llms.txt includes contact phone');
assert(llmsContent.includes('https://computercare.in/catalog/cpu'), 'llms.txt includes deep links');

console.log(`\n=== AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===`);
if (passedTests === totalTests) {
  console.log('🎉 ALL SEO, GEO & AI CRAWLER REQUIREMENTS VERIFIED SUCCESSFULLY!');
} else {
  console.error(`⚠️ ${totalTests - passedTests} TESTS FAILED.`);
  process.exit(1);
}
