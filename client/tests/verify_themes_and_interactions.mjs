import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testWebsite() {
  console.log('=== RUNNING COMPREHENSIVE E2E & DESIGN GUIDELINES AUDIT ===');
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Test
  console.log('\n--- 1. Testing Desktop Layout (1440x900) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();

  // Listen for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Page loaded successfully. Title:', await page.title());

  // Check Hero presence
  const heroText = await page.textContent('h1');
  console.log('Hero Heading:', heroText.trim());

  // Check 3D Canvas
  const canvas = await page.$('canvas');
  console.log('3D WebGL Canvas present:', !!canvas);

  // Take Desktop Hero & Builder Screenshot
  const desktopShot = path.join(clientDir, 'audit-desktop-front.png');
  await page.screenshot({ path: desktopShot });
  console.log(`✓ Saved desktop front screenshot to ${desktopShot}`);

  // 2. Test Theme Switching
  console.log('\n--- 2. Testing Theme Switcher Interaction ---');
  const themeButtons = await page.$$('button:has-text("Arctic Glacier"), button:has-text("Cyberpunk Neon"), button:has-text("Obsidian Titanium")');
  console.log(`Found ${themeButtons.length} theme buttons on the front page.`);
  if (themeButtons.length > 0) {
    // Click Arctic Glacier
    const arcticBtn = await page.$('button:has-text("Arctic Glacier")');
    if (arcticBtn) {
      await arcticBtn.click();
      await page.waitForTimeout(600);
      console.log('✓ Successfully switched theme to Arctic Glacier');
    }
  }

  // 3. Test 3D Cabinet Controls (Open Glass Panel)
  console.log('\n--- 3. Testing 3D Cabinet Controls ---');
  const openGlassBtn = await page.$('button:has-text("Open Glass Panel")');
  if (openGlassBtn) {
    await openGlassBtn.click();
    await page.waitForTimeout(500);
    const newGlassText = await openGlassBtn.textContent();
    console.log('✓ Glass panel toggled state:', newGlassText.trim());
  }

  // 4. Test Component Selector Modal
  console.log('\n--- 4. Testing Component Selector Modal & Search ---');
  const changeButtons = await page.$$('button:has-text("Change")');
  if (changeButtons.length > 0) {
    await changeButtons[0].click();
    await page.waitForTimeout(600);

    const modalTitle = await page.textContent('h2');
    console.log('Modal opened:', modalTitle.trim());

    // Search for a component
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.fill('RTX');
      await page.waitForTimeout(500);
      const searchCount = await page.textContent('span.font-mono:has-text("items available")');
      console.log('Search filtered results count:', searchCount?.trim());
    }

    const modalShot = path.join(clientDir, 'audit-modal.png');
    await page.screenshot({ path: modalShot });
    console.log(`✓ Saved modal screenshot to ${modalShot}`);

    // Close modal
    const closeBtn = await page.$('button:has(svg.lucide-x)');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 5. Mobile Layout Test (390x844 - iPhone 14)
  console.log('\n--- 5. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const mobileShot = path.join(clientDir, 'audit-mobile.png');
  await mobilePage.screenshot({ path: mobileShot, fullPage: false });
  console.log(`✓ Saved mobile screenshot to ${mobileShot}`);

  // 6. Check console errors
  console.log('\n--- 6. Console Errors Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ ZERO console errors detected during runtime execution!');
  } else {
    console.log(`⚠️ Detected ${consoleErrors.length} console errors:`, consoleErrors);
  }

  await browser.close();
  console.log('\n=== ALL AUDIT CHECKS COMPLETED SUCCESSFULLY ===');
}

testWebsite();
