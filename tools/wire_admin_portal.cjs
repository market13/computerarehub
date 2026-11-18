const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/src';

// 1. Update Footer.jsx
const footerPath = path.join(basePath, 'components', 'Footer.jsx');
let footer = fs.readFileSync(footerPath, 'utf8');
const footerTarget = '<span>Secure UPI, Cards, NetBanking, EMI Accepted</span>';
const footerReplace = `<button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-brand-gold transition-colors text-slate-400 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              title="Administrator Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Admin Portal</span>
            </button>
            <span className="text-slate-700">•</span>
            <span>Secure UPI, Cards, NetBanking, EMI Accepted</span>`;

if (footer.includes(footerTarget)) {
  footer = footer.replace(footerTarget, footerReplace);
  fs.writeFileSync(footerPath, footer, 'utf8');
  console.log('✓ Footer.jsx updated');
} else {
  console.warn('✗ Footer.jsx target not found');
}

// 2. Update Header.jsx
const headerPath = path.join(basePath, 'components', 'Header.jsx');
let header = fs.readFileSync(headerPath, 'utf8');

// Top announcement bar Admin button
const topBarTarget = `<span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('bulk-order')}`;

const topBarReplace = `<span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-navy font-bold hover:underline cursor-pointer flex-shrink-0"
              title="Administrator Control Center"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Admin Portal</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('bulk-order')}`;

if (header.includes(topBarTarget)) {
  header = header.replace(topBarTarget, topBarReplace);
}

// Account button click -> open Admin portal
const accountTarget = `onClick={() => alert("Computer Care Customer Portal: You are currently guest authenticated. Real-time cart & quote sync is active!")}`;
const accountReplace = `onClick={() => setActiveTab('admin')}`;
if (header.includes(accountTarget)) {
  header = header.replace(accountTarget, accountReplace);
}

fs.writeFileSync(headerPath, header, 'utf8');
console.log('✓ Header.jsx updated');

// 3. Update App.jsx
const appPath = path.join(basePath, 'App.jsx');
let app = fs.readFileSync(appPath, 'utf8');

// Add AdminPortalView import
if (!app.includes('AdminPortalView')) {
  app = app.replace(
    "import MobileBottomNav from './components/MobileBottomNav';",
    "import MobileBottomNav from './components/MobileBottomNav';\nimport AdminPortalView from './components/AdminPortalView';"
  );
}

// Replace activeTab initialization to inspect hash
const tabInitTarget = "const [activeTab, setActiveTab] = useState('home'); // 'home', 'builder', 'catalog'";
const tabInitReplace = `const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const tabParam = new URLSearchParams(window.location.search).get('tab');
      if (hash === '#admin' || tabParam === 'admin') return 'admin';
      if (hash === '#builder' || tabParam === 'builder') return 'builder';
      if (hash === '#catalog' || tabParam === 'catalog') return 'catalog';
      if (hash === '#bulk-order' || tabParam === 'bulk-order') return 'bulk-order';
    }
    return 'home';
  });`;

if (app.includes(tabInitTarget)) {
  app = app.replace(tabInitTarget, tabInitReplace);
}

// Add hashchange listener
if (!app.includes('handleHashChange')) {
  const hashEffect = `
  // Sync URL hash with activeTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') setActiveTab('admin');
      else if (hash === '#builder') setActiveTab('builder');
      else if (hash === '#catalog') setActiveTab('catalog');
      else if (hash === '#bulk-order') setActiveTab('bulk-order');
      else if (hash === '#home' || hash === '') setActiveTab('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
`;
  app = app.replace(
    '// Custom PC build state',
    hashEffect + '\n  // Custom PC build state'
  );
}

// Update handleNavigate
const navTarget = `const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (dest === 'builder') {`;

const navReplace = `const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (dest === 'admin') {
      window.location.hash = 'admin';
      setActiveTab('admin');
    } else if (dest === 'builder') {
      window.location.hash = 'builder';`;

if (app.includes(navTarget)) {
  app = app.replace(navTarget, navReplace);
}

// Render AdminPortalView in main
const renderTarget = `) : activeTab === 'bulk-order' ? (
          <BulkOrderView onNavigate={handleNavigate} />
        ) : (`;

const renderReplace = `) : activeTab === 'bulk-order' ? (
          <BulkOrderView onNavigate={handleNavigate} />
        ) : activeTab === 'admin' ? (
          <AdminPortalView
            catalog={catalog}
            onNavigate={handleNavigate}
          />
        ) : (`;

if (app.includes(renderTarget)) {
  app = app.replace(renderTarget, renderReplace);
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✓ App.jsx updated');
