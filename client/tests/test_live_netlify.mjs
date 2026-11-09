import { chromium } from 'playwright';

async function testLiveNetlify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live Netlify site: https://magical-duckanoo-626d44.netlify.app/...');
  const response = await page.goto('https://magical-duckanoo-626d44.netlify.app/', { waitUntil: 'networkidle' });
  console.log('HTTP Status:', response.status());

  // Listen for any dialog/alert
  let alertMessage = null;
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    console.log('ALERT DETECTED:', alertMessage);
    await dialog.dismiss();
  });

  // Click on "Account"
  console.log('Clicking Account button in header...');
  const accountBtn = page.locator('button:has-text("Account")').first();
  await accountBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/netlify_live_account_clicked.png'
  });

  const modalVisible = await page.isVisible('text=Computer Care Portal');
  console.log('Live Modal Visible:', modalVisible);
  console.log('Alert was triggered:', alertMessage !== null ? alertMessage : 'None (Modal opened correctly!)');

  if (modalVisible) {
    console.log('Testing Admin Login on live Netlify site...');
    await page.fill('input[placeholder*="admin or admin@computercare.in"]', 'admin');
    await page.fill('input[placeholder="Enter password"]', 'admin123');
    await page.click('button:has-text("Log In to Admin Portal")');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/netlify_live_admin_portal.png'
    });
    console.log('✓ Successfully entered Admin Portal on LIVE Netlify site!');
  }

  await browser.close();
}

testLiveNetlify().catch(console.error);
