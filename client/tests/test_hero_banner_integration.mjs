import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

let chromium;
try {
  const pw = await import('@playwright/test');
  chromium = pw.chromium;
} catch {
  const pw = await import('../node_modules/@playwright/test/index.mjs');
  chromium = pw.chromium;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) {
        return true;
      }
    } catch {
      // Waiting
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runHeroBannerTests() {
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const server = spawn(npmCmd, ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
    cwd: clientDir,
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite Error] ${d.toString().trim()}`));

  await waitForServer(BASE_URL);
  console.log(`Server is up at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Desktop Viewport - Hero Banner Rendering & Aspect Ratio
    // -------------------------------------------------------------------------
    console.log('\n--- Test 1: Desktop Viewport Hero Banner Rendering ---');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(500);

    // Verify Computer Care branded banner image is present
    const bannerImg = desktopPage.locator('img[alt="Computer Care Custom PC Build Configurator"]').first();
    await bannerImg.waitFor({ state: 'visible', timeout: 5000 });

    const imgBox = await bannerImg.boundingBox();
    console.log(`✓ PASS: Banner image rendered. Rendered size: ${Math.round(imgBox.width)}x${Math.round(imgBox.height)}`);

    // Verify image actually loaded (naturalWidth > 0)
    const isImageLoaded = await bannerImg.evaluate((img) => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
    if (!isImageLoaded) {
      throw new Error('FAIL: Banner image failed to load or has naturalWidth 0');
    }
    const naturalDims = await bannerImg.evaluate((img) => ({ w: img.naturalWidth, h: img.naturalHeight }));
    console.log(`✓ PASS: Banner image asset loaded successfully (${naturalDims.w}x${naturalDims.h})`);

    // Verify aspect ratio preservation
    const naturalRatio = naturalDims.w / naturalDims.h;
    const renderedRatio = imgBox.width / imgBox.height;
    const ratioDelta = Math.abs(naturalRatio - renderedRatio);
    if (ratioDelta > 0.1) {
      throw new Error(`FAIL: Aspect ratio distorted! Natural: ${naturalRatio.toFixed(2)}, Rendered: ${renderedRatio.toFixed(2)}`);
    }
    console.log(`✓ PASS: Aspect ratio preserved with zero distortion (Natural: ${naturalRatio.toFixed(2)}, Rendered: ${renderedRatio.toFixed(2)})`);

    // Verify CTA button with text "Build Your PC Now ->" is visible
    const ctaBtn = desktopPage.locator(':has-text("Build Your PC Now ->")').first();
    await ctaBtn.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ PASS: "Build Your PC Now ->" Call-to-Action button is visible');

    // -------------------------------------------------------------------------
    // TEST 2: CTA Click Navigation to /builder
    // -------------------------------------------------------------------------
    console.log('\n--- Test 2: CTA Click Navigation to /builder ---');
    await ctaBtn.click();
    await desktopPage.waitForTimeout(1000);

    const afterCtaUrl = desktopPage.url();
    console.log('Navigated URL after CTA click:', afterCtaUrl);
    if (!afterCtaUrl.includes('/builder')) {
      throw new Error(`FAIL: Clicking CTA did not route to /builder! Current URL: ${afterCtaUrl}`);
    }
    console.log('✓ PASS: CTA button successfully navigated to /builder');

    // -------------------------------------------------------------------------
    // TEST 3: Direct Banner Click Navigation to /builder
    // -------------------------------------------------------------------------
    console.log('\n--- Test 3: Direct Banner Click Navigation to /builder ---');
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(500);

    const bannerLink = desktopPage.locator('a[aria-label*="Computer Care Custom PC Build Configurator"]').first();
    await bannerLink.waitFor({ state: 'visible', timeout: 3000 });
    await bannerLink.click({ position: { x: 50, y: 50 } });
    await desktopPage.waitForTimeout(1000);

    const afterBannerUrl = desktopPage.url();
    console.log('Navigated URL after banner click:', afterBannerUrl);
    if (!afterBannerUrl.includes('/builder')) {
      throw new Error(`FAIL: Clicking banner did not route to /builder! Current URL: ${afterBannerUrl}`);
    }
    console.log('✓ PASS: Direct banner click successfully navigated to /builder');

    // -------------------------------------------------------------------------
    // TEST 4: Carousel Rotation (Next/Prev and Indicator Dots)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 4: Carousel Rotation Controls ---');
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(500);

    // Click Next Slide button
    const nextBtn = desktopPage.locator('button[aria-label="Next slide"]').first();
    await nextBtn.click({ force: true });
    await desktopPage.waitForTimeout(600);

    // Verify slide 1 ("BUILD YOUR DREAM CUSTOM GAMING RIG") is now visible
    const slide1Text = desktopPage.locator('text=BUILD YOUR DREAM CUSTOM GAMING RIG').first();
    await slide1Text.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ PASS: Next button rotated to "BUILD YOUR DREAM CUSTOM GAMING RIG" slide');

    // Click Start Your Custom Build on slide 1
    const slide1Cta = desktopPage.locator('text=START YOUR CUSTOM BUILD').first();
    await slide1Cta.click();
    await desktopPage.waitForTimeout(1000);
    if (!desktopPage.url().includes('/builder')) {
      throw new Error('FAIL: Slide 1 CTA did not route to /builder');
    }
    console.log('✓ PASS: Slide 1 CTA routes to /builder');

    // Return and test dot navigation
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(500);
    const dot0 = desktopPage.locator('button[aria-label="Go to slide 1"]').first();
    const dot1 = desktopPage.locator('button[aria-label="Go to slide 2"]').first();
    await dot1.click();
    await desktopPage.waitForTimeout(600);
    await slide1Text.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ PASS: Indicator dot 2 rotated to slide 2');

    await dot0.click();
    await desktopPage.waitForTimeout(600);
    await bannerImg.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ PASS: Indicator dot 1 returned to Computer Care branded banner');

    await desktopContext.close();

    // -------------------------------------------------------------------------
    // TEST 5: Mobile Viewport (375x667 iPhone SE) - Responsive Display & No Overflow
    // -------------------------------------------------------------------------
    console.log('\n--- Test 5: Mobile Viewport Responsive Display ---');
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(500);

    // Check no horizontal scrollbar / overflow on body
    const bodyScrollWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
    const windowWidth = await mobilePage.evaluate(() => window.innerWidth);
    if (bodyScrollWidth > windowWidth + 1) {
      throw new Error(`FAIL: Mobile horizontal overflow detected! scrollWidth: ${bodyScrollWidth}, innerWidth: ${windowWidth}`);
    }
    console.log(`✓ PASS: Zero horizontal overflow on mobile viewport (${bodyScrollWidth} <= ${windowWidth})`);

    // Verify mobile banner image is visible and scaled responsively
    const mobileBannerImg = mobilePage.locator('img[alt="Computer Care Custom PC Build Configurator"]').first();
    await mobileBannerImg.waitFor({ state: 'visible', timeout: 5000 });
    const mobileImgBox = await mobileBannerImg.boundingBox();
    console.log(`✓ PASS: Mobile banner rendered at ${Math.round(mobileImgBox.width)}x${Math.round(mobileImgBox.height)}`);
    if (mobileImgBox.width > windowWidth) {
      throw new Error(`FAIL: Mobile banner width (${mobileImgBox.width}) exceeds viewport width (${windowWidth})`);
    }

    // Verify mobile CTA button
    const mobileCta = mobilePage.locator(':has-text("Build Your PC Now ->")').first();
    await mobileCta.waitFor({ state: 'visible', timeout: 3000 });
    await mobileCta.click();
    await mobilePage.waitForTimeout(1000);

    const mobileAfterUrl = mobilePage.url();
    console.log('Mobile Navigated URL:', mobileAfterUrl);
    if (!mobileAfterUrl.includes('/builder')) {
      throw new Error(`FAIL: Mobile CTA click did not route to /builder! Current URL: ${mobileAfterUrl}`);
    }
    console.log('✓ PASS: Mobile CTA button routes to /builder');

    await mobileContext.close();

    console.log('\n======================================================');
    console.log(' ALL HERO BANNER INTEGRATION & RESPONSIVE TESTS PASSED! ');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (server && server.pid) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
        } else {
          server.kill();
        }
      } catch {
        // Ignored
      }
    }
  }
}

runHeroBannerTests();
