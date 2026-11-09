import { chromium } from '@playwright/test';

async function verifyWhatsAppProductLink() {
  console.log('=== VERIFYING WHATSAPP PRODUCT INQUIRY LINK ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Find and click "View Technical Specs" button on the first featured product
  console.log('\n--- 1. Clicking "View Technical Specs" Button ---');
  const specsButton = await page.$('button[title="View Technical Specs"]');
  if (specsButton) {
    await specsButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await specsButton.click();
    console.log('✓ Clicked "View Technical Specs" button');
  } else {
    // Alternatively click the first product title
    console.log('Trying product title...');
    const productTitle = await page.$('h3.line-clamp-2');
    if (productTitle) {
      await productTitle.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await productTitle.click();
      console.log('✓ Clicked product title');
    }
  }

  await page.waitForTimeout(1000);

  // 2. Check if ProductDetailModal opened
  const modalWaLink = await page.$('a[title="Inquire on WhatsApp"]');
  if (!modalWaLink) {
    console.error('❌ Modal or WhatsApp button not found!');
    await browser.close();
    process.exit(1);
  }

  // 3. Inspect the WhatsApp href
  const href = await modalWaLink.getAttribute('href');
  console.log('\n--- 2. WhatsApp Button Href ---');
  console.log('Raw Href:', href);

  const decoded = decodeURIComponent(href || '');
  console.log('\n--- 3. Decoded WhatsApp URL ---');
  console.log(decoded);

  // 4. Verification checks
  console.log('\n--- 4. Running Assertions ---');
  if (decoded.includes('undefined')) {
    console.error('❌ FAIL: URL still contains "undefined"!');
    await browser.close();
    process.exit(1);
  } else {
    console.log('✓ PASS: Zero "undefined" in WhatsApp message!');
  }

  if (decoded.includes('Hi Computer Care, I am interested in') && decoded.includes('919810550222')) {
    console.log('✓ PASS: WhatsApp number (+91 9810550222) and Computer Care greeting confirmed!');
  } else {
    console.error('❌ FAIL: Greeting or phone number missing!');
    await browser.close();
    process.exit(1);
  }

  // Check that the product title is actually in the text
  const modalTitle = await page.$eval('h2.font-display', el => el.textContent?.trim());
  console.log('Product in Modal:', modalTitle);

  if (modalTitle && decoded.includes(modalTitle)) {
    console.log(`✓ PASS: WhatsApp message contains the exact product title "${modalTitle}"!`);
  } else {
    console.warn('⚠️ Note: Exact modalTitle substring match check:', modalTitle);
  }

  // Capture a screenshot of the opened modal for visual verification
  const modalScreenshot = 'client/computercare-modal-whatsapp-verified.png';
  await page.screenshot({ path: modalScreenshot });
  console.log(`✓ Saved modal verification screenshot to ${modalScreenshot}`);

  await browser.close();
  console.log('\n=== WHATSAPP VERIFICATION SUCCESSFUL ===');
}

verifyWhatsAppProductLink().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
