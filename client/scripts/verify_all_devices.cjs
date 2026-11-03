const { chromium } = require('playwright');

const viewports = [
  { name: 'mobile_360', width: 360, height: 740 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'laptop_1024', width: 1024, height: 768 },
  { name: 'laptop_1280', width: 1280, height: 800 },
  { name: 'laptop_1366', width: 1366, height: 768 },
  { name: 'desktop_1536', width: 1536, height: 864 }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const auditReport = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // 1. Audit Home
    const homeOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }));
    auditReport.push({ viewport: vp.name, view: 'home', ...homeOverflow });

    // 2. Audit Builder
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('START YOUR CUSTOM BUILD') || el.textContent.includes('Build Custom PC'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);

    const builderOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }));
    auditReport.push({ viewport: vp.name, view: 'builder', ...builderOverflow });

    // 3. Audit Catalog
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('VIEW ALL') || el.textContent.includes('Components') || el.textContent.includes('Browse All Categories'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);

    const catalogOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }));
    auditReport.push({ viewport: vp.name, view: 'catalog', ...catalogOverflow });

    // 4. Audit Bulk Order
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Bulk Order'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);

    const bulkOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }));
    auditReport.push({ viewport: vp.name, view: 'bulk-order', ...bulkOverflow });

    await page.close();
  }

  console.log('AUDIT REPORT:');
  console.log(JSON.stringify(auditReport, null, 2));

  // Visual Verification Screenshots
  // Mobile Home & Builder
  const mPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_mobile_home.png', fullPage: false });

  // Open mobile menu drawer
  const hamburger = mPage.locator('button[aria-label="Toggle Navigation Menu"]');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await mPage.waitForTimeout(300);
    await mPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_mobile_drawer.png', fullPage: false });
    // Close drawer
    const closeBtn = mPage.locator('button[aria-label="Close Navigation Menu"]');
    if (await closeBtn.isVisible()) await closeBtn.click();
    await mPage.waitForTimeout(200);
  }

  // Mobile Builder View
  await mPage.locator('button:has-text("START YOUR CUSTOM BUILD")').click();
  await mPage.waitForTimeout(400);
  await mPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_mobile_builder.png', fullPage: false });

  // Mobile Catalog View
  await mPage.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Bulk Order'));
    // Navigate to catalog
  });
  await mPage.goto('http://localhost:5173');
  await mPage.locator('button:has-text("Browse All Categories"), button:has-text("EXPLORE GRAPHICS CARDS")').first().click();
  await mPage.waitForTimeout(400);
  await mPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_mobile_catalog.png', fullPage: false });

  await mPage.close();

  // Laptop 1366px Home & Builder
  const lPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await lPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await lPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_laptop1366_home.png', fullPage: false });

  await lPage.locator('button:has-text("START YOUR CUSTOM BUILD")').click();
  await lPage.waitForTimeout(400);
  await lPage.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_laptop1366_builder.png', fullPage: false });
  await lPage.close();

  // Laptop 1024px Home
  const l1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await l1024.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await l1024.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/verified_laptop1024_home.png', fullPage: false });
  await l1024.close();

  await browser.close();
  console.log('All verification tasks finished!');
})();
