import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Store, 
  ShoppingCart, 
  Search, 
  ChevronsUp
} from 'lucide-react';

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
            aria-label={`Shopping Cart (${cartCount} items)`}
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
          <div className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md transition-colors">
            {/* Official WhatsApp SVG Silhouette */}
            <svg 
              className="w-5 h-5 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
        </button>
      </nav>
    </>
  );
}
