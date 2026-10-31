import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');

async function testSpecialities() {
  console.log('=== VERIFYING "OUR SPECIALITIES" SECTION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Verify Heading
  console.log('\n--- 1. Checking Heading ---');
  const heading = await page.textContent('h2:has-text("OUR SPECIALITIES")');
  console.log('Heading found:', heading?.trim());

  // 2. Check 6 cards
  console.log('\n--- 2. Checking 6 Speciality Cards ---');
  const expectedTitles = [
    'GAMING PC',
    'RENDERING PC',
    'STREAMING PC',
    'EDITING PC',
    'GAME DEV PC',
    'AI & ML PC'
  ];

  for (const title of expectedTitles) {
    const cardTitle = await page.textContent(`h3:has-text("${title}")`);
    console.log(`✓ Card "${title}" found:`, !!cardTitle);
  }

  // 3. Check Image sources
  console.log('\n--- 3. Checking Images ---');
  const images = await page.$$eval('section:has-text("OUR SPECIALITIES") img', imgs => imgs.map(i => i.src));
  console.log('Images found in section:', images.length);
  images.forEach((src, idx) => console.log(`  [${idx + 1}] ${src}`));

  // 4. Scroll to section and capture screenshot
  console.log('\n--- 4. Taking Screenshot ---');
  const section = await page.$('section:has-text("OUR SPECIALITIES")');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const shotPath = path.join(clientDir, 'computercare-specialities-preview.png');
    await section.screenshot({ path: shotPath });
    console.log(`✓ Saved Specialities screenshot to ${shotPath}`);
  }

  // Also capture full home screenshot
  const fullHomeShot = path.join(clientDir, 'computercare-home.png');
  await page.screenshot({ path: fullHomeShot });
  console.log(`✓ Updated Home screenshot to ${fullHomeShot}`);

  // 5. Test Card Click Interaction
  console.log('\n--- 5. Testing Card Click Interaction ---');
  const firstCard = await page.$('div:has-text("GAMING PC")');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(1000);
    const canvas = await page.$('canvas');
    console.log('Clicked GAMING PC -> 3D Builder Canvas active:', !!canvas);
  }

  // 6. Mobile Layout Check
  console.log('\n--- 6. Mobile Layout Check (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  const mobileShot = path.join(clientDir, 'computercare-mobile.png');
  await mobilePage.screenshot({ path: mobileShot });
  console.log(`✓ Updated Mobile screenshot to ${mobileShot}`);

  // 7. Console Errors Check
  console.log('\n--- 7. Console Audit ---');
  if (consoleErrors.length === 0) {
    console.log('✓ PASS: Zero console errors!');
  } else {
    console.warn('⚠️ Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== VERIFICATION COMPLETE ===');
}

testSpecialities().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
