import { chromium } from '@playwright/test';
import path from 'path';

const artifactDir = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1d61eb77-5216-484b-b8c2-03bbdb30fcba';

async function testBulkOrderFlow() {
  console.log('=== VERIFYING BULK ORDER SIDE LABEL & B2B PAGE ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // 1. Verify Floating Side Badge
  console.log('\n--- 1. Testing Floating Side Label ---');
  const sideBadge = await page.$('aside[aria-label="Bulk Order & B2B Inquiries"] button');
  if (!sideBadge) throw new Error('Floating side label "Bulk Order" not found in DOM!');
  
  const sideBadgeBox = await sideBadge.boundingBox();
  console.log('Floating Side Badge Position:', sideBadgeBox);
  if (!sideBadgeBox || sideBadgeBox.width === 0) {
    throw new Error('Side badge is not visible on screen!');
  }
  console.log('✓ Floating side label is present and visible on the side of the screen.');

  // Screenshot showing the side label on home page
  const sideBadgeShot = path.join(artifactDir, 'computercare-bulk-order-side-badge.png');
  await page.screenshot({ path: sideBadgeShot });
  console.log(`✓ Saved home page with side label screenshot: ${sideBadgeShot}`);

  // 2. Click Side Label to Navigate to Bulk Order Page
  console.log('\n--- 2. Clicking Bulk Order Side Label ---');
  await sideBadge.click();
  await page.waitForTimeout(1000);

  // Verify Bulk Order Page elements
  const pageHeading = await page.$eval('h1', el => el.textContent);
  console.log('Page H1 text:', pageHeading);
  if (!pageHeading.includes('Order Computers') && !pageHeading.includes('Bulk')) {
    throw new Error('Page heading does not match Bulk Order page!');
  }

  const formExists = await page.$('form');
  if (!formExists) throw new Error('Bulk Order Form not found on page!');
  console.log('✓ Bulk Order Page rendered with form successfully.');

  const pageShot = path.join(artifactDir, 'computercare-bulk-order-page.png');
  await page.screenshot({ path: pageShot });
  console.log(`✓ Saved Bulk Order Page screenshot: ${pageShot}`);

  // 3. Test Form Validation (Submit Empty)
  console.log('\n--- 3. Testing Form Validation ---');
  const submitBtn = await page.$('form button:has-text("Submit Bulk Order Request")');
  if (!submitBtn) throw new Error('Form submit button not found!');
  await submitBtn.click();
  await page.waitForTimeout(500);

  const errorMessages = await page.$$eval('.text-rose-500', els => els.map(e => e.textContent.trim()));
  console.log('Validation errors triggered:', errorMessages);
  if (errorMessages.length < 3) {
    throw new Error('Validation failed to catch empty required fields!');
  }
  console.log('✓ Form validation successfully prevented invalid submission.');

  // 4. Fill Form With Authentic Inquiry Details & Short Note
  console.log('\n--- 4. Filling Form with Details & Requirement Note ---');
  await page.fill('input[placeholder="e.g. Ramesh Sharma"]', 'Rohan Varma');
  await page.fill('input[placeholder="e.g. Apex Visuals Pvt Ltd / Self"]', 'Apex Visuals Studio');
  await page.fill('input[placeholder="ramesh@company.com"]', 'rohan@apexvisuals.in');
  await page.fill('input[placeholder="+91 9876543210"]', '9820123456');
  await page.fill('input[placeholder="e.g. Mumbai, Maharashtra"]', 'Bengaluru, Karnataka');
  await page.fill('input[placeholder="e.g. 27AAAAA0000A1Z5"]', '29AABCA1234F1Z5');

  // Select a category chip (Workstations)
  await page.click('button:has-text("3D Animation & Rendering Workstations")');

  // Fill the short note
  const noteText = 'We need 12 high-end 3D rendering workstations equipped with AMD Ryzen 9 9950X, 64GB DDR5, and RTX 4080 Super for Blender and Maya workflows. Required within 15 days to Bengaluru studio with GST B2B invoice.';
  await page.fill('textarea', noteText);

  // 5. Submit Form
  console.log('\n--- 5. Submitting Form ---');
  await submitBtn.click();
  await page.waitForTimeout(1500);

  // Verify Success Card
  const successTitle = await page.$eval('h3', el => el.textContent);
  console.log('Confirmation title:', successTitle);
  if (!successTitle.includes('Inquiry Received Successfully')) {
    throw new Error('Success confirmation was not displayed!');
  }

  const refNumber = await page.$eval('.font-mono.text-emerald-800', el => el.textContent);
  console.log('Generated Reference ID:', refNumber);
  if (!refNumber.startsWith('CC-B2B-')) {
    throw new Error('Inquiry reference ID format is invalid!');
  }
  console.log(`✓ Confirmed receipt with Reference ID: ${refNumber}`);

  const successShot = path.join(artifactDir, 'computercare-bulk-order-success.png');
  await page.screenshot({ path: successShot });
  console.log(`✓ Saved Bulk Order Success screenshot: ${successShot}`);

  console.log('\n--- Console Errors Check ---');
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors);
  } else {
    console.log('✓ Zero console errors detected.');
  }

  await browser.close();
  console.log('\n=== ALL BULK ORDER TESTS PASSED SUCCESSFULLY! ===');
}

testBulkOrderFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
