const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="WhatsApp Support Floating Action"]');
    const a = aside ? aside.querySelector('a') : null;
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      asideRect: aside ? aside.getBoundingClientRect() : null,
      aRect: a ? a.getBoundingClientRect() : null,
      asideComputed: aside ? {
        position: window.getComputedStyle(aside).position,
        bottom: window.getComputedStyle(aside).bottom,
        right: window.getComputedStyle(aside).right,
        zIndex: window.getComputedStyle(aside).zIndex,
        display: window.getComputedStyle(aside).display
      } : null
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/debug-mobile.png', fullPage: false });
  await browser.close();
})();
