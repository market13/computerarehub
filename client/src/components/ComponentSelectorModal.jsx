import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Check, 
  Info, 
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Box
} from 'lucide-react';

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

export default function ComponentSelectorModal({
  isOpen,
  onClose,
  categoryKey,
  categoryLabel,
  products = [],
  build = {},
  onSelectProduct,
  onViewDetails
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedSubfilter, setSelectedSubfilter] = useState('ALL');
  const [selectedCabinetKind, setSelectedCabinetKind] = useState('ALL');
  const [selectedFanKind, setSelectedFanKind] = useState('ALL');
  const [sortBy, setSortBy] = useState('price_asc'); // 'price_asc', 'price_desc', 'name'

  // Extract unique brands
  const brands = useMemo(() => {
    const bSet = new Set();
    products.forEach(p => {
      if (p.vendor) bSet.add(p.vendor);
    });
    return ['ALL', ...Array.from(bSet).sort()];
  }, [products]);

  // Extract relevant subfilter options (Socket, Form Factor, DDR type, etc.)
  const subfilterOptions = useMemo(() => {
    const sSet = new Set();
    products.forEach(p => {
      if (categoryKey === 'cpu' || categoryKey === 'motherboard') {
        if (p.specs?.socket && p.specs.socket !== 'Unknown') sSet.add(p.specs.socket);
      } else if (categoryKey === 'ram') {
        if (p.specs?.ram_type) sSet.add(p.specs.ram_type);
      } else if (categoryKey === 'cooler') {
        if (p.specs?.cooler_type) sSet.add(p.specs.cooler_type);
      } else if (categoryKey === 'gpu') {
        if (p.specs?.vram) sSet.add(p.specs.vram);
      }
    });
    return ['ALL', ...Array.from(sSet)];
  }, [products, categoryKey]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search text
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesVendor = p.vendor?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesVendor && !matchesDesc) return false;
      }

      // Brand
      if (selectedBrand !== 'ALL' && p.vendor !== selectedBrand) {
        return false;
      }

      // CRITICAL RULE: In Cabinet section, strictly NEVER show cabinet fans or fan accessories!
      if (categoryKey === 'case') {
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

      // Special Cabinet Kinds Filter
      if (categoryKey === 'case' && selectedCabinetKind !== 'ALL') {
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
      if (categoryKey === 'case_fan' && selectedFanKind !== 'ALL') {
        const title = (p.title || "").toLowerCase();
        const specs = p.specs || {};
        if (selectedFanKind === '120mm' && !title.includes('120mm') && specs.fan_size !== '120mm') return false;
        if (selectedFanKind === '140mm' && !title.includes('140mm') && specs.fan_size !== '140mm') return false;
        if (selectedFanKind === 'argb' && !title.includes('argb') && !title.includes('rgb') && specs.lighting === 'Non-RGB') return false;
        if (selectedFanKind === 'triple' && !title.includes('triple') && !title.includes('3 in 1') && !title.includes('pack of 3') && !title.includes('3-in-1')) return false;
        if (selectedFanKind === 'white' && !title.includes('white')) return false;
        if (selectedFanKind === 'black' && !title.includes('black')) return false;
      }

      // Subfilter for other categories
      if (selectedSubfilter !== 'ALL') {
        if (categoryKey === 'cpu' || categoryKey === 'motherboard') {
          if (p.specs?.socket !== selectedSubfilter) return false;
        } else if (categoryKey === 'ram') {
          if (p.specs?.ram_type !== selectedSubfilter) return false;
        } else if (categoryKey === 'cooler') {
          if (p.specs?.cooler_type !== selectedSubfilter) return false;
        } else if (categoryKey === 'gpu') {
          if (p.specs?.vram !== selectedSubfilter) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [products, searchQuery, selectedBrand, selectedSubfilter, selectedCabinetKind, selectedFanKind, sortBy, categoryKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-white border border-elite-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header (Navy Blue) */}
        <div className="p-4 sm:p-5 bg-elite-navy text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-display uppercase tracking-wider">
                Select {categoryLabel}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/20 text-white font-semibold">
                {filteredProducts.length} Models Available
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Genuine {categoryLabel} with official manufacturer warranty
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specialized Cabinet Kind Filter Strip (if category is case) */}
        {categoryKey === 'case' && (
          <div className="bg-slate-100 border-b border-elite-border px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-elite-navy uppercase font-display mr-1 whitespace-nowrap">
              Cabinet Types:
            </span>
            {CABINET_KINDS.map(kind => (
              <button
                key={kind.id}
                onClick={() => setSelectedCabinetKind(kind.id)}
                className={`px-3 py-1 rounded-lg text-xs font-sans whitespace-nowrap transition-all border ${
                  selectedCabinetKind === kind.id
                    ? 'bg-elite-blue text-white font-bold border-elite-blue shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-200 font-medium'
                }`}
              >
                {kind.label}
              </button>
            ))}
          </div>
        )}

        {/* Specialized Fan Kind Filter Strip (if category is case_fan) */}
        {categoryKey === 'case_fan' && (
          <div className="bg-slate-100 border-b border-elite-border px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-elite-navy uppercase font-display mr-1 whitespace-nowrap">
              Fan Types:
            </span>
            {FAN_KINDS.map(kind => (
              <button
                key={kind.id}
                onClick={() => setSelectedFanKind(kind.id)}
                className={`px-3 py-1 rounded-lg text-xs font-sans whitespace-nowrap transition-all border ${
                  selectedFanKind === kind.id
                    ? 'bg-elite-blue text-white font-bold border-elite-blue shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-200 font-medium'
                }`}
              >
                {kind.label}
              </button>
            ))}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-elite-border bg-slate-50 flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${categoryLabel} by name, brand or model (e.g. O11, 4000D, Lancool)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-elite-blue transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          {brands.length > 2 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-elite-blue cursor-pointer font-medium"
            >
              <option value="ALL">All Brands ({brands.length - 1})</option>
              {brands.filter(b => b !== 'ALL').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          {/* Subfilter (For CPU/Motherboard/RAM/GPU) */}
          {subfilterOptions.length > 2 && (
            <select
              value={selectedSubfilter}
              onChange={(e) => setSelectedSubfilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-elite-blue cursor-pointer font-medium"
            >
              <option value="ALL">All Specs</option>
              {subfilterOptions.filter(s => s !== 'ALL').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-elite-blue cursor-pointer font-medium"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 bg-slate-50/50">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <Box className="w-10 h-10 text-slate-400 mb-2" />
              <h4 className="text-base font-bold text-slate-800 font-display">No cabinets matched your filter</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm font-sans">
                Try clearing search terms or selecting a different cabinet style.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedBrand('ALL'); setSelectedCabinetKind('ALL'); setSelectedSubfilter('ALL'); }}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider bg-elite-navy text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isSelected = build[categoryKey]?.id === p.id;

              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-50/50 border-elite-blue shadow-md ring-2 ring-elite-blue/30'
                      : 'bg-white border-elite-border hover:border-elite-blue hover:shadow-elite-hover'
                  }`}
                >
                  <div>
                    {/* Thumbnail Image Container */}
                    <div 
                      className="relative w-full h-44 bg-white rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center p-3 mb-3 cursor-pointer group"
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
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Vendor Badge */}
                      <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">
                        {p.vendor}
                      </span>

                      {/* Discount pill */}
                      {p.compare_at_price > p.price && (
                        <span className="absolute top-2 right-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-elite-red text-white shadow-sm">
                          {Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 hover:text-elite-blue cursor-pointer transition-colors"
                      onClick={() => onViewDetails(p)}
                      title={p.title}
                    >
                      {p.title}
                    </h3>

                    {/* Cabinet Specs Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {p.specs?.cabinet_style && (
                        <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-blue-50 text-elite-blue border border-blue-200">
                          {p.specs.cabinet_style}
                        </span>
                      )}
                      {p.specs?.form_factor && (
                        <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {p.specs.form_factor}
                        </span>
                      )}
                      {p.specs?.color && (
                        <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {p.specs.color}
                        </span>
                      )}
                      {p.specs?.max_gpu_length && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Max GPU: {p.specs.max_gpu_length}mm
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Select Button */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-base text-elite-navy">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.compare_at_price > p.price && (
                        <div className="font-mono text-[10px] text-slate-400 line-through">
                          ₹{p.compare_at_price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewDetails(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-elite-navy hover:bg-slate-100 transition-colors"
                        title="View Full Specifications"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectProduct(categoryKey, p);
                          onClose();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-elite-red hover:bg-elite-redHover text-white shadow-sm'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Build</span>
                          </>
                        ) : (
                          <span>Select</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
