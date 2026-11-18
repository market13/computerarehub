const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile 390x844 (iPhone 12/13/14)
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(400);

  // Mobile Home
  await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_home.png' });

  // Mobile Drawer
  const hamburger = mobile.locator('button[aria-label="Toggle Navigation Menu"]');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await mobile.waitForTimeout(350);
    await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_drawer.png' });
    
    // Click "Custom PC Builder" in drawer
    await mobile.locator('button:has-text("Custom PC Builder")').first().click();
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_builder.png' });
  }

  // Mobile Catalog
  await mobile.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Components') || el.textContent.includes('VIEW ALL'));
    if (btn) btn.click();
  });
  await mobile.goto('http://localhost:5173');
  await mobile.waitForTimeout(300);
  // Navigate via search or direct catalog
  await mobile.locator('button[aria-label="Toggle Navigation Menu"]').click();
  await mobile.waitForTimeout(250);
  await mobile.locator('button:has-text("Components (All 4,300+ Products)")').click();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_mobile_catalog.png' });

  await mobile.close();

  // 2. Laptop 1366x768 (Standard Windows Laptop)
  const laptop1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await laptop1366.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop1366.waitForTimeout(400);
  await laptop1366.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1366_home.png' });

  // Laptop Builder
  await laptop1366.locator('button:has-text("CUSTOM PC BUILDER")').first().click();
  await laptop1366.waitForTimeout(400);
  await laptop1366.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1366_builder.png' });
  await laptop1366.close();

  // 3. Laptop 1024x768 (Compact Laptop / iPad Landscape)
  const laptop1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await laptop1024.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop1024.waitForTimeout(400);
  await laptop1024.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/final_laptop1024_home.png' });
  await laptop1024.close();

  await browser.close();
  console.log('Final screenshots captured.');
})();
