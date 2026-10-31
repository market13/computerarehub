import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const consoleMsgs = [];
  page.on('console', m => consoleMsgs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  
  console.log('Console messages:', consoleMsgs);
  
  const buttons = await page.$$eval('button', els => els.map(e => e.textContent?.trim() || '').filter(Boolean));
  console.log('All buttons found (' + buttons.length + '):');
  buttons.forEach((b, i) => console.log(`  ${i}: ${b}`));

  await browser.close();
}

main().catch(console.error);
