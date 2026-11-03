const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  const btn = mobilePage.locator('aside[aria-label="WhatsApp Support Floating Action"]');
  const box = await btn.boundingBox();
  console.log('Mobile box:', box);

  const isVis = await btn.isVisible();
  console.log('Is visible on mobile:', isVis);

  await mobilePage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/test-mobile-box.png' });
  await browser.close();
})();
