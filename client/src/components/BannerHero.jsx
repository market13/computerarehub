import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Box, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function BannerHero({ onNavigate = () => {} }) {
  const handleBuilderNav = (e) => {
    if (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onNavigate === 'function') {
      onNavigate('builder');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Main Hero Banner - Custom PC Configurator */}
      <div className="relative w-full min-h-[280px] sm:min-h-[340px] lg:h-[380px] py-8 sm:py-12 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#0f143a] via-[#1a2068] to-[#2B38D1] text-white flex items-center">
        {/* Decorative Grid Lines / Tech Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-12 text-center sm:text-left flex flex-col items-center sm:items-start">
          <span className="text-[10px] sm:text-xs font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-brand-red text-white mb-3 shadow-md">
            CUSTOM PC CONFIGURATOR
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight uppercase max-w-3xl drop-shadow-md">
            BUILD YOUR DREAM CUSTOM GAMING RIG
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-200 max-w-xl font-sans leading-relaxed drop-shadow">
            Zero-Bottleneck Hardware Compatibility • Authentic Components • Real-Time Wattage & Pricing
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/builder"
              onClick={handleBuilderNav}
              className="bg-brand-red hover:bg-brand-redHover text-white px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer no-underline"
            >
              <span>START YOUR CUSTOM BUILD</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Computer Care Style Service Assurance Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase font-display">Free Shipping</h4>
            <p className="text-[11px] text-slate-500">All India orders above ₹5,000</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase font-display">100% Genuine</h4>
            <p className="text-[11px] text-slate-500">Official Brand Warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase font-display">Custom PC Builder</h4>
            <p className="text-[11px] text-slate-500">Zero-bottleneck compatibility</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-brand-red flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase font-display">WhatsApp Support</h4>
            <p className="text-[11px] text-slate-500">Direct hardware specialists</p>
          </div>
        </div>
      </div>
    </div>
  );
}
