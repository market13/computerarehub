import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomeView from './components/HomeView';
import Footer from './components/Footer';
import BulkOrderFloatingBadge from './components/BulkOrderFloatingBadge';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import MobileBottomNav from './components/MobileBottomNav';
import StickyMobileActionBar from './components/StickyMobileActionBar';
import { getPCConfigurationByCode } from './services/builderService';
import categoryDescriptions from './constants/categoryDescriptions.json';
import { SITE_URL } from './constants/storeInfo';

const PCBuilderView = React.lazy(() => import('./components/PCBuilderView'));
const CatalogView = React.lazy(() => import('./components/CatalogView'));
const ServicesView = React.lazy(() => import('./components/ServicesView'));
const BulkOrderView = React.lazy(() => import('./components/BulkOrderView'));
const AdminPortalView = React.lazy(() => import('./components/AdminPortalView'));
const AboutView = React.lazy(() => import('./components/AboutView'));
const WarrantyReturnsView = React.lazy(() => import('./components/WarrantyReturnsView'));
const ShippingDeliveryView = React.lazy(() => import('./components/ShippingDeliveryView'));
const PrivacyPolicyView = React.lazy(() => import('./components/PrivacyPolicyView'));
const TermsView = React.lazy(() => import('./components/TermsView'));
const PCRepairIndirapuramView = React.lazy(() => import('./components/PCRepairIndirapuramView'));
const GamingPCVaishaliView = React.lazy(() => import('./components/GamingPCVaishaliView'));
const ComputerShopRajNagarView = React.lazy(() => import('./components/ComputerShopRajNagarView'));
const BlogView = React.lazy(() => import('./components/BlogView'));
const ComponentSelectorModal = React.lazy(() => import('./components/ComponentSelectorModal'));
const ProductDetailModal = React.lazy(() => import('./components/ProductDetailModal'));
const PrebuiltPresetsModal = React.lazy(() => import('./components/PrebuiltPresetsModal'));
const CartDrawer = React.lazy(() => import('./components/CartDrawer'));

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
  const catalogRef = useRef(catalog);
  useEffect(() => {
    catalogRef.current = catalog;
  }, [catalog]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Router integration for real URLs and Back/Forward history
  const location = useLocation();
  const navigate = useNavigate();

  const getCategoryFromPath = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'catalog') {
      return parts[1] || 'all';
    }
    return 'all';
  };

  // Search & category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState(() => getCategoryFromPath(location.pathname));

  // Derive activeTab from router pathname
  const activeTab = (() => {
    const p = location.pathname.toLowerCase();
    if (p === '/admin') return 'admin';
    if (p === '/builder' || p === '/contact' || p === '/consultation') return 'builder';
    if (p === '/bulk-order') return 'bulk-order';
    if (p === '/services') return 'services';
    if (p === '/about') return 'about';
    if (p === '/warranty-returns') return 'warranty-returns';
    if (p === '/shipping-delivery') return 'shipping-delivery';
    if (p === '/privacy-policy') return 'privacy-policy';
    if (p === '/terms') return 'terms';
    if (p === '/pc-repair-indirapuram') return 'pc-repair-indirapuram';
    if (p === '/gaming-pc-vaishali') return 'gaming-pc-vaishali';
    if (p === '/computer-shop-raj-nagar-extension') return 'computer-shop-raj-nagar-extension';
    if (p.startsWith('/blog')) return 'blog';
    if (p.startsWith('/catalog')) return 'catalog';
    return 'home';
  })();

  // Automatically redirect /contact or /consultation to /builder?mode=consultation
  useEffect(() => {
    const p = location.pathname.toLowerCase();
    if (p === '/contact' || p === '/consultation') {
      navigate('/builder?mode=consultation', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Sync /catalog/:category route with selectedCatalogCategory
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    const cat = getCategoryFromPath(location.pathname);
    setSelectedCatalogCategory(cat);
  }

  // Backward-compatibility: redirect legacy hash URLs (#builder, #catalog, etc.) to real paths
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.toLowerCase().replace(/^#/, '');
      if (hash === 'builder') navigate('/builder', { replace: true });
      else if (hash === 'catalog') navigate('/catalog', { replace: true });
      else if (hash === 'services') navigate('/services', { replace: true });
      else if (hash.startsWith('catalog-')) {
        const cat = hash.replace('catalog-', '');
        navigate(`/catalog/${cat}`, { replace: true });
      } else if (hash === 'bulk-order') navigate('/bulk-order', { replace: true });
      else if (hash === 'admin') navigate('/admin', { replace: true });
      else if (hash === 'home') navigate('/', { replace: true });
    }
  }, [navigate]);

  // Helper to ensure meta descriptions never truncate mid-word
  const truncateMetaDesc = (text, maxLen = 155) => {
    if (!text || text.length <= maxLen) return text || '';
    const sub = text.slice(0, maxLen);
    const lastSpace = sub.lastIndexOf(' ');
    return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trim();
  };

  // Update per-route <title>, meta description, canonical URL, and OpenGraph/Twitter tags
  useEffect(() => {
    const p = location.pathname;
    let title = 'Computer Care | Custom PC Builder & Hardware Ghaziabad';
    let desc = 'Computer Care is a trusted computer shop in Ghaziabad for custom PC building, hardware upgrades, and laptop repair services.';
    let canonicalUrl = `${SITE_URL}/`;
    let isNoIndex = false;

    if (p === '/builder') {
      title = 'Custom PC Builder & Compatibility Check | Computer Care';
      desc = 'Build your custom gaming PC with real-time socket, DDR RAM, GPU clearance, and PSU wattage checks at Computer Care Ghaziabad.';
      canonicalUrl = `${SITE_URL}/builder`;
    } else if (p.startsWith('/catalog')) {
      const parts = p.split('/').filter(Boolean);
      const cat = parts[1] || selectedCatalogCategory;
      if (cat && cat !== 'all') {
        const catName = cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `${catName} | Computer Care Ghaziabad`.slice(0, 59);
        desc = truncateMetaDesc(categoryDescriptions[cat] || `Browse ${catName} at Computer Care Ghaziabad with official manufacturer warranty and GST invoice.`);
        canonicalUrl = `${SITE_URL}/catalog/${cat}`;
      } else {
        title = 'Hardware Components Catalog | Computer Care';
        desc = truncateMetaDesc(categoryDescriptions.all || 'Browse authentic computer hardware components, CPUs, graphics cards, motherboards, RAM, cabinets, and monitors.');
        canonicalUrl = `${SITE_URL}/catalog`;
      }
    } else if (p === '/services') {
      title = 'Computer Repair & Custom PCs | Computer Care Ghaziabad';
      desc = 'Computer Care provides custom gaming PC building, computer & laptop repair, hardware upgrades, and authentic computer accessories in Ghaziabad, Uttar Pradesh.';
      canonicalUrl = `${SITE_URL}/services`;
    } else if (p === '/bulk-order') {
      title = 'B2B Bulk Hardware Procurement | Computer Care';
      desc = 'Special wholesale procurement quotations for offices, gaming cafes, CAD studios, and educational labs.';
      canonicalUrl = `${SITE_URL}/bulk-order`;
    } else if (p === '/about') {
      title = 'About Us | Computer Care Ghaziabad';
      desc = 'Learn about Computer Care, your local custom PC builder, hardware retailer, and computer repair shop at Shiva Tower, Ghaziabad.';
      canonicalUrl = `${SITE_URL}/about`;
    } else if (p === '/warranty-returns') {
      title = 'Warranty & Returns Policy | Computer Care';
      desc = 'Read Computer Care\'s warranty coverage, manufacturer RMA guidelines, and 7-day DOA replacement terms for computer hardware.';
      canonicalUrl = `${SITE_URL}/warranty-returns`;
    } else if (p === '/shipping-delivery') {
      title = 'Shipping & Delivery Information | Computer Care';
      desc = 'Pan-India insured courier delivery and free store pickup in Ghaziabad for custom gaming PCs, components, and accessories.';
      canonicalUrl = `${SITE_URL}/shipping-delivery`;
    } else if (p === '/privacy-policy') {
      title = 'Privacy Policy | Computer Care Ghaziabad';
      desc = 'Read the privacy policy of Computer Care. We safeguard customer personal data and never sell information to third parties.';
      canonicalUrl = `${SITE_URL}/privacy-policy`;
    } else if (p === '/terms') {
      title = 'Terms & Conditions | Computer Care Ghaziabad';
      desc = 'Terms of service, pricing validity, GST invoicing, and custom PC assembly policies at Computer Care Ghaziabad.';
      canonicalUrl = `${SITE_URL}/terms`;
    } else if (p === '/pc-repair-indirapuram') {
      title = 'PC Repair in Indirapuram | Computer Care Ghaziabad';
      desc = 'Fast, reliable computer & laptop repair for Indirapuram residents at Computer Care Shiva Tower. Diagnostic troubleshooting, OS setup, and hardware replacement.';
      canonicalUrl = `${SITE_URL}/pc-repair-indirapuram`;
    } else if (p === '/gaming-pc-vaishali') {
      title = 'Custom Gaming PC in Vaishali | Computer Care Ghaziabad';
      desc = 'Build your dream custom gaming PC near Vaishali at Computer Care Ghaziabad. NVIDIA RTX graphics, Intel/AMD CPUs, live wattage checks & manufacturer warranty.';
      canonicalUrl = `${SITE_URL}/gaming-pc-vaishali`;
    } else if (p === '/computer-shop-raj-nagar-extension') {
      title = 'Computer Shop near Raj Nagar Ext | Computer Care';
      desc = 'Looking for a trusted computer shop near Raj Nagar Extension? Computer Care at Shiva Tower provides genuine PC parts, custom builds, and expert desktop repairs.';
      canonicalUrl = `${SITE_URL}/computer-shop-raj-nagar-extension`;
    } else if (p === '/blog') {
      title = 'Hardware Guides & PC Tech Blog | Computer Care';
      desc = 'Guides, pricing insights, and custom PC hardware comparisons from Computer Care Ghaziabad technicians.';
      canonicalUrl = `${SITE_URL}/blog`;
    } else if (p.startsWith('/blog/')) {
      const slug = p.replace('/blog/', '');
      if (slug === 'best-gaming-pc-build-under-50000-2026') {
        title = 'Best Gaming PC Build Under ₹50,000 (2026) | Computer Care';
        desc = 'Budget 1080p gaming PC build guide under ₹50,000 in 2026 with tested component benchmarks and socket compatibility.';
        canonicalUrl = `${SITE_URL}/blog/best-gaming-pc-build-under-50000-2026`;
      } else if (slug === 'laptop-repair-cost-ghaziabad') {
        title = 'Laptop Repair Cost in Ghaziabad (2026) | Computer Care';
        desc = 'Transparent price guide for laptop screen replacement, thermal servicing, SSD upgrades, and motherboard repairs in Ghaziabad.';
        canonicalUrl = `${SITE_URL}/blog/laptop-repair-cost-ghaziabad`;
      }
    } else if (p === '/admin') {
      title = 'Administrator Management Portal | Computer Care';
      desc = 'Store administrator portal for managing orders, quotations, pricing, and hardware inventory.';
      canonicalUrl = `${SITE_URL}/admin`;
      isNoIndex = true;
    }

    document.title = title;

    // Helper to safely set attribute
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el && attr === 'content') {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) el.setAttribute('property', prop);
        }
        document.head.appendChild(el);
      }
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', desc);

    // Canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // Robots meta (disallow indexing on admin route)
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag) {
      robotsTag.setAttribute('content', isNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
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

  const [buildHash, setBuildHash] = useState('v1');
  const [manifestData, setManifestData] = useState(null);

  // Lightweight manifest initialization: seeds default rig and featured items instantly
  useEffect(() => {
    async function loadData() {
      try {
        const manifestResp = await fetch('/data/manifest.json');
        if (manifestResp.ok) {
          const manifest = await manifestResp.json();
          const hash = manifest.buildHash || 'v1';
          setBuildHash(hash);
          setManifestData(manifest);

          // Seed catalog with homeFeatured so featured components display instantly
          if (manifest.homeFeatured) {
            setCatalog(manifest.homeFeatured);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog manifest", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Restore shared PC build if ?config=<code> or pre-select component (e.g. ?gpu=<id>)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const configCode = params.get('config');
    if (configCode) {
      getPCConfigurationByCode(configCode).then((res) => {
        if (res && res.build) {
          setBuild(res.build);
        }
      }).catch((err) => {
        console.warn('Could not restore shared build config:', err);
      });
    }

    // Support pre-selecting component(s) from URL (e.g. /builder?gpu=860101)
    COMPONENT_SLOTS.forEach(slot => {
      const compId = params.get(slot.key);
      if (compId) {
        const existingCat = catalogRef.current[slot.key];
        const match = existingCat && existingCat.find(item => String(item.id) === String(compId));
        if (match) {
          setBuild(prev => ({ ...prev, [slot.key]: match }));
        } else {
          fetch(`/data/categories/${slot.key}.json?v=${buildHash}`)
            .then(res => res.ok ? res.json() : [])
            .then(items => {
              if (items && items.length > 0) {
                setCatalog(prev => ({ ...prev, [slot.key]: items }));
                const found = items.find(item => String(item.id) === String(compId));
                if (found) {
                  setBuild(prev => ({ ...prev, [slot.key]: found }));
                }
              }
            })
            .catch(() => {});
        }
      }
    });
  }, [location.search, buildHash]);

  // Ensure active selector category is loaded on demand with full dataset
  useEffect(() => {
    if (activeSelectorKey && (!catalog[activeSelectorKey] || catalog[activeSelectorKey].length <= 4)) {
      fetch(`/data/categories/${activeSelectorKey}.json?v=${buildHash}`)
        .then(res => res.ok ? res.json() : [])
        .then(items => {
          if (items.length > 0) {
            setCatalog(prev => ({ ...prev, [activeSelectorKey]: items }));
          }
        })
        .catch(() => {});
    }
  }, [activeSelectorKey, catalog, buildHash]);

  // Ensure selected catalog category is loaded on demand with full dataset
  useEffect(() => {
    if (selectedCatalogCategory && selectedCatalogCategory !== 'all' && (!catalog[selectedCatalogCategory] || catalog[selectedCatalogCategory].length <= 4)) {
      fetch(`/data/categories/${selectedCatalogCategory}.json?v=${buildHash}`)
        .then(res => res.ok ? res.json() : [])
        .then(items => {
          if (items.length > 0) {
            setCatalog(prev => ({ ...prev, [selectedCatalogCategory]: items }));
          }
        })
        .catch(() => {});
    }
  }, [selectedCatalogCategory, catalog, buildHash]);

  // Progressive background loading for full catalog only when browsing catalog 'all'
  useEffect(() => {
    if (activeTab === 'catalog' && selectedCatalogCategory === 'all' && manifestData) {
      const timer = setTimeout(() => {
        (manifestData.categories || []).forEach(catKey => {
          if (!catalog[catKey] || catalog[catKey].length <= 4) {
            fetch(`/data/categories/${catKey}.json?v=${buildHash}`)
              .then(res => res.ok ? res.json() : [])
              .then(items => {
                if (items.length > 0) {
                  setCatalog(prev => ({ ...prev, [catKey]: items }));
                }
              })
              .catch(() => {});
          }
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, selectedCatalogCategory, manifestData, buildHash, catalog]);

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

  const handleOpenPresets = () => {
    if (presets.length === 0) {
      fetch(`/data/presets.json?v=${buildHash}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setPresets(data);
          }
        })
        .catch(() => {});
    }
    setIsPresetsOpen(true);
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
    const targetPath = catKey === 'all' ? '/catalog' : `/catalog/${catKey}`;
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(targetPath);
      });
    } else {
      navigate(targetPath);
    }
  };

  const handleNavigate = (dest, subParam) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const applyNav = () => {
      if (dest === 'admin') {
        navigate('/admin');
      } else if (dest === 'builder') {
        if (subParam === 'consultation') {
          navigate('/builder?mode=consultation');
        } else {
          navigate('/builder');
        }
      } else if (dest.startsWith('builder?') || dest.startsWith('/builder?')) {
        navigate(dest.startsWith('/') ? dest : `/${dest}`);
      } else if (dest === 'consultation' || dest === 'contact') {
        navigate('/builder?mode=consultation');
      } else if (dest === 'bulk-order') {
        navigate('/bulk-order');
      } else if (dest === 'services') {
        navigate('/services');
      } else if (dest === 'about') {
        navigate('/about');
      } else if (dest === 'warranty-returns') {
        navigate('/warranty-returns');
      } else if (dest === 'shipping-delivery') {
        navigate('/shipping-delivery');
      } else if (dest === 'privacy-policy') {
        navigate('/privacy-policy');
      } else if (dest === 'terms') {
        navigate('/terms');
      } else if (dest === 'pc-repair-indirapuram') {
        navigate('/pc-repair-indirapuram');
      } else if (dest === 'gaming-pc-vaishali') {
        navigate('/gaming-pc-vaishali');
      } else if (dest === 'computer-shop-raj-nagar-extension') {
        navigate('/computer-shop-raj-nagar-extension');
      } else if (dest === 'blog') {
        navigate('/blog');
      } else if (dest.startsWith('blog-')) {
        const slug = dest.replace('blog-', '');
        navigate(`/blog/${slug}`);
      } else if (dest === 'catalog') {
        setSelectedCatalogCategory('all');
        navigate('/catalog');
      } else if (dest === 'presets') {
        handleOpenPresets();
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
        selectedCatalogCategory={selectedCatalogCategory}
        buildCount={buildItems.length}
        totalPrice={totalPrice}
        onOpenPresets={handleOpenPresets}
        onResetBuild={handleResetBuild}
        onOpenCart={() => setIsCartOpen(true)}
        categories={Object.keys(catalog)}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleHeaderSearch}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-6 pb-28 md:pb-6">
        <div key={activeTab} className="animate-tab-enter w-full">
        <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-slate-500"><div className="w-8 h-8 rounded-full border-4 border-brand-navy border-t-transparent animate-spin mx-auto mb-2" />Loading...</div>}>
        {activeTab === 'home' ? (
          <HomeView
            catalog={catalog}
            build={build}
            onNavigate={handleNavigate}
            onOpenSelector={(cat) => setActiveSelectorKey(cat)}
            onViewDetails={setDetailProduct}
            onOpenPresets={handleOpenPresets}
            onSelectComponent={handleSelectComponent}
          />
        ) : activeTab === 'builder' ? (
          <PCBuilderView
            build={build}
            initialMode={
              location.search.includes('mode=consultation')
                ? 'consultation'
                : (location.search.includes('mode=diy') || location.search.includes('gpu=') || location.search.includes('config=') || COMPONENT_SLOTS.some(s => location.search.includes(`${s.key}=`)))
                  ? 'diy'
                  : 'consultation'
            }
            onOpenSelector={(cat) => setActiveSelectorKey(cat)}
            onRemoveComponent={handleRemoveComponent}
            onViewDetails={setDetailProduct}
            onOpenPresets={handleOpenPresets}
            onResetBuild={handleResetBuild}
            onAddToCart={() => setIsCartOpen(true)}
          />
        ) : activeTab === 'bulk-order' ? (
          <BulkOrderView onNavigate={handleNavigate} />
        ) : activeTab === 'services' ? (
          <ServicesView onNavigate={handleNavigate} />
        ) : activeTab === 'about' ? (
          <AboutView onNavigate={handleNavigate} />
        ) : activeTab === 'warranty-returns' ? (
          <WarrantyReturnsView onNavigate={handleNavigate} />
        ) : activeTab === 'shipping-delivery' ? (
          <ShippingDeliveryView onNavigate={handleNavigate} />
        ) : activeTab === 'privacy-policy' ? (
          <PrivacyPolicyView onNavigate={handleNavigate} />
        ) : activeTab === 'terms' ? (
          <TermsView onNavigate={handleNavigate} />
        ) : activeTab === 'pc-repair-indirapuram' ? (
          <PCRepairIndirapuramView onNavigate={handleNavigate} />
        ) : activeTab === 'gaming-pc-vaishali' ? (
          <GamingPCVaishaliView onNavigate={handleNavigate} />
        ) : activeTab === 'computer-shop-raj-nagar-extension' ? (
          <ComputerShopRajNagarView onNavigate={handleNavigate} />
        ) : activeTab === 'blog' ? (
          <BlogView 
            currentSlug={location.pathname.startsWith('/blog/') ? location.pathname.replace('/blog/', '') : null} 
            onNavigate={handleNavigate} 
          />
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
            onSelectCategory={handleCategorySelect}
            onSelectComponent={handleSelectComponent}
            onViewDetails={setDetailProduct}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryCounts={manifestData?.categoryCounts || {}}
          />
        )}
        </Suspense>
      </div>
      </main>

      {/* Modals & Drawers */}
      <Suspense fallback={null}>
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
        {isPresetsOpen && (
          <PrebuiltPresetsModal
            isOpen={isPresetsOpen}
            onClose={() => setIsPresetsOpen(false)}
            presets={presets}
            catalog={catalog}
            onLoadPreset={handleLoadPreset}
          />
        )}

        {/* 4. Shopping Cart Drawer */}
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            build={build}
            onRemoveItem={handleRemoveComponent}
            onClearCart={handleResetBuild}
          />
        )}
      </Suspense>

      {/* 5. Persistent Floating Side Label: Bulk Order */}
      <BulkOrderFloatingBadge activeTab={activeTab} onNavigate={handleNavigate} />

      {/* 6. Floating Corner WhatsApp Button */}
      <WhatsAppFloatingButton />

      {/* 6.5. Mobile Sticky Helpline & WhatsApp Bar */}
      <StickyMobileActionBar />

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
