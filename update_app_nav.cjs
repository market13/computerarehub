const fs = require('fs');

const appPath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

const targetRegex = /const handleNavigate = \(dest\) => \{[\s\S]*?setActiveTab\(dest\);\s*\}\s*\};/;

const replacement = `const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const applyNav = () => {
      if (dest === 'admin') {
        window.location.hash = 'admin';
        setActiveTab('admin');
      } else if (dest === 'builder') {
        window.location.hash = 'builder';
        setActiveTab('builder');
      } else if (dest === 'bulk-order') {
        window.location.hash = 'bulk-order';
        setActiveTab('bulk-order');
      } else if (dest === 'catalog') {
        setSelectedCatalogCategory('all');
        window.location.hash = 'catalog';
        setActiveTab('catalog');
      } else if (dest === 'presets') {
        setIsPresetsOpen(true);
      } else if (dest.startsWith('catalog-')) {
        const cat = dest.replace('catalog-', '');
        setSelectedCatalogCategory(cat);
        window.location.hash = 'catalog';
        setActiveTab('catalog');
      } else {
        window.location.hash = dest === 'home' ? '' : dest;
        setActiveTab(dest);
      }
    };

    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        applyNav();
      });
    } else {
      applyNav();
    }
  };`;

if (targetRegex.test(app)) {
  app = app.replace(targetRegex, replacement);
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('✓ Successfully updated App.jsx handleNavigate with View Transitions API!');
} else {
  console.warn('✗ targetRegex did not match');
}
