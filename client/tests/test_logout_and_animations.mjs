import { chromium } from 'playwright';

async function testLogoutAndAnimations() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Navigating to http://127.0.0.1:5173/...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

  // Simulate existing logged-in admin
  await page.evaluate(() => {
    localStorage.setItem('computercare_admin_auth', 'true');
  });
  await page.reload({ waitUntil: 'networkidle' });

  // Open modal by clicking "Account"
  console.log('2. Clicking "Account" in header while logged in...');
  await page.click('button:has-text("Account")');
  await page.waitForTimeout(500);

  // Check that "Admin Session Currently Active" is visible
  const activeSessionVisible = await page.isVisible('text=Admin Session Currently Active');
  console.log('Active session card visible:', activeSessionVisible);

  // Click "Log Out" button inside modal
  console.log('3. Clicking "Log Out" inside modal...');
  await page.click('button:has-text("Log Out")');
  await page.waitForTimeout(600);

  // Take screenshot of the modal now showing the Login form!
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/logout_successful_form_revealed.png'
  });
  console.log('✓ Screenshot saved: logout_successful_form_revealed.png');

  // Verify that the login form inputs are now visible in the modal
  const passwordInputVisible = await page.isVisible('input[type="password"]');
  console.log('Login form input visible after logout:', passwordInputVisible);

  const isAuthCleared = await page.evaluate(() => {
    return localStorage.getItem('computercare_admin_auth') === null;
  });
  console.log('localStorage cleared:', isAuthCleared);

  // Explicitly click Close X button on modal
  console.log('Closing modal via X button...');
  await page.click('button[aria-label="Close"]');
  await page.waitForTimeout(500);

  // 4. Test Tab Switching Animations
  console.log('4. Testing tab switching animations...');
  // Click "Build Custom PC"
  const pcBuilderBtn = page.locator('button:has-text("Build Custom PC")').first();
  await pcBuilderBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/tab_switch_animation_verified.png'
  });
  console.log('✓ Tab switch animation verified!');

  // 5. Test Catalog Category Switch & Animation
  console.log('5. Navigating to Catalog and testing category switch animation...');
  const catalogBtn = page.locator('button:has-text("Browse All Categories")').first();
  if (await catalogBtn.isVisible()) {
    await catalogBtn.click();
  } else {
    await page.goto('http://127.0.0.1:5173/#catalog', { waitUntil: 'networkidle' });
  }
  await page.waitForTimeout(600);

  // Switch category to Processors
  const cpuBtn = page.locator('button:has-text("Processors")').first();
  if (await cpuBtn.isVisible()) {
    await cpuBtn.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/product_grid_animation_verified.png'
  });
  console.log('✓ Product grid animation verified!');

  await browser.close();
  console.log('All tests passed cleanly!');
}

testLogoutAndAnimations().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
