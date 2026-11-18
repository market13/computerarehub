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
  const results = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Measure Home View
    const homeInfo = await page.evaluate(() => {
      const windowWidth = window.innerWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const overflowing = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > windowWidth + 1) {
          overflowing.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 50),
            excess: Math.round(r.right - windowWidth)
          });
        }
      });
      return {
        tab: 'home',
        scrollWidth,
        windowWidth,
        overflow: scrollWidth > windowWidth,
        topOverflows: overflowing.sort((a,b) => b.excess - a.excess).slice(0, 4)
      };
    });
    results.push({ viewport: vp.name, ...homeInfo });

    await page.screenshot({ 
      path: `C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/audit_${vp.name}_home.png`
    });

    // Navigate to Builder
    const builderBtn = page.getByRole('button', { name: /CUSTOM PC BUILDER/i }).first();
    if (await builderBtn.isVisible()) {
      await builderBtn.click();
      await page.waitForTimeout(300);
      const builderInfo = await page.evaluate(() => {
        const windowWidth = window.innerWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > windowWidth + 1) {
            overflowing.push({
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 50),
              excess: Math.round(r.right - windowWidth)
            });
          }
        });
        return {
          tab: 'builder',
          scrollWidth,
          windowWidth,
          overflow: scrollWidth > windowWidth,
          topOverflows: overflowing.sort((a,b) => b.excess - a.excess).slice(0, 4)
        };
      });
      results.push({ viewport: vp.name, ...builderInfo });
      await page.screenshot({ 
        path: `C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/audit_${vp.name}_builder.png`
      });
    }

    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
