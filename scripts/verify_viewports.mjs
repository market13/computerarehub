import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

let chromium;
try {
  const pw = await import('@playwright/test');
  chromium = pw.chromium;
} catch {
  const pw = await import('../client/node_modules/@playwright/test/index.mjs');
  chromium = pw.chromium;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', 'client');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const PORT = 4174; // Use port 4174 to avoid any port conflicts
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function verifyViewports() {
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const server = spawn(npmCmd, ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
    cwd: clientDir,
    shell: true,
    stdio: 'pipe'
  });

  await waitForServer(BASE_URL);
  console.log(`✓ Server ready at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 800 }
  ];

  const routes = ['/', '/builder', '/catalog', '/services', '/bulk-order', '/pc-repair-indirapuram', '/blog'];

  let allPassed = true;

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${BASE_URL}${route}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(600);

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const maxScroll = Math.max(scrollWidth, bodyWidth);
        return {
          hasOverflow: maxScroll > docWidth + 1, // allow 1px subpixel rounding
          docWidth,
          maxScroll
        };
      });

      if (overflow.hasOverflow) {
        console.error(`❌ OVERFLOW DETECTED on ${route} at ${vp.width}px: scrollWidth=${overflow.maxScroll} > clientWidth=${overflow.docWidth}`);
        allPassed = false;
      } else {
        console.log(`  ✓ ${route} (width: ${overflow.docWidth}px, scrollWidth: ${overflow.maxScroll}px, 0 overflow)`);
      }
    }

    // Specific viewport UI element checks
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    if (vp.width <= 480) {
      // Check sticky mobile action bar
      const hasStickyBar = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const hasCall = links.some(a => a.href.includes('tel:919810550222') || a.href.includes('tel:+919810550222'));
        const hasWA = links.some(a => a.href.includes('wa.me/919810550222'));
        return hasCall && hasWA;
      });
      console.log(`  Sticky Mobile Action Bar (Call + WhatsApp): ${hasStickyBar ? '✓ PRESENT' : '❌ MISSING'}`);
      if (!hasStickyBar) allPassed = false;
    }

    if (vp.width >= 1024) {
      // Check desktop header links
      const hasNavLinks = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('BUILDER') || text.includes('CATALOG') || text.includes('SERVICES');
      });
      console.log(`  Desktop Navigation Links: ${hasNavLinks ? '✓ PRESENT' : '❌ MISSING'}`);
      if (!hasNavLinks) allPassed = false;
    }

    await context.close();
  }

  await browser.close();
  server.kill();

  if (allPassed) {
    console.log(`\n🎉 ALL VIEWPORTS (375px, 768px, 1280px) PASSED WITH ZERO OVERFLOW!`);
    process.exit(0);
  } else {
    console.error(`\n❌ SOME VIEWPORT CHECKS FAILED.`);
    process.exit(1);
  }
}

verifyViewports().catch((e) => {
  console.error(e);
  process.exit(1);
});
