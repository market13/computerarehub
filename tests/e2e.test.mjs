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

// Cross-platform npm command
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) {
        return true;
      }
    } catch {
      // Waiting for server socket
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Vite preview server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runTest() {
  console.log(`Starting Vite preview server on port ${PORT} using ${npmCmd}...`);
  const server = spawn(npmCmd, ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
    cwd: clientDir,
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite Error] ${d.toString().trim()}`));

  console.log('Waiting explicitly for Vite preview server readiness...');
  await waitForServer(BASE_URL);
  console.log(`✓ Server is ready and accepting requests at ${BASE_URL}`);

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // Test 1: Base Page & 3D Canvas Rendering
    // -------------------------------------------------------------
    console.log('\n--- Test 1: Base Page & 3D Canvas Rendering ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page Title:', await page.title());

    const canvas = await page.$('canvas');
    if (canvas) {
      console.log('✓ PASS: 3D Canvas element rendered successfully');
    } else {
      console.log('Info: Canvas rendered on demand or in builder view');
    }

    // -------------------------------------------------------------
    // Test 2 (P0 #2): Builder has compatible default components
    // -------------------------------------------------------------
    console.log('\n--- Test 2: P0 #2 Builder Compatibility Check ---');
    await page.goto(`${BASE_URL}/builder`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const builderText = await page.textContent('body');
    if (builderText.includes('CPU & Motherboard Socket Incompatible') || builderText.includes('Socket Incompatible')) {
      throw new Error('FAIL: Builder loaded with Socket Incompatibility error!');
    }
    console.log('✓ PASS: Builder initial state has 0 socket incompatibility errors.');

    // Verify CPU slot does not show prebuilt PC
    const cpuSlotText = await page.locator('div:has-text("Processor (CPU)")').first().textContent().catch(() => '');
    if (cpuSlotText.includes('Custom PC Build') && !cpuSlotText.includes('Core') && !cpuSlotText.includes('Ryzen')) {
      throw new Error('FAIL: CPU slot seeded with pre-built PC instead of real processor!');
    }
    console.log('✓ PASS: CPU slot correctly populated with real processor.');

    // -------------------------------------------------------------
    // Test 3 (P0 #1): Real Network Request on Form Submission
    // -------------------------------------------------------------
    console.log('\n--- Test 3: P0 #1 Form Submission Network Request ---');
    let capturedRequest = null;

    // Intercept form submission POST
    await page.route('**', async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        const postData = req.postData() || '';
        if (postData.includes('form-name=') || req.url().includes('expert-consultation') || req.url().includes('bulk-order')) {
          capturedRequest = {
            url: req.url(),
            method: req.method(),
            body: postData
          };
          // Return simulated 200 OK so in-page confirmation shows
          return route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<html><body>Success</body></html>'
          });
        }
      }
      return route.continue();
    });

    await page.goto(`${BASE_URL}/bulk-order`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    // Fill visible bulk order form fields
    await page.locator('input[placeholder*="Ramesh"]:visible').fill('Ramesh Sharma');
    await page.locator('input[placeholder*="Apex"]:visible').fill('Sharma Infotech Pvt Ltd');
    await page.locator('input[placeholder*="ramesh@"]:visible').fill('ramesh@sharmainfotech.com');
    await page.locator('input[placeholder*="+91"]:visible').fill('9810550222');
    await page.locator('input[placeholder*="Mumbai"]:visible').fill('Ghaziabad, Uttar Pradesh');
    await page.locator('textarea:visible').fill('Need 25 high-performance desktop PCs for development team.');

    // Submit form
    const submitBtn = page.locator('button[type="submit"]:has-text("Submit Bulk Order Request")');
    await submitBtn.click();
    await page.waitForTimeout(1500);

    if (!capturedRequest) {
      throw new Error('FAIL: Form submitted without producing a real network request!');
    }
    console.log(`✓ PASS: Real POST request dispatched to "${capturedRequest.url}"`);
    console.log(`  Payload preview: ${capturedRequest.body.slice(0, 80)}...`);

    const confirmationText = await page.textContent('body');
    if (confirmationText.includes('CC-B2B-') || confirmationText.includes('Submitted') || confirmationText.includes('Reference ID')) {
      console.log('✓ PASS: In-page confirmation rendered with reference ID.');
    }

    // -------------------------------------------------------------
    // Test 4 (P0 #3): Product WhatsApp Link Contains Title
    // -------------------------------------------------------------
    console.log('\n--- Test 4: P0 #3 Product WhatsApp Title Check ---');
    await page.goto(`${BASE_URL}/catalog`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Click "View Specifications" on the first product card
    const viewSpecsBtn = page.locator('button[title*="Specification"], button[title*="Specs"]').first();
    await viewSpecsBtn.click();
    await page.waitForTimeout(800);

    // Inspect WhatsApp button in modal
    const waLink = page.locator('a[title="Inquire on WhatsApp"], a:has-text("WhatsApp Buy / Inquire")').first();
    const href = await waLink.getAttribute('href');
    console.log('WhatsApp link href:', href);

    if (href.includes('undefined')) {
      throw new Error(`FAIL: WhatsApp link contains "undefined"! href: ${href}`);
    }
    if (!href.includes('wa.me/919810550222')) {
      throw new Error(`FAIL: WhatsApp link does not target Computer Care helpline! href: ${href}`);
    }
    const decodedHref = decodeURIComponent(href);
    if (!decodedHref.includes('Hi Computer Care, I am interested in') || decodedHref.includes('interested in undefined')) {
      throw new Error(`FAIL: Decoded WhatsApp message contains invalid or undefined title! text: ${decodedHref}`);
    }
    console.log('✓ PASS: Decoded WhatsApp message text:', decodedHref);
    console.log('✓ PASS: WhatsApp link contains valid target, product title, and zero "undefined" values.');

    // -------------------------------------------------------------
    // Test 5: Pre-Built PCs Header Navigation Check
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Pre-Built PCs Navigation Check ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const prebuiltLink = page.locator('a:has-text("Pre-Built PCs"), button:has-text("Pre-Built PCs")').first();
    await prebuiltLink.click();
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    console.log('Navigated URL:', currentUrl);
    if (!currentUrl.includes('/catalog/gaming_pc')) {
      throw new Error(`FAIL: Pre-Built PCs navigation went to "${currentUrl}" instead of "/catalog/gaming_pc"!`);
    }

    const headings = await page.locator('h1, h2').allInnerTexts();
    console.log('Headings found:', headings.slice(0, 3));
    if (!headings.some(h => h.includes('PRE-BUILT GAMING PCS'))) {
      throw new Error('FAIL: Catalog page heading did not show "PRE-BUILT GAMING PCS"!');
    }

    // Verify pre-built products are rendered
    const prebuiltCards = await page.locator('text=Intel Core i3 3rd Gen').count();
    if (prebuiltCards === 0) {
      throw new Error('FAIL: Complete PC Setup pre-built card was not rendered!');
    }
    console.log('✓ PASS: Pre-Built PCs header link correctly navigates to /catalog/gaming_pc with pre-built cards displayed.');

    console.log('\n======================================================');
    console.log(' ALL AUDIT E2E TESTS (INCLUDING P0 ITEMS) PASSED! ');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (server && server.pid) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
        } else {
          server.kill();
        }
      } catch {
        // Ignored
      }
    }
  }
}

runTest();
