const { chromium } = require('playwright');
const path = require('path');

const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Verify "Asus Graphic Cards" is not visible in the header
  const asusOfferBanner = page.locator('text=Asus Graphic Cards');
  const isAsusVisible = await asusOfferBanner.isVisible();
  console.log('Is Asus Graphic Cards visible in header?', isAsusVisible);

  // Take screenshot of header
  const screenshotHeader = path.join(artifactDir, 'header-without-asus-banner.png');
  await page.screenshot({ path: screenshotHeader, clip: { x: 0, y: 0, width: 1400, height: 200 } });
  console.log('Saved header screenshot:', screenshotHeader);

  // 2. Click "Pre-Built PCs HOT" in header navigation
  console.log('Clicking Pre-Built PCs HOT tab...');
  await page.locator('button:has-text("Pre-Built PCs")').first().click();
  await page.waitForTimeout(1000);

  // Take screenshot of Pre-Built PCs catalog
  const screenshotCatalog = path.join(artifactDir, 'prebuilt-catalog-i3-combo-9999.png');
  await page.screenshot({ path: screenshotCatalog, fullPage: false });
  console.log('Saved prebuilt catalog screenshot:', screenshotCatalog);

  // 3. Click on the new i3 3rd Gen combo card to open Product Detail Modal
  console.log('Opening detail modal for i3 combo...');
  const detailBtn = page.locator('text=Intel Core i3 3rd Gen').first();
  if (await detailBtn.isVisible()) {
    await detailBtn.click();
    await page.waitForTimeout(1000);

    const screenshotModal = path.join(artifactDir, 'prebuilt-i3-modal-details.png');
    await page.screenshot({ path: screenshotModal, fullPage: false });
    console.log('Saved product detail modal screenshot:', screenshotModal);
  }

  await browser.close();
  console.log('All verifications finished!');
}

run().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
