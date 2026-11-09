import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Info, 
  Plus, 
  Check 
} from 'lucide-react';

const CATEGORY_TABS = [
  { key: 'all', label: 'All Hardware' },
  { key: 'case', label: 'Cabinets' },
  { key: 'cpu', label: 'Processors' },
  { key: 'motherboard', label: 'Motherboards' },
  { key: 'gpu', label: 'Graphics Cards' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power Supplies' },
  { key: 'cooler', label: 'Coolers & AIO' },
  { key: 'monitor', label: 'Gaming Monitors' },
];

export default function CatalogPage({ 
  catalog = {}, 
  build = {}, 
  onSelectComponent, 
  onViewDetails 
}) {
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('price_asc');

  // Flatten all products or filter by active category
  const allProducts = useMemo(() => {
    if (activeCat === 'all') {
      let merged = [];
      Object.values(catalog).forEach((list) => {
        if (Array.isArray(list)) merged = merged.concat(list);
      });
      return merged;
    }
    return catalog[activeCat] || [];
  }, [catalog, activeCat]);

  // Extract brands
  const brands = useMemo(() => {
    const bSet = new Set();
    allProducts.forEach(p => {
      if (p.vendor) bSet.add(p.vendor);
    });
    return ['ALL', ...Array.from(bSet).sort()];
  }, [allProducts]);

  // Filtered & sorted
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesVendor = p.vendor?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesVendor) return false;
      }
      if (selectedBrand !== 'ALL' && p.vendor !== selectedBrand) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [allProducts, searchQuery, selectedBrand, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Computer Care Inventory
            </span>
            <span className="text-xs font-mono text-slate-400">
              {filteredProducts.length} Items Listed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            PC Components Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-mono">
            Browse genuine PC hardware directly sourced with live pricing and local images. Add any part to your custom 3D build in one click.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-surface border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveCat(tab.key); setSelectedBrand('ALL'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              activeCat === tab.key
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow-primary'
                : 'bg-brand-surface/70 text-slate-400 hover:text-white border-white/5 hover:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-surface/60 p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          {brands.length > 2 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-brand-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Brands ({brands.length - 1})</option>
              {brands.filter(b => b !== 'ALL').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.slice(0, 120).map(p => {
          const isSelected = build[p.category]?.id === p.id;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-white/10 bg-brand-surface/80 hover:border-indigo-500/50 p-3.5 flex flex-col justify-between transition-all group hover:shadow-glow-primary"
            >
              <div>
                {/* Image */}
                <div 
                  className="relative w-full h-44 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center p-3 mb-3 cursor-pointer"
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
                  <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                    {p.vendor}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {p.category}
                  </span>
                  {p.specs?.socket && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {p.specs.socket}
                    </span>
                  )}
                </div>

                <h3 
                  className="text-xs font-medium text-white line-clamp-2 hover:text-cyan-400 cursor-pointer transition-colors"
                  onClick={() => onViewDetails(p)}
                  title={p.title}
                >
                  {p.title}
                </h3>
              </div>

              <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-sm text-cyan-400">
                    ₹{p.price.toLocaleString('en-IN')}
                  </div>
                  {p.compare_at_price > p.price && (
                    <div className="font-mono text-[10px] text-slate-500 line-through">
                      ₹{p.compare_at_price.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewDetails(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="View Specs"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectComponent(p.category, p)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Rig</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
