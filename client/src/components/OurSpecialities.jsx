import React from 'react';
import { ArrowRight, Box } from 'lucide-react';

const SPECIALITIES = [
  {
    id: 'gaming',
    title: 'GAMING PC',
    description: 'Powerful gaming PCs for ultimate performance and immersive gameplay.',
    image: '/images/specialties/specialty_gaming.png',
    badge: '144+ FPS ULTRA',
    color: '#facc15'
  },
  {
    id: 'rendering',
    title: 'RENDERING PC',
    description: 'High-performance PCs for smooth and efficient rendering workflows.',
    image: '/images/specialties/specialty_rendering.png',
    badge: '3D VFX & BLENDER',
    color: '#facc15'
  },
  {
    id: 'streaming',
    title: 'STREAMING PC',
    description: 'Stream seamlessly with PCs built for performance and reliability.',
    image: '/images/specialties/specialty_streaming.png',
    badge: 'OBS LIVE ENCODE',
    color: '#facc15'
  },
  {
    id: 'editing',
    title: 'EDITING PC',
    description: 'Powerful PCs for fast and precise creative editing.',
    image: '/images/specialties/specialty_editing.png',
    badge: '4K/8K TIMELINES',
    color: '#facc15'
  },
  {
    id: 'gamedev',
    title: 'GAME DEV PC',
    description: 'Optimized PCs for building and testing incredible games.',
    image: '/images/specialties/specialty_gamedev.png',
    badge: 'UNREAL ENGINE 5',
    color: '#facc15'
  },
  {
    id: 'aiml',
    title: 'AI & ML PC',
    description: 'Advanced PCs for AI innovation and data-driven tasks.',
    image: '/images/specialties/specialty_aiml.png',
    badge: 'CUDA & PYTORCH',
    color: '#facc15'
  }
];

export default function OurSpecialities({ onNavigate = () => {}, onOpenPresets = () => {} }) {
  const handleCardClick = (spec) => {
    // Navigate to 3D PC builder or trigger prebuilt presets
    onNavigate('builder');
  };

  return (
    <section className="w-full bg-[#0a0a0c] text-white py-12 px-4 sm:px-6 lg:px-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* Subtle gold ambient glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#facc15]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#facc15] tracking-wider uppercase drop-shadow-md">
            OUR SPECIALITIES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl mx-auto mt-2">
            Engineered with precision for peak thermal performance, acoustic silence, and verified hardware synergy.
          </p>
        </div>

        {/* 6 Specialities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 w-full">
          {SPECIALITIES.map((spec) => (
            <div
              key={spec.id}
              onClick={() => handleCardClick(spec)}
              className="bg-[#151518] hover:bg-[#1c1c20] border border-white/10 hover:border-[#facc15]/80 rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.22)] hover:-translate-y-1.5 cursor-pointer group select-none"
            >
              {/* Image Preview Box */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/60 mb-4 border border-white/5 relative group-hover:border-[#facc15]/40 transition-colors flex items-center justify-center">
                <img
                  src={spec.image}
                  alt={spec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Tech Badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-xs text-[#facc15] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#facc15]/30">
                  {spec.badge}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col items-center justify-start">
                <h3 className="font-display font-black text-sm sm:text-base text-[#facc15] tracking-wide uppercase mb-2 group-hover:text-amber-300 transition-colors">
                  {spec.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-sans">
                  {spec.description}
                </p>
              </div>

              {/* Bottom Quick Configure Pill */}
              <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-[#facc15] transition-colors uppercase font-mono tracking-wider">
                <Box className="w-3 h-3 text-[#facc15]" />
                <span>Configure Rig</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
