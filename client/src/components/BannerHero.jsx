import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Box, 
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import computercareBanner from '../assets/computercare-banner.jpg';

export default function BannerHero({ onNavigate = () => {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 2;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 50) {
        nextSlide();
      } else if (distance < -50) {
        prevSlide();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleBuilderNav = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onNavigate === 'function') {
      onNavigate('builder');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Hero Carousel Container */}
      <div 
        className="relative w-full min-h-[280px] sm:min-h-[340px] lg:h-[380px] rounded-2xl overflow-hidden shadow-lg bg-slate-950 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Computer Care Hero Banners"
      >
        {/* Track */}
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide 0: Computer Care Branded Custom PC Configurator Banner */}
          <div className="w-full shrink-0 min-w-full h-full min-h-[280px] sm:min-h-[340px] lg:h-[380px] relative flex flex-col items-center justify-center bg-black overflow-hidden py-3 sm:py-6">
            {/* Ambient background glow */}
            <img
              src={computercareBanner}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-25 scale-110 pointer-events-none"
            />

            <a
              href="/builder"
              onClick={handleBuilderNav}
              className="relative z-10 w-full h-full flex flex-col items-center justify-center px-2 sm:px-6 cursor-pointer group/slide no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-xl"
              aria-label="Computer Care Custom PC Build Configurator - Build Your PC Now"
            >
              <div className="relative inline-flex items-center justify-center max-w-full">
                <img
                  src={computercareBanner}
                  alt="Computer Care Custom PC Build Configurator"
                  className="w-auto h-auto max-h-[200px] sm:max-h-[300px] lg:max-h-[350px] max-w-full object-contain mx-auto select-none pointer-events-none drop-shadow-2xl"
                />

                {/* Desktop/Tablet CTA Button Overlay matching exact graphic button bounds */}
                <div 
                  className="absolute hidden sm:flex items-center justify-center"
                  style={{
                    left: '6.35%',
                    top: '71.43%',
                    width: '32.62%',
                    height: '23.35%'
                  }}
                >
                  <span
                    onClick={handleBuilderNav}
                    className="w-full h-full rounded-full bg-gradient-to-r from-[#00d2ff] via-[#9b28ea] to-[#ff0080] text-white flex items-center justify-center gap-1.5 md:gap-2 font-display font-extrabold uppercase tracking-wide shadow-lg shadow-pink-500/25 group-hover/slide:scale-102 group-hover/slide:brightness-110 active:scale-98 transition-all cursor-pointer text-[10px] sm:text-xs md:text-sm border border-white/20 select-none"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                    <span>Build Your PC Now -&gt;</span>
                  </span>
                </div>
              </div>

              {/* Mobile CTA button displayed beneath banner image on small screens */}
              <div className="sm:hidden mt-2 flex items-center justify-center">
                <span 
                  onClick={handleBuilderNav}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-display font-bold uppercase tracking-wider text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Build Your PC Now -&gt;</span>
                </span>
              </div>
            </a>
          </div>

          {/* Slide 1: Original Custom PC Configurator Hero Banner */}
          <div className="w-full shrink-0 min-w-full h-full min-h-[280px] sm:min-h-[340px] lg:h-[380px] relative flex items-center bg-gradient-to-r from-[#0f143a] via-[#1a2068] to-[#2B38D1] text-white py-8 sm:py-12 overflow-hidden">
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
        </div>

        {/* Previous Slide Button (hidden on mobile for maximum text breathing room, visible on sm+ with hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Slide Button (hidden on mobile for maximum text breathing room, visible on sm+ with hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-md"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {[0, 1].map((index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${
                currentSlide === index
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-brand-red shadow-md'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
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
