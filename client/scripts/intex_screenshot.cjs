const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    const select = document.querySelector('select');
    if (select) {
      select.value = 'case';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Intex")').first().click();
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 150));
  await page.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/catalog-intex-top.png' });
  await browser.close();
  console.log('Done Intex screenshot');
})();
