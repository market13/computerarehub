import React from 'react';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  // Row 1 (Matches user mobile reference exactly)
  {
    id: 'graphic_card',
    title: 'GRAPHIC CARD',
    discount: 'UP TO 38% OFF',
    image: '/images/shop_by_category/graphic_card.png',
    categoryKey: 'gpu'
  },
  {
    id: 'ram',
    title: 'RAM',
    discount: 'UP TO 41% OFF',
    image: '/images/shop_by_category/ram.png',
    categoryKey: 'ram'
  },
  {
    id: 'ssd',
    title: 'SSD',
    discount: 'UP TO 32% OFF',
    image: '/images/shop_by_category/ssd.png',
    categoryKey: 'storage'
  },
  {
    id: 'pc_cabinet',
    title: 'PC CABINET',
    discount: 'UP TO 48% OFF',
    image: '/images/shop_by_category/pc_cabinet.png',
    categoryKey: 'case'
  },
  {
    id: 'air_cooler',
    title: 'AIR COOLER',
    discount: 'UP TO 51% OFF',
    image: '/images/shop_by_category/air_cooler.png',
    categoryKey: 'cooler'
  },
  {
    id: 'liquid_cooler',
    title: 'LIQUID COOLER',
    discount: 'UP TO 42% OFF',
    image: '/images/shop_by_category/liquid_cooler.png',
    categoryKey: 'cooler'
  },

  // Row 2 & Core Hardware
  {
    id: 'processor',
    title: 'PROCESSOR',
    discount: 'UP TO 42% OFF',
    image: '/images/shop_by_category/processor.png',
    categoryKey: 'cpu'
  },
  {
    id: 'motherboard',
    title: 'MOTHERBOARD',
    discount: 'UP TO 48% OFF',
    image: '/images/shop_by_category/motherboard.png',
    categoryKey: 'motherboard'
  },
  {
    id: 'power_supply',
    title: 'POWER SUPPLY',
    discount: 'UP TO 38% OFF',
    image: '/images/shop_by_category/power_supply.png',
    categoryKey: 'psu'
  },
  {
    id: 'monitor',
    title: 'MONITOR',
    discount: 'UP TO 31% OFF',
    image: '/images/shop_by_category/monitor.png',
    categoryKey: 'monitor'
  },
  {
    id: 'mouse',
    title: 'MOUSE',
    discount: 'UP TO 72% OFF',
    image: '/images/shop_by_category/mouse.png',
    categoryKey: 'gaming_mouse'
  },
  {
    id: 'keyboard',
    title: 'KEYBOARD',
    discount: 'UP TO 58% OFF',
    image: '/images/shop_by_category/keyboard.png',
    categoryKey: 'gaming_keyboard'
  },
  {
    id: 'headphones',
    title: 'HEADPHONES',
    discount: 'UP TO 65% OFF',
    image: '/images/shop_by_category/headphones.png',
    categoryKey: 'gaming_headphone'
  },
  {
    id: 'mousepad',
    title: 'MOUSEPAD',
    discount: 'UP TO 60% OFF',
    image: '/images/shop_by_category/mousepad.png',
    categoryKey: 'gaming_mousepad'
  }
];

export default function ShopByCategory({ onSelectCategory }) {
  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-[#0a0a0c] border border-white/10 p-5 sm:p-8 lg:p-10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-mono text-[11px] font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTHENTIC HARDWARE & GEAR</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
          SHOP BY CATEGORY
        </h2>

        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mt-3" />
      </div>

      {/* 2 columns on mobile, 4 on tablet, 7 on desktop matching user reference */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5 lg:gap-6">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`/catalog/${cat.categoryKey}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory(cat.categoryKey);
            }}
            className="group flex flex-col items-center text-center focus:outline-none cursor-pointer no-underline"
          >
            {/* Card Box (Dark Rounded Square containing hardware cutout) */}
            <div className="w-full aspect-square rounded-2xl bg-[#141416] group-hover:bg-[#1a1a1e] border border-white/5 group-hover:border-white/20 p-4 sm:p-5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-lg">
              <img
                src={cat.image}
                alt={cat.title}
                width="160"
                height="160"
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Title & Discount Label Beneath Box */}
            <div className="flex flex-col items-center justify-center w-full mt-3">
              <span className="font-display font-black text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-amber-400 transition-colors line-clamp-1">
                {cat.title}
              </span>
              <span className="font-sans font-bold text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-tight mt-0.5">
                {cat.discount}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
