import React from 'react';
import { 
  Box, 
  ArrowRight, 
  Check, 
  Info, 
  ChevronRight,
  Wrench,
  Cpu,
  HardDrive,
  Laptop,
  Headphones,
  Building2
} from 'lucide-react';

import BannerHero from './BannerHero';
import ShopByCategory from './ShopByCategory';
import OurSpecialities from './OurSpecialities';
import FAQSection from './FAQSection';

export default function HomeView({
  catalog,
  build,
  onNavigate,
  onOpenSelector: _onOpenSelector,
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
    <div className="w-full flex flex-col gap-8 sm:gap-10 pb-28 lg:pb-16">
      {/* 1. Hero Carousel Banner & Service Assurance */}
      <BannerHero onNavigate={onNavigate} />

      {/* 2. SHOP BY CATEGORY (14 Modern Visual Category Cards) */}
      <ShopByCategory onSelectCategory={(cat) => onNavigate(`catalog-${cat}`)} />

      {/* 3. OUR SPECIALITIES (Gaming, Rendering, Streaming, Editing, Game Dev, AI & ML) */}
      <OurSpecialities onNavigate={onNavigate} onOpenPresets={onOpenPresets} />

      {/* 4. Featured Custom PC Builder Showcase */}
      <section className="w-full bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Info */}
          <div className="lg:w-1/2 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span>CUSTOM PC CONFIGURATOR</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
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
                className="bg-brand-red hover:bg-brand-redHover text-white px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Launch PC Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPresets}
                className="px-5 py-3 rounded-xl font-display font-bold uppercase text-xs text-brand-navy bg-slate-100 hover:bg-slate-200 transition-colors"
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
                  src={build.case?.image || build.case?.cdn_image || "/images/featured-case.png"}
                  alt={build.case?.title || "Computer Care Custom PC Cabinet"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/images/featured-case.png";
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
              className="w-full mt-1 bg-brand-navy hover:bg-slate-900 text-white py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Configure Your Custom Hardware</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Trending Hardware Deals (Computer Care real products with local images) */}
      <section className="w-full flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-brand-navy">
                Trending Hardware & Best Sellers
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Verified inventory in stock with authorized brand warranty
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1 text-xs font-bold font-display uppercase tracking-wider text-brand-blue hover:text-brand-blueLight"
          >
            <span>View All (3,200+)</span>
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
                className="bg-white rounded-xl border border-brand-border hover:border-brand-blue hover:shadow-brand-hover p-4 flex flex-col justify-between transition-all group"
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
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-blue-50 text-brand-blue">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ● In Stock
                    </span>
                  </div>

                  <h3 
                    className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-brand-blue cursor-pointer transition-colors"
                    onClick={() => onViewDetails(p)}
                    title={p.title}
                  >
                    {p.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-base text-brand-navy">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetails(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100"
                      title="View Technical Specs"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectComponent(p.category, p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-navy hover:bg-brand-blue text-white shadow-sm'
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

      {/* 6. Computer Care Store & Services in Ghaziabad */}
      <section className="w-full bg-white border border-brand-border rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold w-fit mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>GHAZIABAD COMPUTER STORE & SERVICES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-navy tracking-tight uppercase">
              Computer Repair, Custom Builds & Upgrades in Ghaziabad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
              Serving Ghaziabad, Delhi NCR, and all of India with certified hardware solutions, custom gaming PCs, and genuine accessories.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-xs font-display font-bold uppercase tracking-wider text-brand-blue hover:text-brand-navy flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                Custom Gaming PC Building
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Tailor-made gaming rigs & workstations built in Ghaziabad with verified socket matching, dynamic PSU wattage calculations, and 24-hr stress testing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('builder')}
              className="mt-4 text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              Configure Rig &rarr;
            </button>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                Hardware Upgrades & SSDs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Upgrade slow desktops and laptops with high-speed PCIe NVMe SSDs, expanded RAM (DDR4/DDR5), RTX graphics cards, and high-wattage power supplies.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('catalog-storage')}
              className="mt-4 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              Browse Upgrades &rarr;
            </button>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                Computer Repair & Troubleshooting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Diagnostic troubleshooting in Ghaziabad for booting errors, BSOD crashes, overheating, power supply failures, and deep component cleaning.
              </p>
            </div>
            <a
              href="https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20need%20computer%20repair%20in%20Ghaziabad"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
            >
              Book Repair &rarr;
            </a>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                Laptop & Desktop Servicing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Full thermal maintenance, fan servicing, Arctic/Noctua thermal repasting, driver installations, and OS tuning to keep computers running fast.
              </p>
            </div>
            <a
              href="https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20want%20to%20service%20my%20laptop%20or%20desktop"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              Schedule Service &rarr;
            </a>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                Computer Accessories & Peripherals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Genuine Bluetooth and wired optical mice, mechanical RGB keyboards, surround-sound headsets, precision mousepads, webcams, and chairs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('catalog-gaming_mouse')}
              className="mt-4 text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              Shop Accessories &rarr;
            </button>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 hover:border-brand-blue bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                B2B Bulk Procurement & Labs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Turnkey computer lab setup for schools, colleges, and offices with wholesale volume quotations, GST invoices, and priority warranty.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bulk-order')}
              className="mt-4 text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              B2B Inquiry &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (FAQ) with Schema-aligned QA grounding */}
      <FAQSection />
    </div>
  );
}
