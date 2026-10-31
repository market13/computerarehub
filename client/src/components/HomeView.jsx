import React from 'react';
import { 
  Box, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Check, 
  Plus, 
  Info, 
  ExternalLink,
  ChevronRight,
  Zap,
  Gamepad2
} from 'lucide-react';

import EliteBannerHero from './EliteBannerHero';
import EliteCategoriesGrid from './EliteCategoriesGrid';
import OurSpecialities from './OurSpecialities';

export default function HomeView({
  catalog,
  build,
  onNavigate,
  onOpenSelector,
  onViewDetails,
  onOpenPresets,
  onSelectComponent
}) {
  // Grab top featured products across categories
  const featuredProducts = [];
  const sampleCats = ['gpu', 'cpu', 'case', 'cooler', 'ram', 'storage'];
  sampleCats.forEach(c => {
    if (catalog[c] && catalog[c].length > 0) {
      featuredProducts.push(...catalog[c].slice(0, 2));
    }
  });

  return (
    <div className="w-full flex flex-col gap-10 pb-16">
      {/* 1. Hero Carousel Banner & Service Assurance */}
      <EliteBannerHero onNavigate={onNavigate} />

      {/* 2. Component Categories Grid */}
      <EliteCategoriesGrid onSelectCategory={(cat) => onNavigate(`catalog-${cat}`)} />

      {/* 3. OUR SPECIALITIES (Gaming, Rendering, Streaming, Editing, Game Dev, AI & ML) */}
      <OurSpecialities onNavigate={onNavigate} onOpenPresets={onOpenPresets} />

      {/* 4. Featured Custom PC Builder Showcase */}
      <section className="w-full bg-white border border-elite-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Info */}
          <div className="lg:w-1/2 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elite-blue/10 text-elite-blue font-mono text-xs font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-elite-blue animate-pulse" />
              <span>CUSTOM PC CONFIGURATOR</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black text-elite-navy tracking-tight uppercase leading-tight">
              Build Your Custom PC With Zero Bottlenecks
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Experience India's most accurate custom PC builder. Select authentic components from top brands, verify socket and DDR memory standards, check dynamic wattage loads, and order with genuine brand warranty and authentic pricing from Computer Care.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans text-slate-700 py-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Socket & RAM Standards Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Real-Time PSU Wattage Meter</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero-Bottleneck Hardware Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1080p, 1440p & 4K FPS Projections</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('builder')}
                className="bg-elite-red hover:bg-elite-redHover text-white px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Launch PC Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPresets}
                className="px-5 py-3 rounded-xl font-display font-bold uppercase text-xs text-elite-navy bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Browse Pre-Configured Rigs
              </button>
            </div>
          </div>

          {/* Right: Live Custom Rig Preview Card */}
          <div className="lg:w-1/2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800">
                  Custom Hardware Configurator
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                COMPATIBILITY VERIFIED
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <img
                  src={build.case?.image || build.case?.cdn_image || "/images/products/case/case-0001-zebronics-iceberg.jpg"}
                  alt="PC Cabinet"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://cdn.shopify.com/s/files/1/0583/5761/2704/files/1_15682fa0-c0b0-4665-9fa8-1f5beab15f8a.jpg";
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5 text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {build.case?.vendor || "Featured Gaming Rig"}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {build.case?.title || "Custom Battle-Ready Gaming Chassis with ARGB Cooling"}
                </h4>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    RTX 40-Series Ready
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                    DDR5 Standard
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                    ~650W PSU Match
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">1080p Ultra</span>
                <span className="font-display font-bold text-sm text-emerald-600">165+ FPS</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">1440p High</span>
                <span className="font-display font-bold text-sm text-blue-600">120+ FPS</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">4K Gaming</span>
                <span className="font-display font-bold text-sm text-slate-900">75+ FPS</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('builder')}
              className="w-full mt-1 bg-elite-navy hover:bg-slate-900 text-white py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Configure Your Custom Hardware</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Trending Hardware Deals (EliteHubs real products with local images) */}
      <section className="w-full flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-elite-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-elite-red" />
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-elite-navy">
                Trending Hardware & Best Sellers
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Verified inventory in stock with authorized brand warranty
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1 text-xs font-bold font-display uppercase tracking-wider text-elite-blue hover:text-elite-blueLight"
          >
            <span>View All (2,900+)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.slice(0, 8).map((p) => {
            const isSelected = build[p.category]?.id === p.id;

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-elite-border hover:border-elite-blue hover:shadow-elite-hover p-4 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div 
                    className="relative w-full h-44 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 mb-3 cursor-pointer"
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

                    {/* Vendor badge */}
                    <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">
                      {p.vendor}
                    </span>

                    {/* Discount Pill */}
                    {p.compare_at_price > p.price && (
                      <span className="absolute top-2 right-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-elite-red text-white shadow-sm">
                        {Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-blue-50 text-elite-blue">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ● In Stock
                    </span>
                  </div>

                  <h3 
                    className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-elite-blue cursor-pointer transition-colors"
                    onClick={() => onViewDetails(p)}
                    title={p.title}
                  >
                    {p.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
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

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetails(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-elite-navy hover:bg-slate-100"
                      title="View Technical Specs"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectComponent(p.category, p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-elite-navy hover:bg-elite-blue text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? "In Rig" : "Add to Build"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
