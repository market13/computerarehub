const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Get clip or parent overflow info
  const details = await page.evaluate(() => {
    const a = document.querySelector('aside[aria-label="WhatsApp Support Floating Action"] a');
    let parent = a;
    const chain = [];
    while (parent) {
      const style = window.getComputedStyle(parent);
      chain.push({
        tag: parent.tagName,
        id: parent.id,
        className: parent.className,
        overflow: style.overflow,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        clip: style.clip,
        clipPath: style.clipPath,
        rect: parent.getBoundingClientRect()
      });
      parent = parent.parentElement;
    }
    return chain;
  });

  console.log(JSON.stringify(details, null, 2));

  // Take screenshot of just the a element
  const aElem = page.locator('aside[aria-label="WhatsApp Support Floating Action"] a');
  await aElem.screenshot({ path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/btn-screenshot.png' });

  await browser.close();
})();
