import React, { useState } from 'react';
import { 
  Box, 
  Cpu, 
  Layers, 
  Zap, 
  Flame, 
  HardDrive, 
  Fan, 
  Tv, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  Share2,
  Check,
  Gamepad2,
  ExternalLink,
  Plus,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

import ComponentCard from './ComponentCard';
import ExpertConsultationForm from './ExpertConsultationForm';
import { checkCompatibility, calculateGamingScores } from '../utils/compatibility';

const COMPONENT_SLOTS = [
  { key: 'case', label: 'PC Cabinet / Case', icon: Box, required: true },
  { key: 'case_fan', label: 'Cabinet Cooling Fans', icon: Fan, required: false },
  { key: 'cpu', label: 'Processor (CPU)', icon: Cpu, required: true },
  { key: 'motherboard', label: 'Motherboard', icon: Layers, required: true },
  { key: 'ram', label: 'Memory (RAM)', icon: Zap, required: true },
  { key: 'gpu', label: 'Graphics Card (GPU)', icon: Flame, required: true },
  { key: 'cooler', label: 'CPU Cooler / AIO', icon: Fan, required: true },
  { key: 'storage', label: 'Storage (SSD / NVMe)', icon: HardDrive, required: true },
  { key: 'psu', label: 'Power Supply Unit', icon: Zap, required: true },
  { key: 'monitor', label: 'Gaming Monitor', icon: Tv, required: false },
];

export default function PCBuilderView({
  build,
  onOpenSelector,
  onRemoveComponent,
  onViewDetails,
  onOpenPresets,
  onResetBuild,
  onAddToCart
}) {
  const [copied, setCopied] = React.useState(false);
  const [builderMode, setBuilderMode] = useState('diy'); // 'diy' | 'consultation'

  const items = Object.values(build).filter(Boolean);
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.compare_at_price || item.price || 0), 0);
  const totalSavings = totalMrp - totalPrice;

  const compatibility = checkCompatibility(build);
  const gaming = calculateGamingScores(build);

  const psuWattage = build.psu?.specs?.wattage || 750;
  const wattagePct = Math.min(100, Math.round((compatibility.estimatedWattage / psuWattage) * 100));

  const handleShareBuild = () => {
    let specText = `=== COMPUTER CARE CUSTOM PC RIG ===\n\n`;
    COMPONENT_SLOTS.forEach(slot => {
      const item = build[slot.key];
      if (item) {
        specText += `• ${slot.label}: ${item.title} - ₹${item.price.toLocaleString('en-IN')}\n`;
      }
    });

    specText += `\nEstimated Consumption: ~${compatibility.estimatedWattage}W\n`;
    specText += `Total Price: ₹${totalPrice.toLocaleString('en-IN')}\n`;
    specText += `Compatibility: ${compatibility.isCompatible ? "100% Compatible" : "Review Alerts"}\n`;
    specText += `Built on Computer Care PC Configurator (Shiva Tower, Ghaziabad)\n`;

    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Title & Presets Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-brand-navy text-white">
              CUSTOM PC RIG
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Real-Time Hardware Compatibility & Wattage Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight">
            CUSTOM PC CONFIGURATOR
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="px-4 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider text-brand-navy bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Battle-Ready Rig</span>
          </button>

          <button
            onClick={onResetBuild}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Reset Build"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dual Option Switcher: Build Your Own PC vs Submit Info for Expert Call */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: DIY Configurator */}
        <div
          onClick={() => setBuilderMode('diy')}
          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
            builderMode === 'diy'
              ? 'bg-gradient-to-br from-slate-900 to-slate-950 text-white border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                builderMode === 'diy' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}>
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                  builderMode === 'diy' ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  Option 1 • Self-Serve Configurator
                </span>
                <h3 className="text-base sm:text-lg font-display font-black tracking-tight">
                  Build Your Own PC
                </h3>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              builderMode === 'diy' ? 'border-blue-400 bg-blue-500 text-white' : 'border-slate-300'
            }`}>
              {builderMode === 'diy' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <p className={`text-xs leading-relaxed mb-4 ${
            builderMode === 'diy' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Handpick your Processor, Motherboard, GPU, RAM, Storage, and Cabinet with real-time socket compatibility, power estimation, and gaming benchmark simulation.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/20 text-xs">
            <span className={`font-mono text-[11px] ${
              builderMode === 'diy' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              10 Component Slots • Live Diagnostics
            </span>
            <span className={`font-bold flex items-center gap-1 ${
              builderMode === 'diy' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <span>Open Configurator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Option 2: Expert Call & Recommendation */}
        <div
          onClick={() => setBuilderMode('consultation')}
          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
            builderMode === 'consultation'
              ? 'bg-gradient-to-br from-[#0c1836] to-[#080f24] text-white border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                builderMode === 'consultation' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                  builderMode === 'consultation' ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  Option 2 • Free Hardware Advisory
                </span>
                <h3 className="text-base sm:text-lg font-display font-black tracking-tight">
                  Get Expert Call & Recommendation
                </h3>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              builderMode === 'consultation' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-300'
            }`}>
              {builderMode === 'consultation' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <p className={`text-xs leading-relaxed mb-4 ${
            builderMode === 'consultation' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Not sure which CPU or GPU fits your work? Submit your target budget and primary use (Gaming, 3D VFX, Editing, Office, AI/ML). Our hardware team will call you to recommend the perfect rig.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/20 text-xs">
            <span className={`font-mono text-[11px] ${
              builderMode === 'consultation' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Callback in ~30 Mins • Zero Obligation
            </span>
            <span className={`font-bold flex items-center gap-1 ${
              builderMode === 'consultation' ? 'text-amber-400' : 'text-amber-600'
            }`}>
              <span>Request Callback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {builderMode === 'consultation' ? (
        <ExpertConsultationForm onBackToBuilder={() => setBuilderMode('diy')} />
      ) : (
        /* Main 2-Column Configurator Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Left Column: 10 Hardware Component Slots */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3 min-w-0 w-full">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold font-display text-slate-900 uppercase tracking-wide">
              Selected Hardware Components ({items.length}/10 Added)
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Click any component to customize
            </span>
          </div>

          {COMPONENT_SLOTS.map((slot) => {
            const item = build[slot.key];

            let compatibilityNote = null;
            if (!item) {
              if (slot.key === 'motherboard' && build.cpu?.specs?.socket) {
                compatibilityNote = `Requires ${build.cpu.specs.socket} socket motherboard`;
              } else if (slot.key === 'ram' && build.motherboard?.specs?.ram_type) {
                compatibilityNote = `Requires ${build.motherboard.specs.ram_type} memory standard`;
              } else if (slot.key === 'cpu' && build.motherboard?.specs?.socket) {
                compatibilityNote = `Requires ${build.motherboard.specs.socket} compatible CPU`;
              } else if (slot.key === 'psu' && build.gpu) {
                compatibilityNote = `Recommended: 750W+ for ${build.gpu.specs?.vram || 'RTX/Radeon'}`;
              }
            }

            return (
              <ComponentCard
                key={slot.key}
                categoryKey={slot.key}
                categoryLabel={slot.label}
                icon={slot.icon}
                item={item}
                compatibilityNote={compatibilityNote}
                onSelect={(cat) => onOpenSelector(cat)}
                onRemove={(cat) => onRemoveComponent(cat)}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </div>

        {/* Right Column: Build Summary & Live Telemetry (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24 min-w-0 w-full">
          {/* Selected Chassis Preview Card */}
          <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4 text-brand-navy" />
                <span>Chassis Preview</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                {build.case ? "CASE SELECTED" : "CASE EMPTY"}
              </span>
            </div>

            {build.case ? (
              <div className="flex items-center gap-3">
                <div 
                  className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => onViewDetails(build.case)}
                >
                  <img
                    src={build.case.image || build.case.cdn_image}
                    alt={build.case.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block truncate">
                    {build.case.vendor || 'PC Cabinet'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {build.case.title}
                  </h4>
                  <div className="text-xs font-black text-brand-navy mt-1">
                    ₹{build.case.price?.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => onOpenSelector('case')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5 block"
                  >
                    Change Cabinet
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => onOpenSelector('case')}
                className="p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-lg text-center cursor-pointer group bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
                    Choose PC Cabinet
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Select from 340+ authentic cases
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Build Cost & Checkout Header */}
          <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Rig Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl text-brand-navy">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  {totalSavings > 0 && (
                    <span className="text-xs font-mono text-slate-400 line-through">
                      ₹{totalMrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleShareBuild}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors"
                title="Share Build Spec Sheet"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={onAddToCart}
              disabled={items.length === 0}
              className="w-full bg-brand-red hover:bg-brand-redHover text-white py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Rig / Add to Cart ({items.length} Parts)</span>
            </button>
          </div>

          {/* Compatibility Diagnostics Card */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
            compatibility.isCompatible 
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-2">
              {compatibility.isCompatible ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-brand-red flex-shrink-0" />
              )}
              <span className="text-xs font-display font-bold uppercase tracking-wider">
                {compatibility.isCompatible ? "Compatibility Verified (100% Match)" : "Hardware Incompatibility Detected"}
              </span>
            </div>

            {compatibility.issues.length > 0 && (
              <div className="text-xs space-y-1.5 mt-1 border-t border-rose-200 pt-2 font-medium">
                {compatibility.issues.map((iss, i) => (
                  <div key={i} className="text-brand-red">
                    • <strong>{iss.title}:</strong> {iss.message}
                  </div>
                ))}
              </div>
            )}

            {compatibility.warnings.length > 0 && (
              <div className="text-xs space-y-1 mt-1 border-t border-amber-200 pt-1.5 text-amber-800">
                {compatibility.warnings.map((w, i) => (
                  <div key={i}>⚠️ {w.message}</div>
                ))}
              </div>
            )}
          </div>

          {/* Telemetry Summary: Power Consumption & Gaming FPS */}
          <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs flex flex-col gap-4">
            {/* Wattage Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Estimated Power Consumption</span>
                </div>
                <span className="font-mono font-bold text-brand-navy">
                  ~{compatibility.estimatedWattage}W / {build.psu ? `${psuWattage}W` : "750W (rec)"}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    wattagePct > 90 ? 'bg-brand-red' : wattagePct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, wattagePct))}%` }}
                />
              </div>
            </div>

            {/* Estimated Gaming Benchmarks */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-2 font-medium">
                <div className="flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-brand-blue" />
                  <span>Estimated Ultra Gaming Performance</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Zero Bottlenecks</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">1080p Ultra</span>
                  <span className="font-display font-bold text-base text-emerald-600">
                    {gaming.aaa1080pFps}+ FPS
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">1440p High</span>
                  <span className="font-display font-bold text-base text-brand-blue">
                    {gaming.aaa1440pFps}+ FPS
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">4K Ray-Trace</span>
                  <span className="font-display font-bold text-base text-brand-navy">
                    {gaming.aaa4kFps}+ FPS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Need Expert Guidance CTA in Sidebar */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-4 rounded-xl border border-amber-200/90 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Need Help Choosing Parts?</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed font-sans">
              Confused between Intel vs AMD, or which GPU fits your budget? Request a free callback from our PC architects.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setBuilderMode('consultation')}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs flex-1"
              >
                <span>Request Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="tel:9810550222"
                className="px-3 py-2 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                title="Call 9810550222"
              >
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Mobile Sticky Bottom Summary Bar for Builder */}
      {builderMode === 'diy' && items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold truncate">
              {items.length}/10 Parts Added
            </span>
            <span className="text-base font-black font-display text-brand-navy leading-none">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleShareBuild}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Specsheet"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              className="px-3.5 py-2 rounded-lg bg-[#2b38d1] hover:bg-[#202bb8] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
