const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'laptop_1024', width: 1024, height: 768 },
    { name: 'laptop_1280', width: 1280, height: 800 },
    { name: 'laptop_1366', width: 1366, height: 768 }
  ];

  const views = ['builder', 'catalog', 'bulk-order'];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    for (const v of views) {
      // Trigger navigation directly in React state or by clicking
      await page.evaluate((targetView) => {
        // App handles navigation via top bar or buttons
        // Let's trigger window event or click
        if (targetView === 'builder') {
          const b = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Build Custom PC') || el.textContent.includes('START YOUR CUSTOM BUILD') || el.textContent.includes('PC Builder'));
          if (b) b.click();
        } else if (targetView === 'catalog') {
          const b = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('VIEW ALL') || el.textContent.includes('Browse All Categories'));
          if (b) b.click();
        } else if (targetView === 'bulk-order') {
          const b = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Bulk Order'));
          if (b) b.click();
        }
      }, v);

      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        return {
          windowWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      });

      console.log(`${vp.name} - ${v}: overflow=${overflow.hasOverflow} (${overflow.scrollWidth} vs ${overflow.windowWidth})`);

      await page.screenshot({
        path: `C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/view_${vp.name}_${v}.png`,
        fullPage: false
      });
    }

    await page.close();
  }

  await browser.close();
  console.log('Done captures.');
})();
