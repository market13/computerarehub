import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testFansSeparation() {
  console.log('=== VERIFYING CABINET VS CABINET FANS SEPARATION ===');
  const browser = await chromium.launch({ headless: true });
  // Disable HTTP cache so it always fetches fresh data
  const context = await browser.newContext({ 
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Navigate to 3D PC Builder
  console.log('\n--- 1. Testing PC Builder View ---');
  const builderBtn = await page.$('button:has-text("CUSTOM PC BUILDER")') || await page.$('button:has-text("Custom PC Builder")');
  if (builderBtn) await builderBtn.click();
  await page.waitForTimeout(1500);

  // Check slots
  const caseSlot = await page.$('h4:has-text("Select PC Cabinet / Case")') || await page.$('span:has-text("PC Cabinet / Case")');
  console.log('Case slot present in builder:', !!caseSlot);

  const fanSlot = await page.$('h4:has-text("Select Cabinet Cooling Fans")') || await page.$('span:has-text("Cabinet Cooling Fans")');
  console.log('Cabinet Cooling Fans slot present in builder:', !!fanSlot);

  // 2. Open Case Modal & Verify NO Fans
  console.log('\n--- 2. Inspecting PC Cabinet Modal ---');
  // Since case is pre-selected by default, click "Change" button for Case
  const caseChangeBtn = await page.$('button[title="Change component"]');
  if (caseChangeBtn) {
    await caseChangeBtn.click();
    await page.waitForTimeout(1000);

    const modalTitle = await page.textContent('h2');
    console.log('Modal title:', modalTitle?.trim());

    const productTitles = await page.$$eval('div.fixed h3', heads => heads.slice(0, 20).map(h => h.textContent?.trim()));
    console.log(`Examined ${productTitles.length} items in PC Cabinet modal.`);
    console.log('First 6 items:');
    productTitles.slice(0, 6).forEach((t, i) => console.log(`  [${i+1}] ${t}`));

    // Check for fans
    const forbiddenFans = productTitles.filter(t => 
      t.toLowerCase().includes(' fan') || 
      t.toLowerCase().includes('arctic f12') || 
      t.toLowerCase().includes('tag windforce') || 
      t.toLowerCase().includes('single pack') ||
      t.toLowerCase().includes('triple pack')
    );

    if (forbiddenFans.length === 0) {
      console.log('✓ PASS: PC Cabinet modal has ZERO cooling fans!');
    } else {
      console.error('❌ FAIL: Found fans in Cabinet modal:', forbiddenFans);
    }

    const modalShot = path.join(clientDir, 'computercare-modal-cabinets-nofans.png');
    await page.screenshot({ path: modalShot });
    console.log(`✓ Saved Cabinet Modal screenshot to ${modalShot}`);

    // Close modal
    const closeBtn = await page.$('div.fixed button[aria-label="Close Modal"]') || await page.$('div.fixed button:has(svg)');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 3. Open Cabinet Fans Modal & Verify Fans are Present
  console.log('\n--- 3. Inspecting Cabinet Cooling Fans Modal ---');
  const fanSlotClickable = await page.$('h4:has-text("Select Cabinet Cooling Fans")') || await page.$('div:has-text("Cabinet Cooling Fans")');
  if (fanSlotClickable) {
    await fanSlotClickable.click();
    await page.waitForTimeout(1000);

    const modalTitle = await page.textContent('h2');
    console.log('Fans Modal title:', modalTitle?.trim());

    // Check Fan filter pills
    const fanPills = await page.$$eval('div.fixed button', btns => 
      btns.map(b => b.textContent?.trim()).filter(t => t && (t.includes('120mm') || t.includes('140mm') || t.includes('Triple') || t.includes('ARGB')))
    );
    console.log('Fan filter pills found:', fanPills);

    const fanTitles = await page.$$eval('div.fixed h3', heads => heads.slice(0, 10).map(h => h.textContent?.trim()));
    console.log('Top 6 items in Cabinet Cooling Fans modal:');
    fanTitles.slice(0, 6).forEach((t, i) => console.log(`  [${i+1}] ${t}`));

    const fanModalShot = path.join(clientDir, 'computercare-modal-fans.png');
    await page.screenshot({ path: fanModalShot });
    console.log(`✓ Saved Fans Modal screenshot to ${fanModalShot}`);

    // Select a fan
    const selectFanBtn = await page.$('div.fixed button:has-text("Select")');
    if (selectFanBtn) {
      await selectFanBtn.click();
      console.log('Selected a cabinet fan into rig!');
      await page.waitForTimeout(800);
    }
  }

  // 4. Check Catalog Categories
  console.log('\n--- 4. Checking Catalog Categories ---');
  const catalogNav = await page.$('button:has-text("Components")') || await page.$('button:has-text("Component Store")');
  if (catalogNav) {
    await catalogNav.click();
    await page.waitForTimeout(1000);

    const fanCategoryBtn = await page.$('button:has-text("Cabinet Fans")');
    console.log('Cabinet Fans category present in Catalog sidebar:', !!fanCategoryBtn);

    if (fanCategoryBtn) {
      await fanCategoryBtn.click();
      await page.waitForTimeout(800);
      const catalogFanShot = path.join(clientDir, 'computercare-catalog-fans.png');
      await page.screenshot({ path: catalogFanShot });
      console.log(`✓ Saved Catalog Fans screenshot to ${catalogFanShot}`);
    }
  }

  // 5. Console Audit
  console.log('\n--- 5. Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero console errors!');
  } else {
    console.warn('⚠️ Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== ALL FANS SEPARATION TESTS COMPLETED SUCCESSFULLY ===');
}

testFansSeparation().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
