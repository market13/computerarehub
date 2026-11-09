import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testMobileDesign() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // 1. Shop By Category (scroll into the 2-column cards)
  const shopCat = await page.$('section:has-text("SHOP BY CATEGORY")');
  if (shopCat) {
    await shopCat.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 180));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(clientDir, 'mobile-shop-by-category.png') });
  }

  // 2. Featured PC Build Categories (scroll so heading + first 4 cards are framed)
  const pcSection = await page.$('section:has-text("FEATURED PC BUILD")');
  if (pcSection) {
    await pcSection.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 160));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(clientDir, 'mobile-featured-pc-builds.png') });
  }

  await browser.close();
  console.log('Mobile screenshots captured successfully!');
}

testMobileDesign();
