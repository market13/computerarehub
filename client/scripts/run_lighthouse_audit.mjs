import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const port = 4173;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Server error');
  }
});

const isDesktop = process.argv.includes('--desktop');

server.listen(port, '127.0.0.1', () => {
  console.log(`Local audit server running at http://127.0.0.1:${port}`);

  const reportFile = isDesktop ? 'lighthouse-desktop.json' : 'lighthouse-report.json';
  const reportPath = path.join(distDir, reportFile);
  const flags = isDesktop 
    ? `--preset=desktop --chrome-flags="--headless"` 
    : `--chrome-flags="--headless" --form-factor=mobile --screenEmulation.mobile=true`;
  const cmd = `npx lighthouse http://127.0.0.1:${port} --output=json --output-path="${reportPath}" ${flags} --only-categories=performance,accessibility,best-practices,seo --quiet`;

  console.log(`Running ${isDesktop ? 'desktop' : 'mobile'} Lighthouse audit (this may take 20-30 seconds)...`);
  exec(cmd, { maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
    server.close();

    if (err && !fs.existsSync(reportPath)) {
      console.error('Lighthouse execution error:', err.message);
      if (stderr) console.error(stderr);
      process.exit(1);
    }

    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const categories = report.categories;

      const perf = Math.round((categories.performance?.score || 0) * 100);
      const a11y = Math.round((categories.accessibility?.score || 0) * 100);
      const bp = Math.round((categories['best-practices']?.score || 0) * 100);
      const seo = Math.round((categories.seo?.score || 0) * 100);

      console.log(`\n=== LIGHTHOUSE ${isDesktop ? 'DESKTOP' : 'MOBILE'} AUDIT RESULTS ===`);
      console.log(`⚡ Performance:    ${perf}/100`);
      console.log(`♿ Accessibility:  ${a11y}/100`);
      console.log(`🛡️ Best Practices: ${bp}/100`);
      console.log(`🔍 SEO:            ${seo}/100`);

      const audits = report.audits;
      console.log(`\n--- Core Web Vitals (${isDesktop ? 'Desktop' : 'Simulated Mobile'}) ---`);
      console.log(`FCP (First Contentful Paint): ${audits['first-contentful-paint']?.displayValue || 'N/A'}`);
      console.log(`LCP (Largest Contentful Paint): ${audits['largest-contentful-paint']?.displayValue || 'N/A'}`);
      console.log(`TBT (Total Blocking Time): ${audits['total-blocking-time']?.displayValue || 'N/A'}`);
      console.log(`CLS (Cumulative Layout Shift): ${audits['cumulative-layout-shift']?.displayValue || 'N/A'}`);
      console.log(`Speed Index: ${audits['speed-index']?.displayValue || 'N/A'}`);

      if (perf >= 90 && a11y >= 90 && bp >= 90 && seo >= 90) {
        console.log('\n🎉 ALL LIGHTHOUSE SCORES EXCEED 90+ TARGET!');
      } else {
        console.log('\nAudit items for review:');
        Object.entries(categories).forEach(([key, val]) => {
          const s = Math.round((val.score || 0) * 100);
          if (s < 90) {
            console.log(`- ${val.title}: ${s}/100 (below 90)`);
          }
        });
      }
    } catch (parseErr) {
      console.error('Failed to parse report:', parseErr.message);
      process.exit(1);
    }
  });
});
