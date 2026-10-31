import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Eye, 
  Palette,
  Gamepad2
} from 'lucide-react';
import { THEMES } from '../utils/themePresets';

export default function FrontHero({ 
  currentTheme, 
  onSelectTheme, 
  onStartBuilding, 
  onOpenPresets,
  onOpenCatalog 
}) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 border-b border-white/10">
      {/* Background radial glow matching current theme */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] opacity-25 blur-[120px] pointer-events-none rounded-full"
        style={{ backgroundColor: currentTheme.colors.primary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentTheme.colors.primary }} />
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-slate-300">
            NEXUS RIG LAB • POWERED BY ELITEHUBS HARDWARE
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
          FORGE YOUR SUPREME PC.{' '}
          <span 
            className={`bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.colors.gradient}`}
          >
            LIVE IN REAL-TIME 3D.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl font-mono leading-relaxed">
          Interactive 360° cabinet visualization, automated socket & wattage compatibility checks, and 2,900+ authentic components with verified pricing.
        </p>

        {/* Theme Picker Strip right on the Front Page */}
        <div className="mt-7 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-2 text-xs font-mono text-slate-400">
            <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
            <span>Select Aesthetic Theme:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {THEMES.map(theme => {
              const isActive = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-lg ring-1' 
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-transparent'
                  }`}
                  style={{
                    borderColor: isActive ? theme.colors.primary : 'transparent',
                    boxShadow: isActive ? `0 0 16px -2px ${theme.colors.glow}` : 'none'
                  }}
                >
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: theme.colors.primary }} 
                  />
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStartBuilding}
            className="px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-black transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            style={{ 
              backgroundColor: currentTheme.colors.primary,
              boxShadow: `0 0 25px -4px ${currentTheme.colors.glow}`
            }}
          >
            <Cpu className="w-4 h-4 text-black" />
            <span>Open 3D PC Configurator</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onOpenPresets}
            className="px-5 py-3 rounded-xl font-mono text-xs sm:text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Explore Battle-Ready Presets</span>
          </button>

          <button
            onClick={onOpenCatalog}
            className="px-5 py-3 rounded-xl font-mono text-xs sm:text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Browse 2,900+ Parts</span>
          </button>
        </div>

        {/* Feature Specs Badges Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl text-left">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Cabinet View</span>
            </div>
            <div className="text-sm font-bold text-white font-display">Real-Time WebGL</div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">360° orbit with openable glass panel</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Validation</span>
            </div>
            <div className="text-sm font-bold text-white font-display">Zero Bottlenecks</div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">Socket, DDR & wattage verification</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-1">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>7 RGB Profiles</span>
            </div>
            <div className="text-sm font-bold text-white font-display">Dynamic Lighting</div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">Live interior illumination sync</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-1">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>FPS Estimator</span>
            </div>
            <div className="text-sm font-bold text-white font-display">1080p / 1440p / 4K</div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">Real-time benchmark projection</p>
          </div>
        </div>
      </div>
    </section>
  );
}
