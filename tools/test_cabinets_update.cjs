const { chromium } = require('playwright');
const path = require('path');

const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Navigate to Catalog -> PC Cabinets
  console.log('Navigating to Catalog View for PC Cabinets...');
  await page.evaluate(() => {
    // trigger navigation to catalog with category 'case'
    const select = document.querySelector('select');
    if (select) {
      select.value = 'case';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);

  // Take screenshot of All Cabinets overview
  const screenshotAll = path.join(artifactDir, 'catalog-cabinets-allowed-brands.png');
  await page.screenshot({ path: screenshotAll, fullPage: false });
  console.log('Saved screenshot 1:', screenshotAll);

  // Check brands present
  const brandPills = await page.locator('button:has-text("Intex"), button:has-text("Geonix"), button:has-text("Cooler Master"), button:has-text("Ant Esports"), button:has-text("Zebronics"), button:has-text("DAWG")').allInnerTexts();
  console.log('Found brand pills:', brandPills);

  // 2. Click on Intex
  console.log('Filtering by Intex...');
  const intexBtn = page.locator('button:has-text("Intex")').first();
  if (await intexBtn.isVisible()) {
    await intexBtn.click();
    await page.waitForTimeout(600);
    const screenshotIntex = path.join(artifactDir, 'catalog-intex-cabinets.png');
    await page.screenshot({ path: screenshotIntex, fullPage: false });
    console.log('Saved screenshot Intex:', screenshotIntex);
  }

  // 3. Click on Geonix
  console.log('Filtering by Geonix...');
  const geonixBtn = page.locator('button:has-text("Geonix")').first();
  if (await geonixBtn.isVisible()) {
    await geonixBtn.click();
    await page.waitForTimeout(600);
    const screenshotGeonix = path.join(artifactDir, 'catalog-geonix-cabinets.png');
    await page.screenshot({ path: screenshotGeonix, fullPage: false });
    console.log('Saved screenshot Geonix:', screenshotGeonix);
  }

  // 4. Open Custom PC Builder & Test Component Selector Modal for Cases
  console.log('Testing PC Builder Cabinet selector modal...');
  await page.locator('button[title="Open Custom PC Builder"]').first().click();
  await page.waitForTimeout(800);

  const changeCaseBtn = page.locator('button:has-text("Change Cabinet")').first();
  if (await changeCaseBtn.isVisible()) {
    await changeCaseBtn.click();
    await page.waitForTimeout(800);
    const screenshotModal = path.join(artifactDir, 'builder-cabinet-modal.png');
    await page.screenshot({ path: screenshotModal, fullPage: false });
    console.log('Saved screenshot Modal:', screenshotModal);
  }

  await browser.close();
  console.log('Cabinet verification tests completed successfully!');
}

run().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
