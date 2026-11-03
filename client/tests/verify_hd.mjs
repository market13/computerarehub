import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2 // High DPI Retina display simulation
  });
  const page = await context.newPage();

  console.log('Opening http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to ShopByCategory
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);

  const screenshotPath = 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/hd_categories_verified.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved HD categories screenshot to:', screenshotPath);

  // Scroll to trending products
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);

  const prodScreenshotPath = 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/hd_products_verified.png';
  await page.screenshot({ path: prodScreenshotPath });
  console.log('Saved HD products screenshot to:', prodScreenshotPath);

  await browser.close();
})();
