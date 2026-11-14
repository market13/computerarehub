import React from 'react';

const SPECIALITIES = [
  {
    id: 'gaming_streaming',
    title: 'GAMING & STREAMING PC',
    description: 'Powerful gaming PCs for ultimate performance and immersive gameplay.',
    image: '/images/specialties/specialty_gaming.webp?v=4',
    badge: '144+ FPS ULTRA',
    color: '#facc15'
  },
  {
    id: '3d_modelling',
    title: '3D MODELLING PC',
    description: 'Optimized PCs for building, 3D rendering, and testing incredible creations.',
    image: '/images/specialties/specialty_gamedev.webp?v=4',
    badge: 'BLENDER & CAD',
    color: '#facc15'
  },
  {
    id: 'video_editing',
    title: 'VIDEO EDITING PC',
    description: 'Powerful PCs for fast and precise creative 4K/8K editing workflows.',
    image: '/images/specialties/specialty_editing.webp?v=4',
    badge: '4K/8K TIMELINES',
    color: '#facc15'
  },
  {
    id: 'gamedev',
    title: 'GAME DEV PC',
    description: 'High-performance rigs for Unreal Engine 5, Unity, and game compilation.',
    image: '/images/specialties/specialty_rendering.webp?v=4',
    badge: 'UNREAL ENGINE 5',
    color: '#facc15'
  },
  {
    id: 'aiml',
    title: 'AI & ML WORKSTATION',
    description: 'Advanced PCs for AI innovation, LLM fine-tuning, and CUDA tasks.',
    image: '/images/specialties/specialty_aiml.webp?v=4',
    badge: 'CUDA & PYTORCH',
    color: '#facc15'
  },
  {
    id: 'water_cooled',
    title: 'CUSTOM WATER-COOLED PC',
    description: 'Peak thermal dissipation with whisper-quiet custom cooling loops.',
    image: '/images/specialties/specialty_streaming.webp?v=4',
    badge: 'SILENT OVERCLOCK',
    color: '#facc15'
  }
];

export default function OurSpecialities({ onNavigate = () => {}, onOpenPresets: _onOpenPresets = () => {} }) {
  const handleCardClick = (_spec) => {
    // Navigate to 3D PC builder or trigger prebuilt presets
    onNavigate('builder');
  };

  return (
    <section className="w-full bg-[#0a0a0c] text-white py-8 sm:py-12 px-3 sm:px-6 lg:px-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#facc15]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 sm:gap-8 relative z-10">
        {/* Section Heading matching reference screenshot */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-wider uppercase drop-shadow-md leading-tight">
            FEATURED PC BUILD
            <br />
            CATEGORIES
          </h2>
        </div>

        {/* 2 columns on mobile, 3 on tablet, 6 on desktop matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 w-full">
          {SPECIALITIES.map((spec) => (
            <a
              key={spec.id}
              href="/builder"
              onClick={(e) => {
                e.preventDefault();
                handleCardClick(spec);
              }}
              className="rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141416] border border-neutral-800 shadow-xl flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_rgba(250,204,21,0.25)] select-none no-underline"
            >
              {/* Top: PC Build Showcase Image */}
              <div className="w-full aspect-[4/4.2] overflow-hidden bg-neutral-950 relative flex items-center justify-center">
                <img
                  src={spec.image}
                  alt={spec.title}
                  width="300"
                  height="315"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Tech Badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-xs text-[#facc15] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#facc15]/30">
                  {spec.badge}
                </div>
              </div>

              {/* Bottom: Solid Yellow Block with Bold Black Title & Black BUY NOW Button */}
              <div className="w-full bg-[#facc15] p-2.5 sm:p-3 flex flex-col justify-between gap-2.5 flex-1">
                <h3 className="font-display font-black text-xs sm:text-sm text-black uppercase leading-tight tracking-tight text-center sm:text-left min-h-[34px] flex items-center justify-center sm:justify-start">
                  {spec.title}
                </h3>

                {/* Sleek Black Buy Now Button */}
                <div className="w-full">
                  <div className="w-full py-2.5 px-3 rounded-xl bg-black group-hover:bg-neutral-900 text-[#facc15] group-hover:text-white font-display font-black text-[11px] sm:text-xs uppercase tracking-wider text-center transition-colors shadow-xs">
                    BUY NOW
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
