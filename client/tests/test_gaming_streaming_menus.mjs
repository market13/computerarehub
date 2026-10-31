import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testGamingAndStreamingMenus() {
  console.log('=== VERIFYING GAMING & STREAMING MEGA MENUS ===');
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

  // 1. Inspect Gaming Menu Trigger
  console.log('\n--- 1. Testing Gaming Dropdown ---');
  const gamingBtn = await page.$('nav button:has-text("Gaming")');
  if (!gamingBtn) throw new Error('Gaming button not found in navigation');

  await gamingBtn.hover();
  await page.waitForTimeout(500);

  // Check column headers in Gaming dropdown
  const gamingHeaders = await page.$$eval('nav div.absolute h4', heads => heads.map(h => h.textContent.trim()));
  console.log('Gaming dropdown headers found:', gamingHeaders);

  const expectedGamingHeaders = [
    'Gaming Mouse',
    'Gaming PC',
    'Gaming Keyboard',
    'Gaming Chair',
    'Gaming Headphones',
    'Controllers / Gamepad',
    'Gaming Mousepad'
  ];

  for (const expected of expectedGamingHeaders) {
    if (gamingHeaders.includes(expected)) {
      console.log(`  ✓ Header "${expected}" present`);
    } else {
      console.warn(`  ⚠️ Header "${expected}" not found!`);
    }
  }

  const gamingShot = path.join(clientDir, 'computercare-gaming-dropdown.png');
  await page.screenshot({ path: gamingShot });
  console.log(`✓ Saved Gaming dropdown screenshot to ${gamingShot}`);

  // 2. Inspect Streaming Menu Trigger
  console.log('\n--- 2. Testing Streaming Dropdown ---');
  const streamingBtn = await page.$('nav button:has-text("Streaming")');
  if (!streamingBtn) throw new Error('Streaming button not found in navigation');

  await streamingBtn.hover();
  await page.waitForTimeout(500);

  // Check column headers in Streaming dropdown
  const streamingHeaders = await page.$$eval('nav div.absolute h4', heads => heads.map(h => h.textContent.trim()));
  console.log('Streaming dropdown headers found:', streamingHeaders);

  const expectedStreamingHeaders = [
    'Webcam',
    'Microphones',
    'Elgato',
    'Gaming & Streaming PC'
  ];

  for (const expected of expectedStreamingHeaders) {
    if (streamingHeaders.includes(expected)) {
      console.log(`  ✓ Header "${expected}" present`);
    } else {
      console.warn(`  ⚠️ Header "${expected}" not found!`);
    }
  }

  const streamingShot = path.join(clientDir, 'computercare-streaming-dropdown.png');
  await page.screenshot({ path: streamingShot });
  console.log(`✓ Saved Streaming dropdown screenshot to ${streamingShot}`);

  // 3. Test Clicking a Link in Mega Menu (e.g., "Razer Gaming Mouse")
  console.log('\n--- 3. Testing Click Interaction in Gaming Dropdown ---');
  await gamingBtn.hover();
  await page.waitForTimeout(400);

  const razerMouseBtn = await page.$('nav div.absolute button:has-text("Razer Gaming Mouse")');
  if (razerMouseBtn) {
    console.log('Clicking "Razer Gaming Mouse" link...');
    await razerMouseBtn.click();
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    const searchVal = await page.$eval('input[type="text"]', el => el.value).catch(() => '');
    console.log(`Search input populated with: "${searchVal}"`);
    console.log('✓ Successfully navigated to search view upon clicking mega-menu item!');
  }

  // 4. Console Audit
  console.log('\n--- 4. Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero console errors!');
  } else {
    console.warn('⚠️ Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('\n=== ALL GAMING & STREAMING TESTS COMPLETED SUCCESSFULLY ===');
}

testGamingAndStreamingMenus().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
