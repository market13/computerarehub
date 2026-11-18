import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Store, 
  ShoppingCart, 
  Search, 
  ChevronsUp
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function MobileBottomNav({
  activeTab,
  onNavigate,
  cartCount = 0,
  onOpenCart,
  onSearchFocus
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    onNavigate('home');
    scrollToTop();
  };

  const handleCatalogClick = () => {
    onNavigate('catalog');
    scrollToTop();
  };

  const handleWhatsAppClick = () => {
    const phone = '919810550222';
    const message = encodeURIComponent('Hello Computer Care Team, I have an inquiry regarding PC builds, parts and pricing.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. Floating Circular Scroll-To-Top Button (Visible on mobile/tablet when scrolled) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`lg:hidden fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronsUp className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* 2. Fixed Mobile Bottom Navigation Bar matching reference design */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] px-3 sm:px-6 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-between select-none"
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={handleHomeClick}
          aria-label="Home"
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-800 hover:text-blue-600 transition-colors active:scale-95 cursor-pointer"
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-blue-600 stroke-[2.2]' : 'text-slate-800 stroke-[1.8]'}`} />
        </button>

        {/* Tab 2: Shop / Catalog */}
        <button
          type="button"
          onClick={handleCatalogClick}
          aria-label="Shop Catalog"
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-800 hover:text-blue-600 transition-colors active:scale-95 cursor-pointer"
        >
          <Store className={`w-6 h-6 ${activeTab === 'catalog' ? 'text-blue-600 stroke-[2.2]' : 'text-slate-800 stroke-[1.8]'}`} />
        </button>

        {/* Tab 3: Center Elevated Cart Button with Count Badge */}
        <div className="flex-1 flex items-center justify-center relative">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={cartCount > 0 ? `${cartCount} items in shopping cart` : "Shopping Cart"}
            className="-mt-8 w-14 h-14 rounded-full bg-[#facc15] hover:bg-[#eab308] text-white flex items-center justify-center shadow-xl ring-[5px] ring-white relative cursor-pointer active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-6 h-6 text-white stroke-[2.2]" />
            {/* Red count badge with white ring */}
            <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-mono shadow-sm ring-2 ring-white">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Tab 4: Search */}
        <button
          type="button"
          onClick={onSearchFocus}
          aria-label="Search Catalog"
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-800 hover:text-blue-600 transition-colors active:scale-95 cursor-pointer"
        >
          <Search className="w-6 h-6 text-slate-800 stroke-[1.8]" />
        </button>

        {/* Tab 5: WhatsApp Direct Support */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="WhatsApp Support"
          className="flex-1 flex flex-col items-center justify-center py-1 active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center drop-shadow-sm">
            <WhatsAppIcon variant="badge" className="w-9 h-9" />
          </div>
        </button>
      </nav>
    </>
  );
}
