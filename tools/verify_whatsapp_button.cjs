const { chromium } = require('playwright');
const path = require('path');

const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Test
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check WhatsApp button visibility & href
  const waBtn = page.locator('aside[aria-label="WhatsApp Support Floating Action"] a').first();
  const isVisible = await waBtn.isVisible();
  const href = await waBtn.getAttribute('href');
  console.log('Is WhatsApp button visible?', isVisible);
  console.log('WhatsApp button target URL:', href);

  // Screenshot idle desktop
  const screenshotDesktopIdle = path.join(artifactDir, 'whatsapp-floating-corner-desktop.png');
  await page.screenshot({ path: screenshotDesktopIdle, fullPage: false });
  console.log('Saved desktop idle screenshot:', screenshotDesktopIdle);

  // Hover over the WhatsApp button
  await waBtn.hover();
  await page.waitForTimeout(500);

  // Screenshot hovered with tooltip
  const screenshotDesktopHover = path.join(artifactDir, 'whatsapp-floating-tooltip-hover.png');
  await page.screenshot({ path: screenshotDesktopHover, fullPage: false });
  console.log('Saved desktop hover screenshot:', screenshotDesktopHover);

  await context.close();

  // 2. Mobile Test (iPhone 14: 390x844)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);

  const screenshotMobile = path.join(artifactDir, 'whatsapp-floating-mobile-corner.png');
  await mobilePage.screenshot({ path: screenshotMobile, fullPage: false });
  console.log('Saved mobile screenshot:', screenshotMobile);

  await mobileContext.close();
  await browser.close();
  console.log('WhatsApp button verification completed successfully!');
}

run().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
