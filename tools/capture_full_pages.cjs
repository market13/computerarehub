const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile 390px
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/full_mobile_home.png', fullPage: true });

  // Click on "Browse All Categories" or hamburger
  const catToggle = mobile.locator('button:has-text("Browse All Categories")');
  if (await catToggle.isVisible()) {
    await catToggle.click();
    await mobile.waitForTimeout(300);
    await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/mobile_categories_open.png' });
  }

  // Switch to Builder on mobile
  const buildBtn = mobile.locator('a:has-text("Build Custom PC"), button:has-text("START YOUR CUSTOM BUILD")').first();
  if (await buildBtn.isVisible()) {
    await buildBtn.click();
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/full_mobile_builder.png', fullPage: true });
  }

  // 2. Laptop 1366px
  const laptop = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await laptop.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/full_laptop_home.png', fullPage: true });

  // Switch to Builder on laptop
  const laptopBuildBtn = laptop.locator('button:has-text("START YOUR CUSTOM BUILD"), button:has-text("CUSTOM PC BUILDER")').first();
  if (await laptopBuildBtn.isVisible()) {
    await laptopBuildBtn.click();
    await laptop.waitForTimeout(400);
    await laptop.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/full_laptop_builder.png', fullPage: true });
  }

  // 3. Laptop 1024px
  const laptop1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await laptop1024.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await laptop1024.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/full_laptop1024_home.png', fullPage: true });

  await browser.close();
  console.log('Full page screenshots generated.');
})();
