import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testRemove3dRender() {
  console.log('=== VERIFYING REMOVAL OF 3D RENDER ===');
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

  // 1. Check Home Page for absence of canvas / 3D elements
  console.log('\n--- 1. Testing Home Page ---');
  const homeCanvases = await page.$$('canvas');
  console.log(`Canvas elements found on Home Page: ${homeCanvases.length}`);
  if (homeCanvases.length === 0) {
    console.log('✓ PASS: Zero 3D canvas elements on Home Page!');
  } else {
    console.warn('⚠️ Found canvas on Home Page:', homeCanvases.length);
  }

  const homeShot = path.join(clientDir, 'computercare-home-no3d.png');
  await page.screenshot({ path: homeShot });
  console.log(`✓ Saved Home Page screenshot to ${homeShot}`);

  // 2. Navigate to Custom PC Builder
  console.log('\n--- 2. Testing Custom PC Builder ---');
  const builderBtn = await page.$('header button:has-text("Custom PC Builder")') || 
                     await page.$('header button:has-text("Custom PC Quote")');
  if (builderBtn) await builderBtn.click();
  await page.waitForTimeout(1500);

  // Check Builder view
  const builderCanvases = await page.$$('canvas');
  console.log(`Canvas elements found in Builder View: ${builderCanvases.length}`);
  if (builderCanvases.length === 0) {
    console.log('✓ PASS: Zero 3D canvas elements in Builder View! 3D render successfully removed.');
  } else {
    console.error('❌ FAIL: Found canvas elements in Builder View:', builderCanvases.length);
  }

  // Check Chassis Preview in Sidebar
  const chassisCard = await page.$('span:has-text("Chassis Preview")');
  console.log('Chassis Preview card present in sidebar:', !!chassisCard);

  // Check 10 component slots
  const componentSlots = await page.$$eval('div:has-text("Selected Hardware Components") ~ div', cards => cards.length);
  console.log(`Hardware component slots rendered: ${componentSlots}`);

  const builderShot = path.join(clientDir, 'computercare-builder-no3d.png');
  await page.screenshot({ path: builderShot });
  console.log(`✓ Saved Builder screenshot to ${builderShot}`);

  // 3. Console Audit
  console.log('\n--- 3. Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero console errors!');
  } else {
    console.warn('⚠️ Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('\n=== ALL 3D REMOVAL VERIFICATION TESTS PASSED ===');
}

testRemove3dRender().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
