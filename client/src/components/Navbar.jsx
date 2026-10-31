import React, { useState } from 'react';
import { 
  Cpu, 
  Box, 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  Palette,
  ChevronDown,
  Check
} from 'lucide-react';
import { THEMES } from '../utils/themePresets';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  buildCount, 
  totalPrice,
  currentTheme,
  onSelectTheme,
  onOpenPresets,
  onResetBuild 
}) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  return (
    <header 
      className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: `${currentTheme.colors.surface}cc`,
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('builder')}
        >
          <div 
            className="w-10 h-10 rounded-xl p-[1.5px] transition-all group-hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})`,
              boxShadow: `0 0 20px -3px ${currentTheme.colors.glow}`
            }}
          >
            <div 
              className="w-full h-full rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <Cpu className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-wider text-white">NEXUS</span>
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  color: currentTheme.colors.primary,
                  border: `1px solid ${currentTheme.colors.primary}40`
                }}
              >
                {currentTheme.badge} RIG
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">EliteHubs Powered</p>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-black/30">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'builder'
                ? 'text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'builder' ? currentTheme.colors.primary : 'transparent',
              boxShadow: activeTab === 'builder' ? `0 0 15px -2px ${currentTheme.colors.glow}` : 'none'
            }}
          >
            <Box className="w-4 h-4" />
            <span>3D PC Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'catalog'
                ? 'text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'catalog' ? currentTheme.colors.primary : 'transparent',
              boxShadow: activeTab === 'catalog' ? `0 0 15px -2px ${currentTheme.colors.glow}` : 'none'
            }}
          >
            <Layers className="w-4 h-4" />
            <span>Components Catalog (2,900+)</span>
          </button>

          <button
            onClick={onOpenPresets}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all border border-amber-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Curated Presets</span>
          </button>
        </nav>

        {/* Right Actions: Theme Selector Dropdown, Total Cost, Reset */}
        <div className="flex items-center gap-3">
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
              title="Change Theme"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: currentTheme.colors.primary }} 
              />
              <span className="hidden sm:inline">{currentTheme.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {themeDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-1"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
                  Select Theme Palette
                </div>
                {THEMES.map(theme => {
                  const isSelected = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onSelectTheme(theme);
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono transition-all ${
                        isSelected 
                          ? 'bg-white/15 text-white font-semibold' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20" 
                          style={{ backgroundColor: theme.colors.primary }} 
                        />
                        <div className="text-left">
                          <div className="leading-none">{theme.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{theme.badge}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Estimated Total</span>
            <span 
              className="font-mono font-bold text-sm"
              style={{ color: currentTheme.colors.primary }}
            >
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={onResetBuild}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            title="Reset Build"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href="https://elitehubs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <span>EliteHubs</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
