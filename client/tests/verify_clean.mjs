import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  console.log('Testing http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const content = await page.content();
  const count = (content.match(/elitehub/gi) || []).length;
  console.log('Matches of elitehub in loaded DOM:', count);

  const screenshotPath = 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/clean_mobile_verification.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to', screenshotPath);

  await browser.close();

  if (count > 0) {
    console.error('FAILED: Found elitehub in DOM!');
    process.exit(1);
  } else {
    console.log('SUCCESS: ZERO ELITEHUB IN DOM!');
  }
})();
