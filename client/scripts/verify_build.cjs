const fs = require('fs');
const path = require('path');

const clientDist = path.resolve(__dirname, '../dist');
const DOMAIN = 'https://computercaregzb.com';

console.log('--- Running Post-Build Verification Check (verify_build.cjs) ---');

if (!fs.existsSync(clientDist)) {
  console.error(`❌ FAIL: Build directory does not exist: ${clientDist}`);
  process.exit(1);
}

let hasErrors = false;

// 1. Discover all HTML files recursively in dist/
function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = findHtmlFiles(clientDist);
console.log(`Auditing ${htmlFiles.length} generated HTML files in ${clientDist}...`);

htmlFiles.forEach(file => {
  const relPath = path.relative(clientDist, file);
  const html = fs.readFileSync(file, 'utf8');

  // Check A: No computercare.in domain references
  if (/computercare\.in/i.test(html)) {
    console.error(`❌ FAIL [${relPath}]: Contains banned legacy domain reference "computercare.in"`);
    hasErrors = true;
  }

  // Check B: Exactly one <h1> tag
  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  if (h1Matches.length !== 1) {
    console.error(`❌ FAIL [${relPath}]: Expected exactly 1 <h1> tag, found ${h1Matches.length}`);
    hasErrors = true;
  }

  // Check C: Canonical link must start with https://computercaregzb.com
  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                         html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (!canonicalMatch) {
    console.error(`❌ FAIL [${relPath}]: Missing <link rel="canonical"> tag`);
    hasErrors = true;
  } else {
    const canonicalHref = canonicalMatch[1];
    if (!canonicalHref.startsWith(DOMAIN)) {
      console.error(`❌ FAIL [${relPath}]: Canonical URL "${canonicalHref}" does not start with "${DOMAIN}"`);
      hasErrors = true;
    }
  }
});

// 2. Verify sitemap.xml exists and matches prerendered files
const sitemapPath = path.join(clientDist, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ FAIL: sitemap.xml is missing from dist directory');
  hasErrors = true;
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

  if (locMatches.length === 0) {
    console.error('❌ FAIL: sitemap.xml contains 0 URLs');
    hasErrors = true;
  } else {
    console.log(`Auditing ${locMatches.length} URLs listed in sitemap.xml...`);
    locMatches.forEach(url => {
      if (!url.startsWith(DOMAIN)) {
        console.error(`❌ FAIL [sitemap.xml]: URL "${url}" does not start with "${DOMAIN}"`);
        hasErrors = true;
        return;
      }

      // Convert URL to expected local file path
      const urlPath = url.replace(DOMAIN, '').replace(/\/$/, '') || '';
      let expectedFile;
      if (!urlPath) {
        expectedFile = path.join(clientDist, 'index.html');
      } else {
        expectedFile = path.join(clientDist, urlPath, 'index.html');
        if (!fs.existsSync(expectedFile)) {
          expectedFile = path.join(clientDist, `${urlPath}.html`);
        }
      }

      if (!fs.existsSync(expectedFile)) {
        console.error(`❌ FAIL [sitemap.xml]: Listed URL "${url}" has no matching prerendered file at "${path.relative(clientDist, expectedFile)}"`);
        hasErrors = true;
      }
    });
  }
}

// 3. Verify robots.txt references sitemap.xml and disallows /admin
const robotsPath = path.join(clientDist, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ FAIL: robots.txt is missing from dist directory');
  hasErrors = true;
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const expectedSitemapRef = `Sitemap: ${DOMAIN}/sitemap.xml`;
  if (!robotsContent.includes(expectedSitemapRef)) {
    console.error(`❌ FAIL [robots.txt]: Does not reference "${expectedSitemapRef}"`);
    hasErrors = true;
  }
  if (!robotsContent.includes('Disallow: /admin')) {
    console.error('❌ FAIL [robots.txt]: Missing "Disallow: /admin" rule');
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n💥 Post-build verification failed with errors. Aborting build.');
  process.exit(1);
} else {
  console.log('✅ Post-build verification PASSED! Zero computercare.in references, all single <h1>s, valid canonicals, and 100% sitemap matches.');
}
