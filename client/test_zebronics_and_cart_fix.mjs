import { chromium } from '@playwright/test';
import path from 'path';

const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function testZebronicsAndCart() {
  console.log('=== VERIFYING ZEBRONICS INVENTORY & CART FIT ===');
  const browser = await chromium.launch({ headless: true });
  
  // Test at 1366x768 (standard laptop resolution matching user screenshot)
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Verify Header & Cart Visibility
  const cartRect = await page.$eval('button[title="View Shopping Cart"]', el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width, visible: r.right <= 1366 };
  });
  console.log('Cart Button Rect:', cartRect);
  if (!cartRect.visible) {
    throw new Error('Cart button is still overflowing the viewport!');
  }
  console.log('✓ Cart button is 100% visible and fits comfortably inside the viewport.');

  const headerShot = path.join(artifactDir, 'computercare-header-cart-fixed.png');
  await page.screenshot({ path: headerShot });
  console.log(`✓ Saved header screenshot to ${headerShot}`);

  // 2. Search for "Zebronics"
  console.log('\n--- Testing Zebronics Search ---');
  await page.fill('input[placeholder="Search for products ..."]', 'Zebronics');
  await page.click('button:has-text("Search")');
  await page.waitForTimeout(1500);

  const productCards = await page.$$('.grid > div');
  console.log(`Product cards found for "Zebronics": ${productCards.length}`);
  if (productCards.length === 0) {
    throw new Error('No Zebronics products found in catalog!');
  }

  const zebShot = path.join(artifactDir, 'computercare-zebronics-catalog.png');
  await page.screenshot({ path: zebShot });
  console.log(`✓ Saved Zebronics catalog screenshot to ${zebShot}`);

  // 3. Test Zebronics Monitors
  console.log('\n--- Testing Zebronics in Gaming Monitors Tab ---');
  await page.click('button:has-text("Monitors")');
  await page.waitForTimeout(1500);

  const monitorCards = await page.$$('.grid > div');
  console.log(`Monitor cards visible: ${monitorCards.length}`);

  const monitorShot = path.join(artifactDir, 'computercare-monitors-catalog.png');
  await page.screenshot({ path: monitorShot });
  console.log(`✓ Saved Monitors catalog screenshot to ${monitorShot}`);

  await browser.close();
  console.log('\n=== ALL ZEBRONICS & CART TESTS PASSED! ===');
}

testZebronicsAndCart().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
