import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Info, 
  X 
} from 'lucide-react';

const CATEGORY_TABS = [
  { key: 'all', label: 'All Products' },
  { key: 'gaming_pc', label: 'Pre-Built Gaming PCs' },
  { key: 'gaming_mouse', label: 'Gaming Mice' },
  { key: 'gaming_keyboard', label: 'Keyboards (Wired & Mechanical)' },
  { key: 'gaming_headset', label: 'Gaming Headphones' },
  { key: 'gaming_mousepad', label: 'Gaming Mousepads' },
  { key: 'gaming_chair', label: 'Gaming Chairs' },
  { key: 'gaming_controller', label: 'Controllers & Gamepads' },
  { key: 'webcam', label: 'Webcams' },
  { key: 'microphone', label: 'Microphones' },
  { key: 'elgato', label: 'Elgato Stream Gear' },
  { key: 'case', label: 'PC Cabinets' },
  { key: 'case_fan', label: 'Cabinet Fans' },
  { key: 'gpu', label: 'Graphics Cards' },
  { key: 'cpu', label: 'Processors' },
  { key: 'motherboard', label: 'Motherboards' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'storage', label: 'Storage (SSD & HDD)' },
  { key: 'cooler', label: 'Coolers & Liquid AIO' },
  { key: 'psu', label: 'Power Supplies (PSU)' },
  { key: 'monitor', label: 'Gaming Monitors' },
];

const CATEGORY_TITLE_MAP = {
  all: 'ALL HARDWARE & GEAR',
  gaming_pc: 'PRE-BUILT GAMING PCS',
  gaming_mouse: 'GAMING MICE',
  gaming_keyboard: 'KEYBOARDS (WIRED & MECHANICAL)',
  gaming_headset: 'GAMING HEADPHONES',
  gaming_mousepad: 'GAMING MOUSEPADS',
  gaming_chair: 'GAMING CHAIRS',
  gaming_controller: 'CONTROLLERS & GAMEPADS',
  webcam: 'STREAMING WEBCAMS',
  microphone: 'STUDIO & GAMING MICROPHONES',
  elgato: 'ELGATO STREAM ECOSYSTEM',
  case: 'PC CABINETS STORE',
  case_fan: 'CABINET COOLING FANS',
  gpu: 'GRAPHICS CARDS STORE',
  cpu: 'PROCESSORS (CPUs)',
  motherboard: 'MOTHERBOARDS STORE',
  ram: 'MEMORY (RAM) STORE',
  storage: 'STORAGE (M.2 NVMe & SSD)',
  cooler: 'CPU COOLERS & LIQUID AIO',
  psu: 'POWER SUPPLIES (PSU)',
  monitor: 'GAMING MONITORS'
};

const CABINET_KINDS = [
  { id: 'ALL', label: 'All Cabinets' },
  { id: 'panoramic', label: '🪟 Panoramic Dual-Chamber Glass' },
  { id: 'mesh', label: '💨 High-Airflow Mesh' },
  { id: 'full', label: '🏢 Full Tower' },
  { id: 'matx', label: '📦 Compact Micro-ATX' },
  { id: 'white', label: '⚪ White Edition' },
  { id: 'black', label: '⚫ Black Edition' },
];

const FAN_KINDS = [
  { id: 'ALL', label: 'All Fans' },
  { id: '120mm', label: '💨 120mm Fans' },
  { id: '140mm', label: '💨 140mm Fans' },
  { id: 'argb', label: '🌈 ARGB / RGB' },
  { id: 'triple', label: '📦 Triple Pack (3-in-1)' },
  { id: 'white', label: '⚪ White Edition' },
  { id: 'black', label: '⚫ Black Edition' },
];

export default function CatalogView({ 
  catalog = {}, 
  build = {}, 
  selectedCategory = 'all',
  onSelectCategory,
  onSelectComponent, 
  onViewDetails,
  searchQuery = '',
  setSearchQuery = () => {}
}) {
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCabinetKind, setSelectedCabinetKind] = useState('ALL');
  const [selectedFanKind, setSelectedFanKind] = useState('ALL');
  const [sortBy, setSortBy] = useState('price_asc');
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 32;

  // Flatten all products or filter by active category
  const allProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      let merged = [];
      Object.entries(catalog).forEach(([, list]) => {
        if (Array.isArray(list)) merged = merged.concat(list);
      });
      return merged;
    }
    return catalog[selectedCategory] || [];
  }, [catalog, selectedCategory]);

  // Extract unique brands for current list
  const brands = useMemo(() => {
    const bSet = new Set();
    allProducts.forEach(p => {
      if (p.vendor) bSet.add(p.vendor);
    });
    return ['ALL', ...Array.from(bSet).sort()];
  }, [allProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesVendor = p.vendor?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q));
        const matchesSpecs = p.specs && JSON.stringify(p.specs).toLowerCase().includes(q);
        if (!matchesTitle && !matchesVendor && !matchesDesc && !matchesTags && !matchesSpecs) return false;
      }
      if (selectedBrand !== 'ALL' && p.vendor !== selectedBrand) {
        return false;
      }

      // Strict safety: In Cabinet section, strictly NEVER show cabinet fans or sub-₹2,000 fan items
      if (selectedCategory === 'case') {
        const title = (p.title || "").toLowerCase();
        if (
          title.includes(' fan') || 
          title.includes('cooling fan') || 
          title.includes('cabinet fan') || 
          title.includes('case fan') || 
          title.includes('single pack') || 
          title.includes('triple pack') || 
          title.includes('120mm') || 
          title.includes('140mm') ||
          p.price < 2000
        ) {
          return false;
        }
      }

      // Specialized Cabinet Kinds filter
      if (selectedCategory === 'case' && selectedCabinetKind !== 'ALL') {
        const style = (p.specs?.cabinet_style || "").toLowerCase();
        const form = (p.specs?.form_factor || "").toLowerCase();
        const color = (p.specs?.color || "").toLowerCase();
        const title = (p.title || "").toLowerCase();

        if (selectedCabinetKind === 'panoramic') {
          if (!style.includes('panoramic') && !title.includes('o11') && !title.includes('vision') && !title.includes('crystal') && !title.includes('king 95') && !title.includes('ch780')) return false;
        } else if (selectedCabinetKind === 'mesh') {
          if (!style.includes('mesh') && !title.includes('mesh') && !title.includes('airflow') && !title.includes('air') && !title.includes('td500') && !title.includes('4000d')) return false;
        } else if (selectedCabinetKind === 'full') {
          if (!form.includes('full') && !title.includes('full') && !title.includes('xl') && !title.includes('7000')) return false;
        } else if (selectedCabinetKind === 'matx') {
          if (!form.includes('micro') && !form.includes('mini') && !title.includes('matx') && !title.includes('mini') && !title.includes('2500d')) return false;
        } else if (selectedCabinetKind === 'white') {
          if (color !== 'white' && !title.includes('white')) return false;
        } else if (selectedCabinetKind === 'black') {
          if (color !== 'black' && !title.includes('black')) return false;
        }
      }

      // Dedicated Cabinet Fans Filter
      if (selectedCategory === 'case_fan' && selectedFanKind !== 'ALL') {
        const title = (p.title || "").toLowerCase();
        const specs = p.specs || {};
        if (selectedFanKind === '120mm' && !title.includes('120mm') && specs.fan_size !== '120mm') return false;
        if (selectedFanKind === '140mm' && !title.includes('140mm') && specs.fan_size !== '140mm') return false;
        if (selectedFanKind === 'argb' && !title.includes('argb') && !title.includes('rgb') && specs.lighting === 'Non-RGB') return false;
        if (selectedFanKind === 'triple' && !title.includes('triple') && !title.includes('3 in 1') && !title.includes('pack of 3') && !title.includes('3-in-1')) return false;
        if (selectedFanKind === 'white' && !title.includes('white')) return false;
        if (selectedFanKind === 'black' && !title.includes('black')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [allProducts, searchQuery, selectedBrand, selectedCabinetKind, selectedFanKind, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

  return (
    <div className="w-full flex flex-col gap-6 pb-16">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-elite-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-elite-navy text-white">
              COMPUTER CARE HARDWARE CATALOG
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredProducts.length} Genuine Products Listed
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-elite-navy tracking-tight">
            {CATEGORY_TITLE_MAP[selectedCategory] || 'HARDWARE & GEAR STORE'}
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog by model or brand..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPageNumber(1); }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-elite-blue"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Search / Category Filter Banner */}
      {searchQuery && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-slate-500 font-medium">Filtering by:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-2xs">
            <span>"{searchQuery}"</span>
            <button
              onClick={() => { setSearchQuery(''); setPageNumber(1); }}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              title="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <button
            onClick={() => { setSearchQuery(''); setPageNumber(1); }}
            className="text-xs text-slate-400 hover:text-blue-600 underline transition-colors"
          >
            Show All in {CATEGORY_TITLE_MAP[selectedCategory] || 'Category'}
          </button>
        </div>
      )}

      {/* Specialized Cabinet Kinds Filter Strip if category is case */}
      {selectedCategory === 'case' && (
        <div className="bg-white rounded-xl border border-elite-border p-3 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
          <span className="text-xs font-bold text-elite-navy uppercase font-display mr-1 whitespace-nowrap">
            Cabinet Styles:
          </span>
          {CABINET_KINDS.map(kind => (
            <button
              key={kind.id}
              onClick={() => { setSelectedCabinetKind(kind.id); setPageNumber(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all border ${
                selectedCabinetKind === kind.id
                  ? 'bg-elite-blue text-white font-bold border-elite-blue shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 font-medium'
              }`}
            >
              {kind.label}
            </button>
          ))}
        </div>
      )}

      {/* Specialized Fan Kinds Filter Strip if category is case_fan */}
      {selectedCategory === 'case_fan' && (
        <div className="bg-white rounded-xl border border-elite-border p-3 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
          <span className="text-xs font-bold text-elite-navy uppercase font-display mr-1 whitespace-nowrap">
            Fan Types:
          </span>
          {FAN_KINDS.map(kind => (
            <button
              key={kind.id}
              onClick={() => { setSelectedFanKind(kind.id); setPageNumber(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all border ${
                selectedFanKind === kind.id
                  ? 'bg-elite-blue text-white font-bold border-elite-blue shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 font-medium'
              }`}
            >
              {kind.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Categories Card */}
          <div className="bg-white rounded-xl border border-elite-border p-4 shadow-sm">
            <h3 className="font-display font-bold uppercase text-xs text-elite-navy border-b border-slate-100 pb-2 mb-2">
              Categories
            </h3>
            <div className="flex flex-col gap-1 text-xs">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { 
                    onSelectCategory(tab.key); 
                    setPageNumber(1); 
                    setSelectedBrand('ALL'); 
                    setSelectedCabinetKind('ALL'); 
                    setSelectedFanKind('ALL'); 
                  }}
                  className={`text-left px-3 py-2 rounded-lg transition-colors font-medium flex items-center justify-between ${
                    selectedCategory === tab.key
                      ? 'bg-elite-blue text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono ${selectedCategory === tab.key ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.key === 'all' ? '4,300+' : (catalog[tab.key]?.length || 0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter Card */}
          {brands.length > 2 && (
            <div className="bg-white rounded-xl border border-elite-border p-4 shadow-sm">
              <h3 className="font-display font-bold uppercase text-xs text-elite-navy border-b border-slate-100 pb-2 mb-2">
                Brands & Vendors
              </h3>
              <div className="max-h-56 overflow-y-auto flex flex-col gap-1 text-xs pr-1">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => { setSelectedBrand(b); setPageNumber(1); }}
                    className={`text-left px-2.5 py-1.5 rounded transition-colors ${
                      selectedBrand === b 
                        ? 'bg-slate-100 text-elite-blue font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b === 'ALL' ? 'All Brands' : b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Products Section */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-elite-border shadow-sm flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">
              Showing <strong className="text-slate-800">{paginatedProducts.length}</strong> of <strong className="text-slate-800">{filteredProducts.length}</strong> {selectedCategory === 'case' ? 'cabinets' : 'products'}
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((p) => {
              const isSelected = build[p.category]?.id === p.id;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-elite-border hover:border-elite-blue hover:shadow-elite-hover p-3.5 flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Image */}
                    <div 
                      className="relative w-full h-44 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 mb-2.5 cursor-pointer"
                      onClick={() => onViewDetails(p)}
                    >
                      <img
                        src={p.image || p.cdn_image}
                        alt={p.title}
                        onError={(e) => {
                          if (p.cdn_image && e.target.src !== p.cdn_image) {
                            e.target.src = p.cdn_image;
                          }
                        }}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />

                      <span className="absolute top-1.5 left-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">
                        {p.vendor}
                      </span>

                      {p.compare_at_price > p.price && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-elite-red text-white shadow-sm">
                          {Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-blue-50 text-elite-blue">
                        {p.category}
                      </span>
                      {p.specs?.cabinet_style && (
                        <span className="text-[10px] font-sans font-semibold text-slate-600">
                          {p.specs.cabinet_style}
                        </span>
                      )}
                    </div>

                    <h3 
                      className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-elite-blue cursor-pointer transition-colors"
                      onClick={() => onViewDetails(p)}
                      title={p.title}
                    >
                      {p.title}
                    </h3>

                    {p.specs?.color && (
                      <div className="mt-1 text-[11px] text-slate-500 font-sans">
                        Color: <strong className="text-slate-700">{p.specs.color}</strong> • {p.specs.form_factor || "Mid Tower"}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-sm text-elite-navy">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.compare_at_price > p.price && (
                        <div className="font-mono text-[9px] text-slate-400 line-through">
                          ₹{p.compare_at_price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetails(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-elite-navy hover:bg-slate-100"
                        title="View Specifications"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectComponent(p.category, p)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-elite-navy hover:bg-elite-blue text-white'
                        }`}
                      >
                        {isSelected ? "In Rig" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                disabled={pageNumber === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>

              <span className="text-xs font-mono font-bold text-slate-700 px-2">
                Page {pageNumber} of {totalPages}
              </span>

              <button
                onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))}
                disabled={pageNumber === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Search / Category Filter Banner */}
      {searchQuery && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-slate-500 font-medium">Filtering by:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-2xs">
            <span>"{searchQuery}"</span>
            <button
              onClick={() => { setSearchQuery(''); setPageNumber(1); }}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              title="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <button
            onClick={() => { setSearchQuery(''); setPageNumber(1); }}
            className="text-xs text-slate-400 hover:text-blue-600 underline transition-colors"
          >
            Show All in {CATEGORY_TITLE_MAP[selectedCategory] || 'Category'}
          </button>
        </div>
      )}
    </div>
  );
}
