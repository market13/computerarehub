import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  // Row 1
  {
    id: 'processor',
    title: 'PROCESSOR',
    discount: 'UP TO 42% OFF',
    image: '/images/shop_by_category/processor.png',
    categoryKey: 'cpu',
    accentColor: 'from-blue-600/20 to-transparent'
  },
  {
    id: 'motherboard',
    title: 'MOTHERBOARD',
    discount: 'UP TO 48% OFF',
    image: '/images/shop_by_category/motherboard.png',
    categoryKey: 'motherboard',
    accentColor: 'from-purple-600/20 to-transparent'
  },
  {
    id: 'graphic_card',
    title: 'GRAPHIC CARD',
    discount: 'UP TO 38% OFF',
    image: '/images/shop_by_category/graphic_card.png',
    categoryKey: 'gpu',
    accentColor: 'from-rose-600/20 to-transparent'
  },
  {
    id: 'ram',
    title: 'RAM',
    discount: 'UP TO 41% OFF',
    image: '/images/shop_by_category/ram.png',
    categoryKey: 'ram',
    accentColor: 'from-cyan-600/20 to-transparent'
  },
  {
    id: 'ssd',
    title: 'SSD',
    discount: 'UP TO 32% OFF',
    image: '/images/shop_by_category/ssd.png',
    categoryKey: 'storage',
    accentColor: 'from-emerald-600/20 to-transparent'
  },
  {
    id: 'pc_cabinet',
    title: 'PC CABINET',
    discount: 'UP TO 48% OFF',
    image: '/images/shop_by_category/pc_cabinet.png',
    categoryKey: 'case',
    accentColor: 'from-indigo-600/20 to-transparent'
  },
  {
    id: 'air_cooler',
    title: 'AIR COOLER',
    discount: 'UP TO 51% OFF',
    image: '/images/shop_by_category/air_cooler.png',
    categoryKey: 'cooler',
    accentColor: 'from-sky-600/20 to-transparent'
  },

  // Row 2
  {
    id: 'liquid_cooler',
    title: 'LIQUID COOLER',
    discount: 'UP TO 42% OFF',
    image: '/images/shop_by_category/liquid_cooler.png',
    categoryKey: 'cooler',
    accentColor: 'from-cyan-600/20 to-transparent'
  },
  {
    id: 'power_supply',
    title: 'POWER SUPPLY',
    discount: 'UP TO 38% OFF',
    image: '/images/shop_by_category/power_supply.png',
    categoryKey: 'psu',
    accentColor: 'from-amber-600/20 to-transparent'
  },
  {
    id: 'monitor',
    title: 'MONITOR',
    discount: 'UP TO 31% OFF',
    image: '/images/shop_by_category/monitor.png',
    categoryKey: 'monitor',
    accentColor: 'from-teal-600/20 to-transparent'
  },
  {
    id: 'mouse',
    title: 'MOUSE',
    discount: 'UP TO 72% OFF',
    image: '/images/shop_by_category/mouse.png',
    categoryKey: 'gaming_mouse',
    accentColor: 'from-lime-600/20 to-transparent'
  },
  {
    id: 'keyboard',
    title: 'KEYBOARD',
    discount: 'UP TO 58% OFF',
    image: '/images/shop_by_category/keyboard.png',
    categoryKey: 'gaming_keyboard',
    accentColor: 'from-fuchsia-600/20 to-transparent'
  },
  {
    id: 'headphones',
    title: 'HEADPHONES',
    discount: 'UP TO 54% OFF',
    image: '/images/shop_by_category/headphones.png',
    categoryKey: 'gaming_headset',
    accentColor: 'from-violet-600/20 to-transparent'
  },
  {
    id: 'mousepad',
    title: 'MOUSEPAD',
    discount: 'UP TO 33% OFF',
    image: '/images/shop_by_category/mousepad.png',
    categoryKey: 'gaming_mousepad',
    accentColor: 'from-emerald-600/20 to-transparent'
  }
];

export default function ShopByCategory({ onSelectCategory }) {
  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#060914] via-[#0b1329] to-[#0f172a] border border-slate-800/90 p-5 sm:p-8 lg:p-10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-mono text-[11px] font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTHENTIC HARDWARE & GEAR</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
          SHOP BY CATEGORY
        </h2>

        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mt-3" />
      </div>

      {/* 14 Categories Responsive Grid: 2 cols on mobile, 4 on tablet, 7 on desktop matching the 2-row layout */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.categoryKey)}
            className="group relative flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-[#11192e]/90 hover:bg-[#182340] border border-slate-800/90 hover:border-blue-500/60 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {/* Ambient card top gradient */}
            <div className={`absolute top-0 left-0 right-0 h-16 rounded-t-2xl bg-gradient-to-b ${cat.accentColor} pointer-events-none`} />

            {/* Product Cutout Image Container */}
            <div className="relative w-full aspect-square flex items-center justify-center p-1 sm:p-2 mb-2 sm:mb-2.5">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300 ease-out"
                loading="lazy"
              />
            </div>

            {/* Title & Discount Label */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
              <span className="font-display font-black text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-blue-400 transition-colors line-clamp-1">
                {cat.title}
              </span>
              <span className="font-sans font-extrabold text-[10px] sm:text-[11px] text-amber-400 uppercase tracking-tight">
                {cat.discount}
              </span>
            </div>

            {/* Subtle hover arrow pill */}
            <div className="mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300 group-hover:text-blue-300">
              <span>View Gear</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
