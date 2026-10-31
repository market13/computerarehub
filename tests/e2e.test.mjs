import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', 'client');

async function runTest() {
  console.log('Starting Vite preview server on port 4173...');
  const server = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173'], {
    cwd: clientDir,
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite Error] ${d.toString().trim()}`));

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 3500));

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:4173...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle', timeout: 30000 });

    console.log('Page Title:', await page.title());

    // Check header
    const headerTitle = await page.textContent('h1');
    console.log('Header text:', headerTitle);

    // Verify 3D Canvas
    const canvas = await page.$('canvas');
    if (canvas) {
      console.log('✓ 3D Canvas element successfully found and rendered!');
    } else {
      throw new Error('3D Canvas element not found!');
    }

    // Verify slots rendered
    const slots = await page.$$('.border');
    console.log(`✓ Found ${slots.length} UI slots and cards on the page.`);

    // Take screenshot of 3D Rig & Builder
    const screenshotPath = path.join(clientDir, 'preview-builder.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`✓ Saved screenshot to ${screenshotPath}`);

    // Click "Select Processor (CPU)" or "Change" to test modal
    const changeButtons = await page.$$('button:has-text("Change")');
    if (changeButtons.length > 0) {
      console.log('Testing opening Component Selector Modal...');
      await changeButtons[0].click();
      await page.waitForTimeout(1000);

      const modalTitle = await page.textContent('h2');
      console.log('Modal opened with title:', modalTitle);

      const modalScreenshot = path.join(clientDir, 'preview-modal.png');
      await page.screenshot({ path: modalScreenshot });
      console.log(`✓ Saved modal screenshot to ${modalScreenshot}`);

      // Close modal
      const closeBtn = await page.$('button:has(svg.lucide-x)');
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(500);
    }

    // Switch to Catalog Tab
    console.log('Testing navigation to Components Catalog...');
    await page.click('button:has-text("Components Catalog")');
    await page.waitForTimeout(1000);

    const catalogTitle = await page.textContent('h1');
    console.log('Catalog tab loaded:', catalogTitle);

    const catalogScreenshot = path.join(clientDir, 'preview-catalog.png');
    await page.screenshot({ path: catalogScreenshot });
    console.log(`✓ Saved catalog screenshot to ${catalogScreenshot}`);

    console.log('\nAll End-to-End browser tests PASSED successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
}

runTest();
