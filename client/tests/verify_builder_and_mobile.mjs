import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function verifyAll() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile verification (iPhone 14 Pro)
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);

  // Scroll down to Shop By Category
  const shopCat = await mobilePage.$('section:has-text("SHOP BY CATEGORY")');
  if (shopCat) {
    await shopCat.scrollIntoViewIfNeeded();
    await mobilePage.evaluate(() => window.scrollBy(0, 160));
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(clientDir, 'verified-mobile-categories.png') });
    console.log('✓ Verified mobile categories screenshot saved.');
  }

  // 2. Desktop PC Builder verification
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(1000);

  // Navigate to Builder
  const builderBtn = await desktopPage.$('button:has-text("Build Custom PC")');
  if (builderBtn) {
    await builderBtn.click();
    await desktopPage.waitForTimeout(1200);

    // Open Presets modal
    const presetsBtn = await desktopPage.$('button:has-text("Prebuilt Presets")');
    if (presetsBtn) {
      await presetsBtn.click();
      await desktopPage.waitForTimeout(600);
      const loadBtn = await desktopPage.$('button:has-text("Load Build")');
      if (loadBtn) {
        await loadBtn.click();
        await desktopPage.waitForTimeout(1000);
        console.log('✓ Successfully loaded preset into 3D PC Builder.');
      }
    }

    await desktopPage.screenshot({ path: path.join(clientDir, 'verified-pc-builder.png') });
    console.log('✓ Verified PC builder screenshot saved.');
  }

  await browser.close();
  console.log('=== VERIFICATION SCRIPT COMPLETED ===');
}

verifyAll().catch(e => {
  console.error(e);
  process.exit(1);
});
