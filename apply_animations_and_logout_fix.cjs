const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/src';

// 1. Update Header.jsx with onLogout handler
const headerPath = path.join(srcDir, 'components', 'Header.jsx');
let header = fs.readFileSync(headerPath, 'utf8');

const oldModalRender = `<AdminLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAdminLogin={() => {
          setActiveTab('admin');
          window.location.hash = 'admin';
        }}
      />`;

const newModalRender = `<AdminLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAdminLogin={() => {
          setIsAdminActive(true);
          setActiveTab('admin');
          window.location.hash = 'admin';
        }}
        onLogout={() => {
          setIsAdminActive(false);
          if (activeTab === 'admin') {
            setActiveTab('home');
            window.location.hash = '';
          }
        }}
      />`;

if (header.includes(oldModalRender)) {
  header = header.replace(oldModalRender, newModalRender);
  fs.writeFileSync(headerPath, header, 'utf8');
  console.log('✓ Header.jsx updated with onLogout handler');
} else {
  console.log('Header.jsx modal already has onLogout or target differed');
}

// 2. Update AdminPortalView.jsx logout handler
const adminViewPath = path.join(srcDir, 'components', 'AdminPortalView.jsx');
let adminView = fs.readFileSync(adminViewPath, 'utf8');
const oldAdminLogout = `  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('computercare_admin_auth');
  };`;

const newAdminLogout = `  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('computercare_admin_auth');
    window.location.hash = '';
    onNavigate('home');
  };`;

if (adminView.includes(oldAdminLogout)) {
  adminView = adminView.replace(oldAdminLogout, newAdminLogout);
  fs.writeFileSync(adminViewPath, adminView, 'utf8');
  console.log('✓ AdminPortalView.jsx updated with onNavigate on logout');
}

// 3. Update App.jsx with View Transitions and animate-tab-enter
const appPath = path.join(srcDir, 'App.jsx');
let app = fs.readFileSync(appPath, 'utf8');

// Replace handleNavigate with View Transitions API
const navFunctionOld = `  const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (dest === 'admin') {
      window.location.hash = 'admin';
      setActiveTab('admin');
    } else if (dest === 'builder') {
      window.location.hash = 'builder';
      setActiveTab('builder');
    } else if (dest === 'bulk-order') {
      setActiveTab('bulk-order');
    } else if (dest === 'catalog') {
      setSelectedCatalogCategory('all');
      setActiveTab('catalog');
    } else if (dest === 'presets') {
      setIsPresetsOpen(true);
    } else if (dest.startsWith('catalog-')) {
      const cat = dest.replace('catalog-', '');
      setSelectedCatalogCategory(cat);
      setActiveTab('catalog');
    } else {
      setActiveTab(dest);
    }
  };`;

const navFunctionNew = `  const handleNavigate = (dest) => {
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

app = app.replace(/\r\n/g, '\n');
const normalizedNavOld = navFunctionOld.replace(/\r\n/g, '\n');
if (app.includes(normalizedNavOld)) {
  app = app.replace(normalizedNavOld, navFunctionNew);
  console.log('✓ App.jsx handleNavigate updated with View Transitions');
}

// Wrap main content with animate-tab-enter
const mainContentOld = `<main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-6">
        {loading ? (`;

const mainContentNew = `<main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-6">
        <div key={activeTab} className="animate-tab-enter w-full">
        {loading ? (`;

if (app.includes(mainContentOld) && !app.includes('<div key={activeTab} className="animate-tab-enter')) {
  app = app.replace(mainContentOld, mainContentNew);
  app = app.replace('</main>', '</div>\n      </main>');
  console.log('✓ App.jsx main content wrapped in animate-tab-enter');
}

fs.writeFileSync(appPath, app, 'utf8');

// 4. Update CatalogView.jsx
const catalogPath = path.join(srcDir, 'components', 'CatalogView.jsx');
let catalog = fs.readFileSync(catalogPath, 'utf8');

// Add animate-product-grid and key to products grid
const gridOld = '<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">';
const gridNew = '<div key={`${selectedCategory}-${selectedBrand}-${selectedCabinetKind}-${selectedFanKind}-${pageNumber}`} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 animate-product-grid">';

if (catalog.includes(gridOld)) {
  catalog = catalog.replace(gridOld, gridNew);
  console.log('✓ CatalogView.jsx product grid updated with animation key');
}

// Add product-card-hover
const cardOld = 'className="bg-white rounded-xl border border-brand-border hover:border-brand-blue hover:shadow-brand-hover p-2.5 sm:p-3.5 flex flex-col justify-between transition-all group"';
const cardNew = 'className="bg-white rounded-xl border border-brand-border hover:border-brand-blue p-2.5 sm:p-3.5 flex flex-col justify-between group product-card-hover"';

if (catalog.includes(cardOld)) {
  catalog = catalog.replace(cardOld, cardNew);
  console.log('✓ CatalogView.jsx product cards updated with product-card-hover');
}

// Add product-image-hover
const imgOld = 'className="w-full h-full object-contain group-hover:scale-105 transition-transform"';
const imgNew = 'className="w-full h-full object-contain product-image-hover"';
if (catalog.includes(imgOld)) {
  catalog = catalog.replaceAll(imgOld, imgNew);
  console.log('✓ CatalogView.jsx images updated with product-image-hover');
}

fs.writeFileSync(catalogPath, catalog, 'utf8');

// 5. Update ProductDetailModal.jsx with animate-modal-pop
const detailModalPath = path.join(srcDir, 'components', 'ProductDetailModal.jsx');
let detailModal = fs.readFileSync(detailModalPath, 'utf8');
const detailOld = 'className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-brand-border rounded-2xl flex flex-col overflow-hidden shadow-2xl"';
const detailNew = 'className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-brand-border rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-modal-pop"';

if (detailModal.includes(detailOld)) {
  detailModal = detailModal.replace(detailOld, detailNew);
  fs.writeFileSync(detailModalPath, detailModal, 'utf8');
  console.log('✓ ProductDetailModal.jsx updated with animate-modal-pop');
}

// 6. Update ComponentSelectorModal.jsx with animate-modal-pop
const selectorModalPath = path.join(srcDir, 'components', 'ComponentSelectorModal.jsx');
let selectorModal = fs.readFileSync(selectorModalPath, 'utf8');
const selectorOld = 'className="relative w-full max-w-5xl h-[88vh] bg-white border border-brand-border rounded-2xl flex flex-col overflow-hidden shadow-2xl"';
const selectorNew = 'className="relative w-full max-w-5xl h-[88vh] bg-white border border-brand-border rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-modal-pop"';

if (selectorModal.includes(selectorOld)) {
  selectorModal = selectorModal.replace(selectorOld, selectorNew);
  fs.writeFileSync(selectorModalPath, selectorModal, 'utf8');
  console.log('✓ ComponentSelectorModal.jsx updated with animate-modal-pop');
}

console.log('All animation and logout updates applied cleanly.');
