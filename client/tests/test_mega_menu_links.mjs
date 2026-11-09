import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _clientDir = path.join(__dirname, '..');
const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function testMegaMenuLinks() {
  console.log('=== VERIFYING MEGA MENU NAVIGATION LINKS & CATALOG RENDERING ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Test 1: Click "Razer Gaming Mouse" under Gaming dropdown
  console.log('\n--- 1. Testing "Razer Gaming Mouse" Link ---');
  const gamingBtn = await page.$('nav button:has-text("Gaming")');
  await gamingBtn.hover();
  await page.waitForTimeout(600);

  const razerMouseLink = await page.$('nav button:has-text("Razer Gaming Mouse")');
  if (!razerMouseLink) throw new Error('Razer Gaming Mouse link button not found!');
  await razerMouseLink.click();
  await page.waitForTimeout(1500);

  // Check that Catalog view is visible and product count > 0
  const productCards1 = await page.$$('.grid > div');
  console.log(`Product cards found for Razer Gaming Mouse: ${productCards1.length}`);
  if (productCards1.length === 0) {
    throw new Error('No products displayed for Razer Gaming Mouse!');
  }

  const razerShot = path.join(artifactDir, 'computercare-catalog-mouse.png');
  await page.screenshot({ path: razerShot });
  console.log(`✓ Saved screenshot to ${razerShot}`);

  // Test 2: Click "AAA Gaming PC" under Gaming dropdown
  console.log('\n--- 2. Testing "AAA Gaming PC" Link ---');
  await gamingBtn.hover();
  await page.waitForTimeout(600);

  const aaaPcLink = await page.$('nav button:has-text("AAA Gaming PC")');
  if (!aaaPcLink) throw new Error('AAA Gaming PC link button not found!');
  await aaaPcLink.click();
  await page.waitForTimeout(1500);

  const productCards2 = await page.$$('.grid > div');
  console.log(`Product cards found for AAA Gaming PC: ${productCards2.length}`);
  if (productCards2.length === 0) {
    throw new Error('No products displayed for AAA Gaming PC!');
  }

  const pcShot = path.join(artifactDir, 'computercare-catalog-gamingpc.png');
  await page.screenshot({ path: pcShot });
  console.log(`✓ Saved screenshot to ${pcShot}`);

  // Test 3: Click "Logitech Webcam" under Streaming dropdown
  console.log('\n--- 3. Testing "Logitech Webcam" Link ---');
  const streamingBtn = await page.$('nav button:has-text("Streaming")');
  await streamingBtn.hover();
  await page.waitForTimeout(600);

  const logitechWebcamLink = await page.$('nav button:has-text("Logitech Webcam")');
  if (!logitechWebcamLink) throw new Error('Logitech Webcam link button not found!');
  await logitechWebcamLink.click();
  await page.waitForTimeout(1500);

  const productCards3 = await page.$$('.grid > div');
  console.log(`Product cards found for Logitech Webcam: ${productCards3.length}`);
  if (productCards3.length === 0) {
    throw new Error('No products displayed for Logitech Webcam!');
  }

  const webcamShot = path.join(artifactDir, 'computercare-catalog-webcam.png');
  await page.screenshot({ path: webcamShot });
  console.log(`✓ Saved screenshot to ${webcamShot}`);

  // Test 4: Click "Elgato Streamdeck" under Streaming dropdown
  console.log('\n--- 4. Testing "Elgato Streamdeck" Link ---');
  await streamingBtn.hover();
  await page.waitForTimeout(600);

  const streamdeckLink = await page.$('nav button:has-text("Elgato Streamdeck")');
  if (!streamdeckLink) throw new Error('Elgato Streamdeck link button not found!');
  await streamdeckLink.click();
  await page.waitForTimeout(1500);

  const productCards4 = await page.$$('.grid > div');
  console.log(`Product cards found for Elgato Streamdeck: ${productCards4.length}`);
  if (productCards4.length === 0) {
    throw new Error('No products displayed for Elgato Streamdeck!');
  }

  const elgatoShot = path.join(artifactDir, 'computercare-catalog-elgato.png');
  await page.screenshot({ path: elgatoShot });
  console.log(`✓ Saved screenshot to ${elgatoShot}`);

  console.log('\n--- Console Errors Check ---');
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors);
  } else {
    console.log('✓ Zero console errors detected.');
  }

  await browser.close();
  console.log('\n=== ALL MEGA MENU LINK TESTS PASSED SUCCESSFULLY! ===');
}

testMegaMenuLinks().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
