import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle' });

  const isPasswordVisible = await page.isVisible('input[type="password"]');
  if (isPasswordVisible) {
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Authenticate")');
    await page.waitForTimeout(1000);
  }

  const mainText = await page.innerText('main');
  console.log('MAIN TEXT:');
  console.log(mainText.slice(0, 500));

  await page.screenshot({
    path: 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/admin_portal_authenticated.png'
  });

  await browser.close();
}

check().catch(console.error);
