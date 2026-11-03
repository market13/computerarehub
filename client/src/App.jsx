import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'builder', 'catalog'

  // Search & category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('all');

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

  // Fetch catalog & presets on mount with cache-busting
  useEffect(() => {
    async function loadData() {
      try {
        const prodResp = await fetch('/data/products.json?v=' + Date.now(), { cache: 'no-store' });
        const prodData = await prodResp.json();
        setCatalog(prodData);

        const presetResp = await fetch('/data/presets.json?v=' + Date.now(), { cache: 'no-store' });
        if (presetResp.ok) {
          const presetData = await presetResp.json();
          setPresets(presetData);
        }

        // Initialize with default high-end rig
        if (prodData.case && prodData.case.length > 0) {
          setBuild({
            case: prodData.case.find(c => c.vendor === 'Cooler Master') || prodData.case[0] || null,
            cpu: prodData.cpu ? prodData.cpu[0] : null,
            motherboard: prodData.motherboard ? prodData.motherboard[0] : null,
            ram: prodData.ram ? prodData.ram[0] : null,
            gpu: prodData.gpu ? prodData.gpu[0] : null,
            cooler: prodData.cooler ? prodData.cooler[0] : null,
            storage: prodData.storage ? prodData.storage[0] : null,
            psu: prodData.psu ? prodData.psu[0] : null,
            monitor: null
          });
        }
      } catch (err) {
        console.error("Failed to load products or presets", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
    setActiveTab('builder');
  };

  const handleHeaderSearch = () => {
    setActiveTab('catalog');
  };

  const handleCategorySelect = (catKey) => {
    setSelectedCatalogCategory(catKey);
    setActiveTab('catalog');
  };

  const handleNavigate = (dest) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (dest === 'builder') {
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

      {/* Computer Care Style Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
