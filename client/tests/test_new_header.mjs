import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testHeader() {
  console.log('=== VERIFYING NEW COMPUTER CARE HEADER (ELITEHUBS THEME) ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Check Header Elements
  console.log('\n--- 1. Checking Top Announcement Bar ---');
  const announcementText = await page.textContent('div:has-text("Your one stop destination")');
  console.log('Announcement Text:', announcementText?.trim().slice(0, 60));

  const emailText = await page.textContent('span:has-text("contact@computercare.in")');
  console.log('Email verified:', emailText?.trim());

  // 2. Check Logo
  console.log('\n--- 2. Checking Logo Branding ---');
  const logoText = await page.textContent('span:has-text("COMPUTERCARE.COM")');
  console.log('Logo Brand:', logoText?.trim());

  // 3. Check Search Bar
  console.log('\n--- 3. Checking Search Bar ---');
  const searchInput = await page.$('input[placeholder="Search for products ..."]');
  console.log('Search input found with placeholder:', !!searchInput);

  const searchBtn = await page.$('button:has-text("Search")');
  console.log('Search button found:', !!searchBtn);

  // 4. Check User Action Icons
  console.log('\n--- 4. Checking User Action Icons (Account, Wishlist, Cart) ---');
  const accountText = await page.textContent('span:has-text("Account")');
  console.log('Account widget found:', !!accountText);

  const cartWidget = await page.$('div:has-text("Your Cart")');
  console.log('Cart widget found:', !!cartWidget);

  // 5. Check Navigation Links
  console.log('\n--- 5. Checking Bottom Navigation Bar Links ---');
  const navItems = await page.$$eval('nav button, nav div', els => els.map(e => e.textContent?.trim()).filter(Boolean));
  console.log('Nav items sample:', navItems.slice(0, 10));

  // Take screenshot of Desktop Header & Top Fold
  const headerShot = path.join(clientDir, 'computercare-header-preview.png');
  await page.screenshot({ path: headerShot });
  console.log(`✓ Saved Header Preview screenshot to ${headerShot}`);

  // Test Browse All Categories dropdown
  console.log('\n--- 6. Testing Browse All Categories dropdown ---');
  const browseBtn = await page.$('button:has-text("Browse All Categories")');
  if (browseBtn) {
    await browseBtn.click();
    await page.waitForTimeout(500);
    const megaMenuVisible = await page.$('div:has-text("PC Cabinets")');
    console.log('Mega menu expanded:', !!megaMenuVisible);
    // Click again to close
    await browseBtn.click();
    await page.waitForTimeout(300);
  }

  // Test Custom PC Builder options
  console.log('\n--- 7. Testing Custom PC Builder Options in Header ---');
  // Check top announcement shortcut
  const topBuilderBtn = await page.$('button:has-text("Build Custom PC in 3D")');
  console.log('Top bar 3D builder shortcut found:', !!topBuilderBtn);

  // Check middle header button
  const middleBuilderBtn = await page.$('button:has-text("Custom PC Builder")');
  console.log('Middle header Custom PC Builder button found:', !!middleBuilderBtn);

  // Check bottom nav bar button
  const navBuilderBtn = await page.$('button:has-text("CUSTOM PC BUILDER")');
  console.log('Nav bar CUSTOM PC BUILDER button found:', !!navBuilderBtn);

  if (navBuilderBtn) {
    await navBuilderBtn.click();
    await page.waitForTimeout(1000);
    const canvas = await page.$('canvas');
    console.log('Navigated to 3D Builder, Canvas present:', !!canvas);
  }

  // Check Cart trigger
  console.log('\n--- 8. Testing Cart Trigger ---');
  const cartTrigger = await page.$('div:has-text("Your Cart")');
  if (cartTrigger) {
    await cartTrigger.click();
    await page.waitForTimeout(600);
    const cartDrawer = await page.$('h2:has-text("Your Hardware Cart")');
    console.log('Cart drawer opened:', !!cartDrawer);
    const closeBtn = await page.$('button[aria-label="Close cart"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // Check console errors
  console.log('\n--- 9. Runtime Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero console errors!');
  } else {
    console.warn('⚠️ Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== HEADER VERIFICATION COMPLETE ===');
}

testHeader().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
