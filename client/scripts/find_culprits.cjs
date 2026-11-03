const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Go to builder
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('START YOUR CUSTOM BUILD') || el.textContent.includes('CUSTOM PC BUILDER') || el.textContent.includes('Build Custom PC'));
    if (b) b.click();
  });
  await page.waitForTimeout(400);

  const culprits = await page.evaluate(() => {
    const res = [];
    const windowWidth = window.innerWidth;
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > windowWidth || rect.right > windowWidth + 1) {
        res.push({
          tag: el.tagName,
          id: el.id,
          cls: (el.className || '').toString().slice(0, 70),
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          text: (el.textContent || '').trim().slice(0, 40)
        });
      }
    });
    return res.sort((a,b) => b.width - a.width).slice(0, 15);
  });

  console.log(JSON.stringify(culprits, null, 2));
  await browser.close();
})();
