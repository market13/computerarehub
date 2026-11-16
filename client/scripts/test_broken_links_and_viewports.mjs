import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const port = 4174;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, '127.0.0.1', async () => {
  console.log(`Test server running at http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let brokenLinks = [];
  let checkedUrls = new Set();
  const baseUrl = `http://127.0.0.1:${port}`;

  const routesToTest = [
    '/',
    '/builder',
    '/catalog',
    '/catalog/cpu',
    '/catalog/gpu',
    '/catalog/motherboard',
    '/catalog/case',
    '/catalog/ram',
    '/catalog/storage',
    '/catalog/psu',
    '/catalog/cooler',
    '/catalog/monitor',
    '/catalog/gaming_mouse',
    '/catalog/gaming_keyboard',
    '/services',
    '/bulk-order',
    '/about',
    '/warranty-returns',
    '/shipping-delivery',
    '/privacy-policy',
    '/terms'
  ];

  console.log('\n--- 1. Testing Core Routes & Collecting Links ---');
  const allDiscoveredLinks = new Set(routesToTest);

  for (const route of routesToTest) {
    const fullUrl = `${baseUrl}${route}`;
    checkedUrls.add(fullUrl);

    try {
      const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp ? resp.status() : 500;
      if (status >= 400) {
        brokenLinks.push({ url: route, status });
        console.error(`❌ Broken Route: ${route} (HTTP ${status})`);
      } else {
        console.log(`✅ OK: ${route} (HTTP ${status})`);
      }

      // Collect hrefs from page
      const hrefs = await page.$$eval('a[href]', (anchors) =>
        anchors.map((a) => a.getAttribute('href')).filter(Boolean)
      );

      for (const href of hrefs) {
        if (
          href.startsWith('/') &&
          !href.startsWith('//') &&
          !href.startsWith('/#') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:')
        ) {
          allDiscoveredLinks.add(href.split('?')[0]);
        }
      }
    } catch (err) {
      brokenLinks.push({ url: route, error: err.message });
      console.error(`❌ Error visiting ${route}: ${err.message}`);
    }
  }

  console.log(`\n--- 2. Checking ${allDiscoveredLinks.size} Discovered Internal Links ---`);
  for (const link of allDiscoveredLinks) {
    const fullUrl = `${baseUrl}${link}`;
    if (checkedUrls.has(fullUrl)) continue;
    checkedUrls.add(fullUrl);

    try {
      const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const status = resp ? resp.status() : 500;
      if (status >= 400) {
        brokenLinks.push({ url: link, status });
        console.error(`❌ Broken link: ${link} (HTTP ${status})`);
      } else {
        console.log(`✅ Verified link: ${link} (HTTP ${status})`);
      }
    } catch (err) {
      brokenLinks.push({ url: link, error: err.message });
      console.error(`❌ Error verifying link ${link}: ${err.message}`);
    }
  }

  console.log('\n--- 3. Testing Responsive Viewports (360px, 768px, 1280px) ---');
  const viewports = [
    { name: 'Mobile (360px)', width: 360, height: 740 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1280px)', width: 1280, height: 800 }
  ];

  let overflowErrors = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const testPath of ['/', '/builder', '/catalog', '/services']) {
      await page.goto(`${baseUrl}${testPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

      if (hasHorizontalScroll) {
        overflowErrors.push({ vp: vp.name, path: testPath, scrollWidth, innerWidth: vp.width });
        console.error(`❌ Overflow at ${vp.name} on ${testPath}: scrollWidth ${scrollWidth} > ${vp.width}`);
      } else {
        console.log(`✅ No horizontal overflow at ${vp.name} on ${testPath} (width: ${scrollWidth}px <= ${vp.width}px)`);
      }
    }
  }

  await browser.close();
  server.close();

  console.log('\n=== SUMMARY ===');
  console.log(`Total URLs Checked: ${checkedUrls.size}`);
  console.log(`Broken Links Found: ${brokenLinks.length}`);
  console.log(`Viewport Overflow Issues: ${overflowErrors.length}`);

  if (brokenLinks.length === 0 && overflowErrors.length === 0) {
    console.log('\n🎉 ALL LINK CHECKS AND VIEWPORT TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    process.exit(1);
  }
});
