import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function verifyCabinets() {
  console.log('=== VERIFYING PC CABINETS IN COMPUTER CARE ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Page loaded:', await page.title());

  // Wait for loading spinner to detach if products are loading
  try {
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 });
    console.log('Products successfully loaded into store.');
  } catch {
    console.log('No spinner or already done.');
  }
  await page.waitForTimeout(1000);

  // 1. Navigate to Catalog view
  console.log('\n--- 1. Testing Catalog View for PC Cabinets ---');
  const catalogNavBtn = await page.waitForSelector('button:has-text("Component Store")');
  await catalogNavBtn.click();
  await page.waitForTimeout(1000);

  // Click on "PC Cabinets" category filter
  const caseCategoryBtn = await page.waitForSelector('button:has-text("PC Cabinets")');
  await caseCategoryBtn.click();
  await page.waitForTimeout(1000);

  // Check product count in header
  const resultsHeader = await page.textContent('h1');
  console.log('Catalog Header:', resultsHeader?.trim());

  // Check cabinet style pill buttons
  const pills = await page.$$eval('button', btns => 
    btns.map(b => b.textContent?.trim()).filter(t => 
      t && (t.includes('Panoramic') || t.includes('High-Airflow') || t.includes('Full Tower') || t.includes('Micro-ATX') || t.includes('White') || t.includes('Black'))
    )
  );
  console.log('Cabinet style filter pills found:', pills);

  // Read first 6 product titles in catalog
  const productTitles = await page.$$eval('h3', headings => headings.slice(0, 10).map(h => h.textContent?.trim()));
  console.log('Top cabinet titles in catalog:');
  productTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

  // Check for forbidden terms (cooling fans)
  const fanMatches = productTitles.filter(t => t.toLowerCase().includes('case fan') || t.toLowerCase().includes('cooling fan') || t.toLowerCase().includes('fan pack'));
  if (fanMatches.length === 0) {
    console.log('✓ PASS: Zero cooling fans found in PC Cabinets catalog!');
  } else {
    console.error('❌ FAIL: Found fans in cabinets:', fanMatches);
  }

  // Take screenshot of PC Cabinets in Catalog
  const catalogCasesShot = path.join(clientDir, 'computercare-catalog-cabinets.png');
  await page.screenshot({ path: catalogCasesShot });
  console.log(`✓ Saved Catalog Cabinets screenshot to ${catalogCasesShot}`);

  // Test Panoramic filter
  console.log('\n--- 2. Testing Panoramic Dual-Chamber Filter ---');
  const panoramicPill = await page.$('button:has-text("Panoramic Dual-Chamber")');
  if (panoramicPill) {
    await panoramicPill.click();
    await page.waitForTimeout(800);
    const panoramicTitles = await page.$$eval('h3', headings => headings.slice(0, 5).map(h => h.textContent?.trim()));
    console.log('Panoramic cabinets:');
    panoramicTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  }

  // 3. Navigate to Builder View
  console.log('\n--- 3. Testing 3D Builder & Cabinet Selection Modal ---');
  await page.click('button:has-text("CUSTOM 3D PC BUILDER")');
  await page.waitForTimeout(1000);

  // Click on "Change" button for PC Cabinet slot
  // Find slot card for Cabinet
  const caseSlotChangeBtn = await page.$('button:has-text("Change Case")') || 
                            await page.$('div:has-text("PC Cabinet") button:has-text("Change")') ||
                            await page.$('div:has-text("PC Cabinet") button:has-text("Select")');

  if (caseSlotChangeBtn) {
    console.log('Clicking Case slot change button...');
    await caseSlotChangeBtn.click();
  } else {
    // Click any "Change" button inside the Cabinet slot card
    const allChangeBtns = await page.$$('button:has-text("Change")');
    if (allChangeBtns.length > 0) {
      await allChangeBtns[allChangeBtns.length - 1].click(); // Case is usually towards the end
    }
  }
  await page.waitForTimeout(1000);

  // Check modal title
  const modalTitle = await page.textContent('h2');
  console.log('Modal title:', modalTitle?.trim());

  // Check modal style filter pills
  const modalPills = await page.$$eval('button', btns => 
    btns.map(b => b.textContent?.trim()).filter(t => 
      t && (t.includes('Panoramic') || t.includes('High-Airflow') || t.includes('Full Tower') || t.includes('White Edition'))
    )
  );
  console.log('Modal Cabinet filter pills found:', modalPills);

  // Take screenshot of Cabinet Selection Modal
  const modalShot = path.join(clientDir, 'computercare-modal-cabinets.png');
  await page.screenshot({ path: modalShot });
  console.log(`✓ Saved Cabinet Modal screenshot to ${modalShot}`);

  // Select a cabinet from modal
  console.log('Selecting a cabinet from the modal...');
  // Find "Select" buttons inside the modal
  const selectBtns = await page.$$('div.fixed button:has-text("Select")');
  console.log(`Found ${selectBtns.length} select buttons inside modal.`);
  if (selectBtns.length > 0) {
    // Select the first non-selected cabinet
    await selectBtns[0].click();
    console.log('Selected cabinet from modal.');
    await page.waitForTimeout(1000);
  } else {
    // Alternatively close modal
    const closeBtn = await page.$('div.fixed button:has(svg)');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(600);
  }

  // Test 3D interaction controls
  console.log('\n--- 4. Testing 3D Cabinet Viewer Interactions ---');
  const openGlassBtn = await page.$('button:has-text("Open Glass")') || await page.$('button:has-text("Open Panel")');
  if (openGlassBtn) {
    console.log('Clicking Open Glass button...');
    await openGlassBtn.click();
    await page.waitForTimeout(800);
  }

  // Cycle RGB mode
  const rgbBtn = await page.$('button:has-text("RGB:")');
  if (rgbBtn) {
    console.log('Toggling RGB lighting...');
    await rgbBtn.click();
    await page.waitForTimeout(500);
    await rgbBtn.click();
    await page.waitForTimeout(500);
  }

  // Take screenshot of 3D Builder with selected cabinet
  const builderSelectedShot = path.join(clientDir, 'computercare-builder-selected-case.png');
  await page.screenshot({ path: builderSelectedShot });
  console.log(`✓ Saved Builder with selected cabinet screenshot to ${builderSelectedShot}`);

  console.log('\n--- 5. Runtime Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero runtime console errors!');
  } else {
    console.warn(`⚠️ Console errors logged:`, consoleErrors);
  }

  await browser.close();
  console.log('=== VERIFICATION COMPLETE ===');
}

verifyCabinets().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
