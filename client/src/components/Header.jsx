import React, { useState, useEffect } from 'react';
import AdminLoginModal from './AdminLoginModal';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Box,
  Building2,
  Phone,
  Mail
} from 'lucide-react';

// Exact Gaming Mega Menu featuring authorized partner brands
const GAMING_MENU_COLUMNS = [
  {
    top: {
      title: 'Gaming Mouse',
      items: [
        'Wired Mice (All Brands)',
        'Dell Wired Mouse',
        'Logitech Optical Mouse',
        'HP Optical Mouse',
        'Zebronics Wired Mouse',
        'Lapcare Optical Mouse',
        'ProDot Total Control Mouse',
        'Geonix Optical Mouse',
        'Consistent Optical Mouse',
        'iBall Optical Mouse',
        'Acer Desktop Mouse',
        'TVS Champ Heavy Duty Mouse',
        'Ant Esports Gaming Mouse',
        'Cosmic Byte Gaming Mouse',
        'Wireless Gaming Mouse'
      ]
    },
    bottom: {
      title: 'Gaming PC',
      items: [
        'AAA Gaming PC',
        'Casual Gaming PC',
        'Esports Gaming PC',
        'View All'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Keyboard',
      items: [
        'Wired Keyboards (All Brands)',
        'TVS Gold Mechanical Keyboard',
        'TVS Champ Wired Keyboard',
        'Dell Wired Keyboard',
        'HP Wired Keyboard',
        'Logitech Wired Keyboard',
        'Zebronics Wired Keyboard',
        'Lapcare Multimedia Keyboard',
        'ProDot Wired Keyboard',
        'Consistent Wired Keyboard',
        'Geonix Wired Keyboard',
        'iBall Wired Keyboard',
        'Acer Wired Keyboard',
        'Ant Esports Gaming Keyboard',
        'Cosmic Byte Mechanical Keyboard'
      ]
    },
    bottom: {
      title: 'Gaming Chair',
      items: [
        'Ant Esports Gaming Chair',
        'Zebronics Gaming Chair',
        'View All'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Headphones',
      items: [
        'Wired Gaming Headphones',
        'Wireless Gaming Headphones',
        'Zebronics Gaming Headphones',
        'Logitech Gaming Headphones',
        'Ant Esports Gaming Headphones',
        'Cosmic Byte Gaming Headphones',
        'Lapcare Gaming Headphones',
        'Lenovo Legion Headphones',
        'HP Gaming Headphones',
        'iBall Stereo Headphones'
      ]
    },
    bottom: {
      title: 'Controllers / Gamepad',
      items: [
        'Wired Controllers',
        'Wireless Controllers',
        'Cosmic Byte Controllers',
        'Ant Esports Controllers',
        'Logitech Gamepad',
        'Zebronics Gamepad'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Mousepad',
      items: [
        'Popular : Medium Mousepad',
        'Popular : Large Mousepad',
        'Zebronics Gaming Mousepad',
        'Ant Esports Gaming Mousepad',
        'Cosmic Byte Gaming Mousepad',
        'Lapcare Gaming Mousepad',
        'ProDot Gaming Mousepad'
      ]
    },
    bottom: null
  }
];

// Exact Streaming Mega Menu featuring authorized partner brands
const STREAMING_MENU_COLUMNS = [
  {
    title: 'Webcam',
    items: [
      'Zebronics Webcam',
      'Logitech Webcam',
      'Lapcare HD Webcam',
      'HP Full HD Webcam',
      'Lenovo FHD Webcam',
      'Dell Pro Webcam',
      'iBall Face2Face Webcam',
      'View All'
    ]
  },
  {
    title: 'Microphones',
    items: [
      'Ant Esports Microphone',
      'Zebronics Microphone',
      'Cosmic Byte Microphone',
      'Logitech Microphone',
      'View All'
    ]
  },
  {
    title: 'Streaming Gear',
    items: [
      'Ant Esports Streaming Gear',
      'Zebronics Streaming Gear',
      'Cosmic Byte Gaming Gear',
      'Lapcare Streaming Accessories',
      'View All'
    ]
  },
  {
    title: 'Gaming & Streaming PC',
    items: [
      'Esports Gaming PC',
      'Casual Gaming PC',
      'AAA Gaming PC',
      'View All'
    ]
  }
];

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedCatalogCategory = 'all',
  buildCount = 0, 
  totalPrice = 0,
  _onOpenPresets = () => {},
  _onResetBuild = () => {},
  onOpenCart = () => {},
  _categories = [],
  onCategorySelect = () => {},
  searchQuery = '',
  setSearchQuery = () => {},
  onSearchSubmit = () => {}
}) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [pcBuildsMenuOpen, setPcBuildsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'gaming' | 'streaming' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGamingOpen, setMobileGamingOpen] = useState(false);
  const [mobileStreamingOpen, setMobileStreamingOpen] = useState(false);
  const [wishlistCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(() => 
    typeof window !== 'undefined' && localStorage.getItem('computercare_admin_auth') === 'true'
  );

  // Sync admin auth state when localStorage updates or modal logs in/out
  useEffect(() => {
    const syncAdminState = () => {
      setIsAdminActive(typeof window !== 'undefined' && localStorage.getItem('computercare_admin_auth') === 'true');
    };
    window.addEventListener('storage', syncAdminState);
    return () => window.removeEventListener('storage', syncAdminState);
  }, []);

  const formattedPrice = totalPrice > 0 
    ? `Rs. ${totalPrice.toLocaleString('en-IN')}` 
    : 'Rs. 0.00';

  const handleMegaItemClick = (item, groupTitle) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);

    let targetCategory = 'all';
    let filterQuery = '';

    if (groupTitle === 'Gaming Mouse') {
      targetCategory = 'gaming_mouse';
      if (item === 'Wired Mice (All Brands)' || item === 'Wired Gaming Mouse') {
        filterQuery = 'Wired';
      } else if (item === 'Wireless Gaming Mouse') {
        filterQuery = 'Wireless';
      } else {
        filterQuery = item.replace(/(Gaming|Wired|Optical|Desktop|Heavy Duty|Companion|Total Control)\s*Mouse/gi, '').replace(/\(All Brands\)/gi, '').replace(/CosmicByte/i, 'Cosmic Byte').trim();
      }
    } else if (groupTitle === 'Gaming Keyboard') {
      targetCategory = 'gaming_keyboard';
      if (item === 'Wired Keyboards (All Brands)' || item === 'Wired Gaming Keyboard') {
        filterQuery = 'Wired';
      } else if (item === 'Wireless Gaming Keyboard') {
        filterQuery = 'Wireless';
      } else {
        filterQuery = item.replace(/(Gaming|Wired|Mechanical)\s*Keyboard/gi, '').replace(/\(All Brands\)/gi, '').trim();
      }
    } else if (groupTitle === 'Gaming Headphones') {
      targetCategory = 'gaming_headset';
      if (item === 'Wired Gaming Headphones') filterQuery = 'Wired';
      else if (item === 'Wireless Gaming Headphones') filterQuery = 'Wireless';
      else filterQuery = item.replace(/Gaming Headphones/i, '').replace(/CosmicByte/i, 'Cosmic Byte').trim();
    } else if (groupTitle === 'Gaming Mousepad') {
      targetCategory = 'gaming_mousepad';
      if (item.includes('Medium')) filterQuery = 'Medium';
      else if (item.includes('Large')) filterQuery = 'Large';
      else filterQuery = item.replace(/Popular\s*:\s*/i, '').replace(/Gaming Mousepad/i, '').replace(/CosmicByte/i, 'Cosmic Byte').trim();
    } else if (groupTitle === 'Gaming Chair') {
      targetCategory = 'gaming_chair';
      filterQuery = item.replace(/Gaming Chair/i, '').trim();
    } else if (groupTitle === 'Controllers / Gamepad') {
      targetCategory = 'gaming_controller';
      if (item === 'Wired Controllers') filterQuery = 'Wired';
      else if (item === 'Wireless Controllers') filterQuery = 'Wireless';
      else filterQuery = item.replace(/Controllers/i, '').trim();
    } else if (groupTitle === 'Gaming PC' || groupTitle === 'Gaming & Streaming PC') {
      targetCategory = 'gaming_pc';
      if (item === 'AAA Gaming PC') filterQuery = 'AAA';
      else if (item === 'Casual Gaming PC') filterQuery = 'Casual';
      else if (item === 'Esports Gaming PC') filterQuery = 'Esports';
      else filterQuery = '';
    } else if (groupTitle === 'Webcam') {
      targetCategory = 'webcam';
      filterQuery = item === 'View All' ? '' : item.replace(/Webcam/i, '').trim();
    } else if (groupTitle === 'Microphones') {
      targetCategory = 'microphone';
      filterQuery = item === 'View All' ? '' : item.replace(/Microphone(s)?/i, '').trim();
    } else if (groupTitle === 'Streaming Gear' || groupTitle === 'Elgato') {
      targetCategory = 'elgato';
      if (item === 'Elgato Capture Card') filterQuery = 'Capture';
      else if (item === 'Elgato Streamdeck') filterQuery = 'Stream';
      else if (item === 'Elgato Lights') filterQuery = 'Light';
      else if (item === 'Elgato Teleprompter') filterQuery = 'Teleprompter';
      else if (item === 'Elgato Green Screen') filterQuery = 'Green Screen';
      else if (item === 'Elgato Mounting') filterQuery = 'Mount';
      else filterQuery = item.replace(/Elgato/i, '').trim();
    }

    if (filterQuery === 'View All' || filterQuery.toLowerCase() === 'all') {
      filterQuery = '';
    }

    setSearchQuery(filterQuery);
    onCategorySelect(targetCategory);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs select-none">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full border-b border-slate-200/80 bg-white text-slate-600 text-[11px] sm:text-[12px] font-sans py-1.5 px-3 sm:px-5 lg:px-8">
        <div className="max-w-[1536px] w-full mx-auto flex items-center justify-between gap-2 overflow-x-hidden">
          {/* Left Announcement & Quick Links */}
          <div className="flex items-center gap-2 sm:gap-2.5 font-normal text-slate-700 tracking-tight min-w-0">
            <span className="hidden lg:inline text-slate-500 truncate">Your one stop destination for all your Computer needs!</span>
            <span className="text-slate-300 hidden lg:inline">•</span>
            
            {/* Custom PC Builder (Hidden on mobile < sm to guarantee zero collision) */}
            <a
              href="/builder"
              onClick={(e) => { e.preventDefault(); setActiveTab('builder'); }}
              className="hidden sm:inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer flex-shrink-0"
              title="3D Custom PC Builder"
            >
              <Box className="w-3.5 h-3.5 text-blue-600" />
              <span>Build Custom PC</span>
              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold hidden md:inline">CONFIGURATOR</span>
            </a>
            
            <span className="text-slate-300 hidden sm:inline">•</span>

            {/* Bulk Order B2B Link */}
            <a
              href="/bulk-order"
              onClick={(e) => { e.preventDefault(); setActiveTab('bulk-order'); }}
              className="inline-flex items-center gap-1.5 text-slate-800 hover:text-amber-800 font-bold transition-colors cursor-pointer flex-shrink-0"
              title="Bulk Hardware Orders & B2B Procurement"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Bulk Order</span>
              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold leading-none">
                B2B
              </span>
            </a>
          </div>

          {/* Right Contact Info */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-slate-700 font-normal flex-shrink-0 text-[11px] sm:text-xs">
            {/* Helpline Phone */}
            <a 
              href="tel:+919810550222" 
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
              title="Call Store Helpline: +91 9810550222"
            >
              <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="text-slate-500 hidden xs:inline">Helpline:</span>
              <span className="text-slate-900 font-bold font-mono tracking-tight whitespace-nowrap">+91 9810550222</span>
            </a>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Email Contact */}
            <a 
              href="mailto:contact@computercare.in"
              className="hover:text-blue-600 transition-colors hidden sm:inline-flex items-center gap-1 text-slate-600"
              title="Email Computer Care Support Desk"
            >
              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-800 font-medium">contact@computercare.in</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search Bar, Account / Wishlist / Cart) */}
      <div className="max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Logo: COMPUTER CARE */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer flex-shrink-0 group"
          title="Computer Care Home"
        >
          {/* Official Computer Care Brand Logo Mark */}
          <div className="flex items-center">
            <img 
              src="/favicon-32x32.png" 
              alt="Computer Care CC Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-black p-0.5 shadow-sm border border-slate-800/20" 
            />
            <div className="flex flex-col ml-1 sm:ml-1.5">
              <span className="font-black font-display text-[16px] sm:text-[20px] lg:text-[22px] tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors leading-none uppercase">
                COMPUTERCARE.COM
              </span>
              <span className="text-[7.5px] sm:text-[9px] font-mono tracking-widest text-slate-400 uppercase font-semibold leading-none mt-0.5 sm:mt-1">
                GENUINE HARDWARE STORE
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Bar with All Categories dropdown and Blue Search button (Screens >= lg) */}
        <search role="search" className="hidden lg:flex items-center flex-1 max-w-xl min-w-0 mx-2">
          <form 
            onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
            className="w-full h-[40px] flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-2xs hover:border-slate-400 focus-within:border-blue-600 transition-colors"
          >
            {/* Category selection dropdown inside search bar */}
            <div className="relative flex items-center pl-2.5 pr-1.5 text-slate-700 bg-transparent flex-shrink-0">
              <select
                value={activeTab === 'catalog' ? selectedCatalogCategory : 'all'}
                onChange={(e) => {
                  onCategorySelect(e.target.value);
                }}
                className="text-xs font-sans text-slate-800 bg-transparent py-2 pr-5 focus:outline-none cursor-pointer appearance-none font-medium max-w-[115px] xl:max-w-[145px] truncate"
              >
                <option value="all">All Categories</option>
                <option value="case">PC Cabinets (340+)</option>
                <option value="case_fan">Cabinet Cooling Fans (130+)</option>
                <option value="gpu">Graphics Cards (371+)</option>
                <option value="cpu">Processors (327+)</option>
                <option value="motherboard">Motherboards (200+)</option>
                <option value="ram">Memory / RAM (661+)</option>
                <option value="storage">Storage SSD (194+)</option>
                <option value="cooler">Coolers & AIO (240+)</option>
                <option value="psu">Power Supplies (155+)</option>
                <option value="monitor">Gaming Monitors (280+)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Subtle vertical separator */}
            <div className="h-5 w-px bg-slate-300 mx-1 flex-shrink-0" />

            {/* Input field */}
            <input
              type="text"
              placeholder="Search for products ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />

            {/* Royal Blue Search Button */}
            <button
              type="submit"
              className="bg-[#2b38d1] hover:bg-[#202bb8] text-white px-4 sm:px-6 h-full text-xs font-semibold transition-colors flex items-center justify-center tracking-wide flex-shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </search>

        {/* Right User Actions: Custom PC Builder, Login / Account, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 xl:gap-5 flex-shrink-0">
          {/* Full Custom PC Builder Pill Button (Screens >= 1280px) */}
          <button
            onClick={() => setActiveTab('builder')}
            className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-left group ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50/80 hover:bg-blue-100 text-blue-900 border-blue-200/90'
            }`}
            title="Open Custom PC Builder"
          >
            <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
              activeTab === 'builder' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white group-hover:bg-blue-700'
            }`}>
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold font-display uppercase tracking-tight">
                  Custom PC Builder
                </span>
                <span className="bg-[#e11d48] text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                  BUILDER
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono leading-none mt-1">
                {buildCount > 0 ? `${buildCount} Parts in Rig` : 'Configure Rig'}
              </div>
            </div>
          </button>

          {/* Compact PC Builder Pill for Tablet / Mid Laptops (md to lg) */}
          <button
            onClick={() => setActiveTab('builder')}
            className={`hidden md:flex xl:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-left group ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50/80 hover:bg-blue-100 text-blue-900 border-blue-200/90'
            }`}
            title="Open Custom PC Builder"
          >
            <Box className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
            <span className="text-xs font-bold font-display uppercase tracking-tight">PC Builder</span>
            {buildCount > 0 && (
              <span className="bg-[#e11d48] text-white text-[9px] font-bold px-1 rounded font-mono">
                {buildCount}
              </span>
            )}
          </button>

          {/* 1. Login / Account */}
          <button 
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer group bg-transparent border-none p-0 text-left focus:outline-none flex-shrink-0"
            title={isAdminActive ? "Admin Session Active - Click to Manage" : "Login to Account / Admin Portal"}
          >
            <div className="relative">
              <User className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px] text-slate-800 group-hover:text-blue-600 transition-colors stroke-[1.8]" />
              {isAdminActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            <div className="text-left select-none hidden lg:block">
              <span className={`text-[10px] block leading-tight ${isAdminActive ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                {isAdminActive ? 'Admin' : 'Login'}
              </span>
              <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block leading-tight">
                Account
              </span>
            </div>
          </button>

          {/* 2. Wishlist */}
          <button 
            type="button"
            onClick={() => onCategorySelect('all')}
            className="flex items-center gap-1 cursor-pointer relative group bg-transparent border-none p-1 focus:outline-none flex-shrink-0"
            title="Wishlist (0 items) - Click to browse hardware catalog"
          >
            <div className="relative">
              <Heart className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px] text-slate-800 group-hover:text-red-500 transition-colors stroke-[1.8]" />
              <span className="absolute -top-1.5 -right-2 bg-[#e11d48] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            </div>
          </button>

          {/* 3. Shopping Cart (Always in view, zero overflow) */}
          <button 
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 cursor-pointer group bg-transparent border-none p-1 sm:p-0 text-left focus:outline-none flex-shrink-0 whitespace-nowrap"
            title="View Shopping Cart"
          >
            <div className="relative flex-shrink-0">
              <ShoppingCart className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px] text-slate-800 group-hover:text-blue-600 transition-colors stroke-[1.8]" />
              <span className="absolute -top-1.5 -right-2.5 bg-[#e11d48] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {buildCount}
              </span>
            </div>
            <div className="text-left select-none flex-shrink-0 hidden sm:block">
              <span className="text-[10px] text-slate-500 block leading-tight">Your Cart</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors block leading-tight font-sans">
                {formattedPrice}
              </span>
            </div>
          </button>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-black rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2b. MOBILE SEARCH BAR (Visible on < lg, below logo row) */}
      <search role="search" className="lg:hidden w-full px-3 sm:px-5 pb-2.5 pt-0.5 border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          className="w-full h-[38px] flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs focus-within:border-blue-600 transition-colors"
        >
          <input
            type="text"
            placeholder="Search 3,200+ PC components, rigs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-0 flex-1 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#2b38d1] hover:bg-[#202bb8] text-white px-3.5 h-full text-xs font-semibold flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>
      </search>

      {/* 3. BOTTOM NAVIGATION BAR (Desktop & Laptop >= lg) */}
      <nav 
        className="hidden lg:block w-full border-t border-b border-slate-200/90 bg-white relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-[1536px] w-full mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between h-[44px]">
          {/* Left: Browse All Categories (Dropdown Trigger) */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setActiveMegaMenu(null);
              }}
              className="flex items-center gap-2 text-slate-900 hover:text-blue-600 font-bold text-xs sm:text-sm tracking-tight transition-colors py-2 pr-4 focus:outline-none"
            >
              <Menu className="w-4 h-4 text-slate-900" />
              <span>Browse All Categories</span>
            </button>

            {/* All Categories Mega Dropdown Menu */}
            {categoryDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 divide-y divide-slate-100 py-1.5"
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_pc'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span className="font-bold text-blue-700">Pre-Built Gaming PCs</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">50+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_mouse'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Gaming Mice</span>
                  <span className="text-[10px] text-slate-400 font-mono">50+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_keyboard'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Gaming Keyboards</span>
                  <span className="text-[10px] text-slate-400 font-mono">50+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_headset'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Gaming Headphones</span>
                  <span className="text-[10px] text-slate-400 font-mono">50+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('elgato'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Elgato Stream Gear</span>
                  <span className="text-[10px] text-slate-400 font-mono">40+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('webcam'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Webcams (FHD & 4K)</span>
                  <span className="text-[10px] text-slate-400 font-mono">30+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('microphone'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Microphones & Audio</span>
                  <span className="text-[10px] text-slate-400 font-mono">30+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_chair'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Gaming Chairs</span>
                  <span className="text-[10px] text-slate-400 font-mono">30+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gaming_controller'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Controllers / Gamepad</span>
                  <span className="text-[10px] text-slate-400 font-mono">30+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('case'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>PC Cabinets (Chassis)</span>
                  <span className="text-[10px] text-slate-400 font-mono">340+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('case_fan'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Cabinet Fans (120mm/140mm)</span>
                  <span className="text-[10px] text-slate-400 font-mono">130+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('gpu'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Graphics Cards</span>
                  <span className="text-[10px] text-slate-400 font-mono">371+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('cpu'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Processors (CPUs)</span>
                  <span className="text-[10px] text-slate-400 font-mono">327+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('motherboard'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Motherboards</span>
                  <span className="text-[10px] text-slate-400 font-mono">200+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('ram'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Memory (RAM)</span>
                  <span className="text-[10px] text-slate-400 font-mono">661+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('storage'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Storage (M.2 NVMe SSD)</span>
                  <span className="text-[10px] text-slate-400 font-mono">194+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('psu'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Power Supplies (PSU)</span>
                  <span className="text-[10px] text-slate-400 font-mono">149+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('cooler'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Coolers & Liquid AIO</span>
                  <span className="text-[10px] text-slate-400 font-mono">234+</span>
                </button>
                <button 
                  onClick={() => { setCategoryDropdownOpen(false); onCategorySelect('monitor'); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Gaming Monitors</span>
                  <span className="text-[10px] text-slate-400 font-mono">276+</span>
                </button>
              </div>
            )}
          </div>

          {/* Center Links (Home, Gaming ⌵, Streaming ⌵, Components ⌵, PC Builds ⌵, Monitors ⌵, Custom PC Quote, Pre-Built PCs, Bulk Order) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-5 text-[11px] xl:text-[13px] font-medium text-slate-700 whitespace-nowrap">
            {/* Home */}
            <button
              onClick={() => { setActiveTab('home'); setActiveMegaMenu(null); }}
              className={`hover:text-blue-600 transition-colors ${
                activeTab === 'home' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </button>

            {/* Gaming ⌵ (With Mega Menu) */}
            <div 
              className="relative py-2.5"
              onMouseEnter={() => { setActiveMegaMenu('gaming'); setCategoryDropdownOpen(false); setPcBuildsMenuOpen(false); }}
            >
              <button 
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'gaming' ? null : 'gaming')}
                className={`flex items-center gap-1 transition-colors ${
                  activeMegaMenu === 'gaming' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                }`}
              >
                <span>Gaming</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                  activeMegaMenu === 'gaming' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`} />
              </button>
            </div>

            {/* Streaming ⌵ (With Mega Menu) */}
            <div 
              className="relative py-2.5"
              onMouseEnter={() => { setActiveMegaMenu('streaming'); setCategoryDropdownOpen(false); setPcBuildsMenuOpen(false); }}
            >
              <button 
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'streaming' ? null : 'streaming')}
                className={`flex items-center gap-1 transition-colors ${
                  activeMegaMenu === 'streaming' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                }`}
              >
                <span>Streaming</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                  activeMegaMenu === 'streaming' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`} />
              </button>
            </div>

            {/* Components ⌵ */}
            <button 
              onClick={() => { onCategorySelect('all'); setActiveMegaMenu(null); }}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                activeTab === 'catalog' && selectedCatalogCategory === 'all' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Components</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* PC Builds ⌵ Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  setPcBuildsMenuOpen(!pcBuildsMenuOpen);
                  setActiveMegaMenu(null);
                }}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors py-1"
              >
                <span>PC Builds</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {pcBuildsMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-1.5 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-1.5 flex flex-col gap-1"
                  onMouseLeave={() => setPcBuildsMenuOpen(false)}
                >
                  <button
                    onClick={() => { setActiveTab('builder'); setPcBuildsMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center gap-2.5 group transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5">
                        <span>Custom PC Builder</span>
                        <span className="bg-[#e11d48] text-white text-[8px] font-bold px-1 rounded font-mono">RIG</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Configure parts with live compatibility checks
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { 
                      onCategorySelect('gaming_pc'); 
                      setSearchQuery('');
                      setPcBuildsMenuOpen(false); 
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-amber-50 flex items-center gap-2.5 group transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                        Pre-Built Desktop & Gaming PCs
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Ready-to-ship budget, office & gaming PCs
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Monitors ⌵ */}
            <button 
              onClick={() => { onCategorySelect('monitor'); setActiveMegaMenu(null); }}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                activeTab === 'catalog' && selectedCatalogCategory === 'monitor' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Monitors</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Custom PC Quote (Links to 3D Custom PC Builder) */}
            <button 
              onClick={() => { setActiveTab('builder'); setActiveMegaMenu(null); }}
              className={`hover:text-blue-600 transition-colors ${
                activeTab === 'builder' ? 'text-blue-600 font-semibold' : ''
              }`}
              title="Build Custom PC / Get Instant Quote"
            >
              Custom PC Quote
            </button>

            {/* Bulk Order (B2B) */}
            <button 
              onClick={() => { setActiveTab('bulk-order'); setActiveMegaMenu(null); }}
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${
                activeTab === 'bulk-order' ? 'text-blue-600 font-semibold' : ''
              }`}
              title="Bulk Orders & Corporate B2B Quotations"
            >
              <span>Bulk Order</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded font-mono">
                B2B
              </span>
            </button>

            {/* Pre-Built PCs */}
            <a 
              href="/catalog/gaming_pc"
              onClick={(e) => { 
                e.preventDefault();
                onCategorySelect('gaming_pc'); 
                setSearchQuery('');
                setActiveMegaMenu(null); 
              }}
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 font-medium ${
                activeTab === 'catalog' && selectedCatalogCategory === 'gaming_pc' ? 'text-blue-600 font-semibold' : ''
              }`}
              title="Browse Pre-Built Desktop & Gaming PCs"
            >
              <span>Pre-Built PCs</span>
              <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.2 rounded font-mono">
                HOT
              </span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GAMING MEGA MENU (Pixel-Matched to Computer Care Screenshot) */}
        {/* ========================================================================= */}
        {activeMegaMenu === 'gaming' && (
          <div 
            className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-slate-100 border-b border-slate-200 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={() => setActiveMegaMenu('gaming')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-7 pb-10">
              <div className="grid grid-cols-4 gap-x-12 gap-y-8">
                {GAMING_MENU_COLUMNS.map((col, idx) => (
                  <div key={idx} className="flex flex-col">
                    {/* Top Group */}
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 mb-3.5 tracking-tight">
                        {col.top.title}
                      </h4>
                      <ul className="space-y-1">
                        {col.top.items.map((item, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => handleMegaItemClick(item, col.top.title)}
                              className="text-[13px] text-slate-600 hover:text-blue-600 transition-colors py-[3px] text-left block w-full leading-relaxed"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Group (if present) */}
                    {col.bottom && (
                      <div className="mt-8">
                        <h4 className="text-[14px] font-bold text-slate-900 mb-3.5 tracking-tight">
                          {col.bottom.title}
                        </h4>
                        <ul className="space-y-1">
                          {col.bottom.items.map((item, i) => (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => handleMegaItemClick(item, col.bottom.title)}
                                className="text-[13px] text-slate-600 hover:text-blue-600 transition-colors py-[3px] text-left block w-full leading-relaxed"
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STREAMING MEGA MENU (Pixel-Matched to Computer Care Screenshot) */}
        {/* ========================================================================= */}
        {activeMegaMenu === 'streaming' && (
          <div 
            className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-slate-100 border-b border-slate-200 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={() => setActiveMegaMenu('streaming')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-7 pb-10">
              <div className="grid grid-cols-4 gap-x-12 gap-y-8">
                {STREAMING_MENU_COLUMNS.map((col, idx) => (
                  <div key={idx} className="flex flex-col">
                    <h4 className="text-[14px] font-bold text-slate-900 mb-3.5 tracking-tight">
                      {col.title}
                    </h4>
                    <ul className="space-y-1">
                      {col.items.map((item, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => handleMegaItemClick(item, col.title)}
                            className="text-[13px] text-slate-600 hover:text-blue-600 transition-colors py-[3px] text-left block w-full leading-relaxed"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Off-Canvas Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content sliding from right */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-brand-navy text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span className="font-display font-black text-sm uppercase tracking-wide">
                  COMPUTER CARE STORE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Quick Configurator CTA */}
              <button
                onClick={() => { setActiveTab('builder'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  <span>Custom PC Builder</span>
                </div>
                <span className="text-[10px] bg-[#e11d48] text-white px-2 py-0.5 rounded font-mono font-bold">CONFIGURATOR</span>
              </button>

              {/* Bulk Order CTA */}
              <button
                onClick={() => { setActiveTab('bulk-order'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 font-bold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-between border border-amber-300 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-amber-900">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Bulk Order & B2B Quotes</span>
                </div>
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded font-mono font-bold">B2B</span>
              </button>

              {/* Pre-Built PCs CTA */}
              <a
                href="/catalog/gaming_pc"
                onClick={(e) => { 
                  e.preventDefault();
                  onCategorySelect('gaming_pc'); 
                  setSearchQuery(''); 
                  setMobileMenuOpen(false); 
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between font-bold text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pre-Built Gaming PCs</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded font-mono">HOT</span>
              </a>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 text-sm font-medium text-slate-800 pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  Home
                </button>

                {/* Mobile Gaming Accordion */}
                <div className="border-b border-slate-100 pb-1">
                  <button
                    type="button"
                    onClick={() => setMobileGamingOpen(!mobileGamingOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-medium hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <span>Gaming Hardware & Peripherals</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileGamingOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {mobileGamingOpen && (
                    <div className="pl-4 pr-2 py-2 grid grid-cols-2 gap-3 bg-slate-50 rounded-lg text-xs">
                      {GAMING_MENU_COLUMNS.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 mt-1">{col.top.title}</span>
                          {col.top.items.slice(0, 4).map((it, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleMegaItemClick(it, col.top.title)}
                              className="text-left text-slate-600 hover:text-blue-600 py-0.5 truncate cursor-pointer"
                            >
                              {it}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Streaming Accordion */}
                <div className="border-b border-slate-100 pb-1">
                  <button
                    type="button"
                    onClick={() => setMobileStreamingOpen(!mobileStreamingOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-medium hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <span>Streaming Gear & Elgato</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileStreamingOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {mobileStreamingOpen && (
                    <div className="pl-4 pr-2 py-2 grid grid-cols-2 gap-3 bg-slate-50 rounded-lg text-xs">
                      {STREAMING_MENU_COLUMNS.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 mt-1">{col.title}</span>
                          {col.items.slice(0, 4).map((it, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleMegaItemClick(it, col.title)}
                              className="text-left text-slate-600 hover:text-blue-600 py-0.5 truncate cursor-pointer"
                            >
                              {it}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { onCategorySelect('all'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  Components (All 3,200+ Products)
                </button>
                <button
                  onClick={() => { onCategorySelect('case'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  PC Cabinets & Cases (340+)
                </button>
                <button
                  onClick={() => { onCategorySelect('gpu'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  Graphics Cards (RTX 40 / 50 & Radeon)
                </button>
                <button
                  onClick={() => { onCategorySelect('monitor'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  Gaming Monitors (High-Refresh)
                </button>
              </div>

              {/* Direct Help in Drawer */}
              <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Direct Store Helpline
                </span>
                <a
                  href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20need%20help%20with%20a%20PC%20build"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold flex items-center justify-between"
                >
                  <span>Chat on WhatsApp</span>
                  <span className="font-mono text-[11px]">+91 9810550222</span>
                </a>
                <a
                  href="tel:9810550222"
                  className="px-3 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-between"
                >
                  <span>Call Support Desk</span>
                  <span className="font-mono text-[11px]">+91 9810550222</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {/* Admin / Account Login Modal */}
      <AdminLoginModal
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
      />
    </header>
  );
}
