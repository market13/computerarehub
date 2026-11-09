import { chromium } from 'playwright';

async function testAdminPortal() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://127.0.0.1:5173/#admin...');
  await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle' });

  // 1. Login gate if password visible
  const isPasswordVisible = await page.isVisible('input[type="password"]');
  if (isPasswordVisible) {
    await page.screenshot({
      path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_login.png'
    });
    console.log('✓ Admin login screen captured');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Authenticate")');
    await page.waitForTimeout(1000);
  }

  // 2. Dashboard Overview Screenshot
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_dashboard.png'
  });
  console.log('✓ Admin dashboard overview captured');

  // 3. Switch to Orders Tab
  await page.click('button:has-text("Orders & Fulfillment")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_orders.png'
  });
  console.log('✓ Admin orders management captured');

  // Click on "Details" of the first order to open order side-drawer
  const detailsBtn = await page.$('button:has-text("Details")');
  if (detailsBtn) {
    await detailsBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_order_detail.png'
    });
    console.log('✓ Admin order detail drawer captured');
  }

  // 4. Switch to Products & Inventory Tab
  await page.click('button:has-text("Products & Inventory")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_products.png'
  });
  console.log('✓ Admin products & inventory captured');

  // 5. Switch to Quotations & Leads Tab
  await page.click('button:has-text("Quotations & Leads")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_quotations.png'
  });
  console.log('✓ Admin quotations & leads captured');

  // 6. Switch to Discount Coupons Tab
  await page.click('button:has-text("Discount Coupons")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_coupons.png'
  });
  console.log('✓ Admin coupons captured');

  await browser.close();
  console.log('All admin screenshots saved successfully!');
}

testAdminPortal().catch(err => {
  console.error('Error testing admin portal:', err);
  process.exit(1);
});
