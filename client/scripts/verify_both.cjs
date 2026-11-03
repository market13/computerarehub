const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll a bit down so we see floating elements clearly over standard content
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/mobile-corners-both.png', fullPage: false });

  // Now test desktop view with WhatsApp button
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(300);

  // Hover over WhatsApp button to show tooltip
  const waBtn = desktopPage.locator('aside[aria-label="WhatsApp Support Floating Action"]');
  await waBtn.hover();
  await desktopPage.waitForTimeout(350);

  await desktopPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/desktop-wa-hover.png', fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully');
})();
