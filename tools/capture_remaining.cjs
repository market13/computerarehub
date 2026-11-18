const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Builder
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  // Click Start Custom Build
  const startBtn = mobile.locator('button:has-text("START YOUR CUSTOM BUILD"), a:has-text("Build Custom PC")').first();
  await startBtn.click();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_builder.png' });

  // 2. Mobile Catalog
  // Click on Components in drawer or top
  const hamburger = mobile.locator('button[aria-label="Toggle Navigation Menu"]');
  await hamburger.click();
  await mobile.waitForTimeout(300);
  await mobile.locator('button:has-text("Components (All 4,300+ Products)")').click();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_catalog.png' });
  await mobile.close();

  // 3. Laptop 1366x768 (Standard Windows Laptop)
  const laptop1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await laptop1366.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop1366.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1366_home.png' });
  
  await laptop1366.locator('button:has-text("Custom PC Builder")').first().click();
  await laptop1366.waitForTimeout(400);
  await laptop1366.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1366_builder.png' });
  await laptop1366.close();

  // 4. Laptop 1024x768 (Compact Laptop / iPad Landscape)
  const laptop1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await laptop1024.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop1024.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1024_home.png' });
  await laptop1024.close();

  await browser.close();
  console.log('All remaining screenshots captured successfully.');
})();
