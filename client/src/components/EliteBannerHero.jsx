import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  Box, 
  MessageSquare
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'CUSTOM PC CONFIGURATOR',
    title: 'BUILD YOUR DREAM CUSTOM GAMING RIG',
    subtitle: 'Zero-Bottleneck Hardware Compatibility • Authentic Components • Real-Time Wattage & Pricing',
    cta: 'START YOUR CUSTOM BUILD',
    action: 'builder',
    bgGradient: 'from-[#0f143a] via-[#1a2068] to-[#2B38D1]',
    badgeColor: 'bg-elite-red',
    tagColor: 'text-elite-gold'
  },
  {
    id: 2,
    tag: 'ULTIMATE PERFORMANCE GRAPHICS',
    title: 'NVIDIA GEFORCE RTX 40 & 50 SERIES',
    subtitle: 'Ray-Tracing & DLSS 3.5 Dominance • Genuine Brand Warranty • Sourced from Authorized Distributors',
    cta: 'EXPLORE GRAPHICS CARDS',
    action: 'catalog-gpu',
    bgGradient: 'from-[#12172a] via-[#1e293b] to-[#047857]',
    badgeColor: 'bg-emerald-600',
    tagColor: 'text-emerald-400'
  },
  {
    id: 3,
    tag: 'NEXT-GEN PROCESSING POWER',
    title: 'AMD RYZEN 9000 & INTEL CORE 14TH GEN',
    subtitle: 'Unrivaled Gaming Frame Rates & High-Speed Creator Multitasking • Paired with DDR5 & PCIe Gen 5',
    cta: 'VIEW PROCESSORS',
    action: 'catalog-cpu',
    bgGradient: 'from-[#311019] via-[#4c1d29] to-[#b91c1c]',
    badgeColor: 'bg-amber-600',
    tagColor: 'text-amber-300'
  }
];

export default function EliteBannerHero({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Main Hero Carousel Banner */}
      <div className={`relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r ${slide.bgGradient} text-white flex items-center transition-all duration-700`}>
        {/* Decorative Grid Lines / Tech Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center sm:text-left flex flex-col items-center sm:items-start">
          <span className={`text-xs font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full ${slide.badgeColor} text-white mb-3 shadow-md`}>
            {slide.tag}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight uppercase max-w-3xl drop-shadow-md">
            {slide.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-200 max-w-xl font-sans leading-relaxed drop-shadow">
            {slide.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate(slide.action)}
              className="bg-elite-red hover:bg-elite-redHover text-white px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
            >
              <span>{slide.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-elite-red' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. EliteHubs Style Service Assurance Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-elite-border shadow-sm">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-elite-blue flex items-center justify-center flex-shrink-0">
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
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-elite-red flex items-center justify-center flex-shrink-0">
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
