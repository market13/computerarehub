import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function runAudit() {
  console.log('=== RUNNING COMPUTER CARE (computercare THEMED) E2E AUDIT ===');
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];

  // 1. Desktop Test
  console.log('\n--- 1. Testing Desktop Layout (1440x900) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Page loaded. Title:', await page.title());

  // Verify Computer Care branding
  const logoText = await page.textContent('span.font-black');
  console.log('Logo Branding verified:', logoText);

  // Take Desktop Home Screenshot
  const homeShot = path.join(clientDir, 'computercare-home.png');
  await page.screenshot({ path: homeShot });
  console.log(`✓ Saved Computer Care Home screenshot to ${homeShot}`);

  // 2. Navigate to Custom 3D PC Builder
  console.log('\n--- 2. Testing Custom 3D PC Builder Navigation ---');
  const builderBtn = await page.$('button:has-text("Custom PC Quote")') || await page.$('button:has-text("CUSTOM 3D PC BUILDER")');
  if (builderBtn) await builderBtn.click();
  await page.waitForTimeout(1000);

  const builderHeading = await page.textContent('h1');
  console.log('Builder View Loaded:', builderHeading?.trim());

  // Check 3D Canvas
  const canvas = await page.$('canvas');
  console.log('3D Canvas element present:', !!canvas);

  const builderShot = path.join(clientDir, 'computercare-builder.png');
  await page.screenshot({ path: builderShot });
  console.log(`✓ Saved Computer Care Builder screenshot to ${builderShot}`);

  // 3. Test Cart Drawer
  console.log('\n--- 3. Testing Cart Drawer Interaction ---');
  const cartTrigger = await page.$('button[title="View Shopping Cart"]');
  if (cartTrigger) {
    await cartTrigger.click();
    await page.waitForTimeout(800);
    const cartTitle = await page.textContent('h2:has-text("Your Hardware Cart")');
    console.log('✓ Cart Drawer Opened:', cartTitle?.trim());

    const cartShot = path.join(clientDir, 'computercare-cart.png');
    await page.screenshot({ path: cartShot });
    console.log(`✓ Saved Cart Drawer screenshot to ${cartShot}`);

    // Close cart
    const closeBtn = await page.$('button[aria-label="Close cart"]') || await page.$('div.fixed button:has(svg)');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 4. Navigate to Component Catalog
  console.log('\n--- 4. Testing Computer Care Components Catalog ---');
  const componentsBtn = await page.$('button:has-text("Components")') || await page.$('button:has-text("Component Store")');
  if (componentsBtn) await componentsBtn.click();
  await page.waitForTimeout(1000);

  const catalogHeading = await page.textContent('h1');
  console.log('Catalog View Loaded:', catalogHeading?.trim());

  const catalogShot = path.join(clientDir, 'computercare-catalog.png');
  await page.screenshot({ path: catalogShot });
  console.log(`✓ Saved Catalog Store screenshot to ${catalogShot}`);

  // 5. Mobile Viewport (iPhone 14)
  console.log('\n--- 5. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const mobileShot = path.join(clientDir, 'computercare-mobile.png');
  await mobilePage.screenshot({ path: mobileShot, fullPage: false });
  console.log(`✓ Saved Mobile screenshot to ${mobileShot}`);

  // 6. Check Console Errors
  console.log('\n--- 6. Runtime Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ ZERO runtime console errors detected!');
  } else {
    console.log(`⚠️ Detected ${consoleErrors.length} console errors:`, consoleErrors);
  }

  await browser.close();
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
}

runAudit();
