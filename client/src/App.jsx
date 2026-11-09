import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import PCBuilderView from './components/PCBuilderView';
import CatalogView from './components/CatalogView';
import ComponentSelectorModal from './components/ComponentSelectorModal';
import ProductDetailModal from './components/ProductDetailModal';
import PrebuiltPresetsModal from './components/PrebuiltPresetsModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import BulkOrderView from './components/BulkOrderView';
import BulkOrderFloatingBadge from './components/BulkOrderFloatingBadge';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import MobileBottomNav from './components/MobileBottomNav';
import AdminPortalView from './components/AdminPortalView';
import { findCompatibleDefaultBuild } from './utils/compatibility';

const COMPONENT_SLOTS = [
  { key: 'case', label: 'PC Cabinet / Case' },
  { key: 'case_fan', label: 'Cabinet Cooling Fans' },
  { key: 'cpu', label: 'Processor (CPU)' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'gpu', label: 'Graphics Card (GPU)' },
  { key: 'cooler', label: 'CPU Cooler / AIO' },
  { key: 'storage', label: 'Storage (SSD / NVMe)' },
  { key: 'psu', label: 'Power Supply Unit' },
  { key: 'monitor', label: 'Gaming Monitor' },
];

export default function App() {
  const [catalog, setCatalog] = useState({});
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Router integration for real URLs and Back/Forward history
  const location = useLocation();
  const navigate = useNavigate();

  // Search & category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('all');

  // Derive activeTab from router pathname
  const activeTab = (() => {
    const p = location.pathname.toLowerCase();
    if (p === '/admin') return 'admin';
    if (p === '/builder') return 'builder';
    if (p === '/bulk-order') return 'bulk-order';
    if (p.startsWith('/catalog')) return 'catalog';
    return 'home';
  })();

  // Sync /catalog/:category route with selectedCatalogCategory
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    const p = location.pathname;
    if (p.startsWith('/catalog/')) {
      const cat = p.replace('/catalog/', '').trim();
      if (cat) {
        setSelectedCatalogCategory(cat);
      }
    } else if (p === '/catalog') {
      setSelectedCatalogCategory('all');
    }
  }

  // Backward-compatibility: redirect legacy hash URLs (#builder, #catalog, etc.) to real paths
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.toLowerCase().replace(/^#/, '');
      if (hash === 'builder') navigate('/builder', { replace: true });
      else if (hash === 'catalog') navigate('/catalog', { replace: true });
      else if (hash.startsWith('catalog-')) {
        const cat = hash.replace('catalog-', '');
        navigate(`/catalog/${cat}`, { replace: true });
      } else if (hash === 'bulk-order') navigate('/bulk-order', { replace: true });
      else if (hash === 'admin') navigate('/admin', { replace: true });
      else if (hash === 'home') navigate('/', { replace: true });
    }
  }, [navigate]);

  // Update per-route <title> and meta description
  useEffect(() => {
    const p = location.pathname;
    let title = 'Computer Care | Custom PC Builds & Genuine Computer Hardware';
    let desc = "Computer Care - India's premier custom PC builder with live 3D cabinet visualization, genuine computer parts, and real-time hardware compatibility.";

    if (p === '/builder') {
      title = 'Custom 3D PC Builder & Real-time Compatibility | Computer Care';
      desc = 'Configure your dream gaming rig or workstation with real-time socket, DDR standard, GPU dimension, and PSU wattage checks.';
    } else if (p.startsWith('/catalog')) {
      const parts = p.split('/').filter(Boolean);
      const cat = parts[1] || selectedCatalogCategory;
      if (cat && cat !== 'all') {
        const catName = cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `${catName} - Authentic Hardware Components | Computer Care`;
        desc = `Shop verified 100% brand-warranty ${catName} at honest prices with pan-India insured shipping.`;
      } else {
        title = 'Hardware Components Catalog | Computer Care';
        desc = 'Browse authentic computer hardware components, CPUs, graphics cards, motherboards, RAM, cabinets, and monitors.';
      }
    } else if (p === '/bulk-order') {
      title = 'B2B & Institutional Bulk Hardware Orders | Computer Care';
      desc = 'Special wholesale procurement quotations for offices, gaming cafes, CAD studios, and educational labs.';
    } else if (p === '/admin') {
      title = 'Administrator Management Portal | Computer Care';
      desc = 'Store administrator portal for managing orders, quotations, pricing, and hardware inventory.';
    }

    document.title = title;
    const metaTag = document.querySelector('meta[name="description"]');
    if (metaTag) {
      metaTag.setAttribute('content', desc);
    }
  }, [location.pathname, selectedCatalogCategory]);

  // Custom PC build state
  const [build, setBuild] = useState({
    case: null,
    case_fan: null,
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    cooler: null,
    storage: null,
    psu: null,
    monitor: null
  });

  // Modals state
  const [activeSelectorKey, setActiveSelectorKey] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // On-demand category loading and manifest initialization with content hash caching
  useEffect(() => {
    async function loadData() {
      try {
        const manifestResp = await fetch('/data/manifest.json');
        let hash = 'v1';
        let initialCatalog = {};

        if (manifestResp.ok) {
          const manifest = await manifestResp.json();
          hash = manifest.buildHash || 'v1';

          // Fast render: seed default compatible rig directly from manifest
          if (manifest.initialBuild) {
            setBuild(manifest.initialBuild);
          }

          // Core categories needed for home and builder
          const coreCategories = ['cpu', 'motherboard', 'ram', 'gpu', 'case', 'psu', 'cooler', 'storage'];
          await Promise.all(
            coreCategories.map(async (catKey) => {
              try {
                const res = await fetch(`/data/categories/${catKey}.json?v=${hash}`);
                if (res.ok) {
                  initialCatalog[catKey] = await res.json();
                }
              } catch (catErr) {
                console.warn(`Failed loading category ${catKey}`, catErr);
              }
            })
          );

          // If initial build wasn't in manifest, calculate from loaded categories
          if (!manifest.initialBuild) {
            const compatibleBuild = findCompatibleDefaultBuild(initialCatalog);
            if (compatibleBuild) setBuild(compatibleBuild);
          }

          // Load remaining categories in background so catalog & search are fully populated
          const remaining = (manifest.categories || []).filter(c => !coreCategories.includes(c));
          Promise.all(
            remaining.map(async (catKey) => {
              try {
                const res = await fetch(`/data/categories/${catKey}.json?v=${hash}`);
                if (res.ok) {
                  const items = await res.json();
                  setCatalog(prev => ({ ...prev, [catKey]: items }));
                }
              } catch {
                // ignore background load errors
              }
            })
          );
        } else {
          // Fallback to products.json if manifest is missing
          const prodResp = await fetch('/data/products.json');
          if (prodResp.ok) {
            initialCatalog = await prodResp.json();
            const compatibleBuild = findCompatibleDefaultBuild(initialCatalog);
            if (compatibleBuild) setBuild(compatibleBuild);
          }
        }

        setCatalog(initialCatalog);

        // Fetch presets (cached, no no-store or timestamp)
        try {
          const presetResp = await fetch(`/data/presets.json?v=${hash}`);
          if (presetResp.ok) {
            const presetData = await presetResp.json();
            setPresets(presetData);
          }
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Failed to load catalog manifest", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Ensure active selector category is loaded on demand
  useEffect(() => {
    if (activeSelectorKey && !catalog[activeSelectorKey]) {
      fetch(`/data/categories/${activeSelectorKey}.json`)
        .then(res => res.ok ? res.json() : [])
        .then(items => {
          if (items.length > 0) {
            setCatalog(prev => ({ ...prev, [activeSelectorKey]: items }));
          }
        })
        .catch(() => {});
    }
  }, [activeSelectorKey, catalog]);

  // Ensure selected catalog category is loaded on demand
  useEffect(() => {
    if (selectedCatalogCategory && selectedCatalogCategory !== 'all' && !catalog[selectedCatalogCategory]) {
      fetch(`/data/categories/${selectedCatalogCategory}.json`)
        .then(res => res.ok ? res.json() : [])
        .then(items => {
          if (items.length > 0) {
            setCatalog(prev => ({ ...prev, [selectedCatalogCategory]: items }));
          }
        })
        .catch(() => {});
    }
  }, [selectedCatalogCategory, catalog]);

  const handleSelectComponent = (categoryKey, product) => {
    setBuild(prev => ({
      ...prev,
      [categoryKey]: product
    }));
  };

  const handleRemoveComponent = (categoryKey) => {
    setBuild(prev => ({
      ...prev,
      [categoryKey]: null
    }));
  };

  const handleResetBuild = () => {
    if (window.confirm("Reset your current PC build back to empty?")) {
      setBuild({
        case: null,
        case_fan: null,
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        cooler: null,
        storage: null,
        psu: null,
        monitor: null
      });
    }
  };

  const handleLoadPreset = (presetBuild) => {
    setBuild(presetBuild);
    handleNavigate('builder');
  };

  const handleHeaderSearch = () => {
    navigate('/catalog');
  };

  const handleCategorySelect = (catKey) => {
    setSelectedCatalogCategory(catKey);
    if (catKey === 'all') {
      navigate('/catalog');
    } else {
      navigate(`/catalog/${catKey}`);
    }
  };

  const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const applyNav = () => {
      if (dest === 'admin') {
        navigate('/admin');
      } else if (dest === 'builder') {
        navigate('/builder');
      } else if (dest === 'bulk-order') {
        navigate('/bulk-order');
      } else if (dest === 'catalog') {
        setSelectedCatalogCategory('all');
        navigate('/catalog');
      } else if (dest === 'presets') {
        setIsPresetsOpen(true);
      } else if (dest.startsWith('catalog-')) {
        const cat = dest.replace('catalog-', '');
        setSelectedCatalogCategory(cat);
        navigate(`/catalog/${cat}`);
      } else {
        navigate('/');
      }
    };

    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        applyNav();
      });
    } else {
      applyNav();
    }
  };

  const setActiveTab = (tab) => {
    handleNavigate(tab);
  };

  const buildItems = Object.values(build).filter(Boolean);
  const totalPrice = buildItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const activeSelectorSlot = COMPONENT_SLOTS.find(s => s.key === activeSelectorKey);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-brand-red selection:text-white w-full max-w-full overflow-x-clip">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-red text-white font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* Computer Care Style Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        buildCount={buildItems.length}
        totalPrice={totalPrice}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onResetBuild={handleResetBuild}
        onOpenCart={() => setIsCartOpen(true)}
        categories={Object.keys(catalog)}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleHeaderSearch}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-6">
        <div key={activeTab} className="animate-tab-enter w-full">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl border-4 border-brand-navy/20 border-t-brand-navy animate-spin mb-4" />
            <h2 className="text-base font-display font-bold text-brand-navy uppercase tracking-wider">
              LOADING COMPUTER CARE HARDWARE LAB
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Synchronizing genuine Computer Care hardware catalog & custom PC builder...
            </p>
          </div>
        ) : activeTab === 'home' ? (
          <HomeView
            catalog={catalog}
            build={build}
            onNavigate={handleNavigate}
            onOpenSelector={(cat) => setActiveSelectorKey(cat)}
            onViewDetails={setDetailProduct}
            onOpenPresets={() => setIsPresetsOpen(true)}
            onSelectComponent={handleSelectComponent}
          />
        ) : activeTab === 'builder' ? (
          <PCBuilderView
            build={build}
            onOpenSelector={(cat) => setActiveSelectorKey(cat)}
            onRemoveComponent={handleRemoveComponent}
            onViewDetails={setDetailProduct}
            onOpenPresets={() => setIsPresetsOpen(true)}
            onResetBuild={handleResetBuild}
            onAddToCart={() => setIsCartOpen(true)}
          />
        ) : activeTab === 'bulk-order' ? (
          <BulkOrderView onNavigate={handleNavigate} />
        ) : activeTab === 'admin' ? (
          <AdminPortalView
            catalog={catalog}
            onNavigate={handleNavigate}
          />
        ) : (
          <CatalogView
            catalog={catalog}
            build={build}
            selectedCategory={selectedCatalogCategory}
            onSelectCategory={setSelectedCatalogCategory}
            onSelectComponent={handleSelectComponent}
            onViewDetails={setDetailProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </div>
      </main>

      {/* Modals & Drawers */}
      {/* 1. Component Selector Modal */}
      {activeSelectorKey && activeSelectorSlot && (
        <ComponentSelectorModal
          isOpen={Boolean(activeSelectorKey)}
          onClose={() => setActiveSelectorKey(null)}
          categoryKey={activeSelectorKey}
          categoryLabel={activeSelectorSlot.label}
          products={catalog[activeSelectorKey] || []}
          build={build}
          onSelectProduct={handleSelectComponent}
          onViewDetails={setDetailProduct}
        />
      )}

      {/* 2. Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          isOpen={Boolean(detailProduct)}
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onSelectProduct={handleSelectComponent}
          isSelected={build[detailProduct.category]?.id === detailProduct.id}
        />
      )}

      {/* 3. Prebuilt Rig Presets Modal */}
      <PrebuiltPresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        presets={presets}
        catalog={catalog}
        onLoadPreset={handleLoadPreset}
      />

      {/* 4. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        build={build}
        onRemoveItem={handleRemoveComponent}
        onClearCart={handleResetBuild}
      />

      {/* 5. Persistent Floating Side Label: Bulk Order */}
      <BulkOrderFloatingBadge activeTab={activeTab} onNavigate={handleNavigate} />

      {/* 6. Floating Corner WhatsApp Button */}
      <WhatsAppFloatingButton />

      {/* 7. Mobile Bottom Navigation Bar (Matching user reference) */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={buildItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSearchFocus={() => {
          setActiveTab('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Computer Care Style Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
