import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  ShoppingBag, 
  Download, 
  Check, 
  Gauge,
  Flame,
  Gamepad2,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { checkCompatibility, calculateGamingScores } from '../utils/compatibility';

export default function BuildSummarySidebar({ 
  build = {}, 
  onOpenPresets 
}) {
  const [copied, setCopied] = useState(false);

  // Compute total price & MRP
  const items = Object.values(build).filter(Boolean);
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.compare_at_price || item.price || 0), 0);
  const totalSavings = totalMrp - totalPrice;

  // Compatibility analysis
  const compatibility = checkCompatibility(build);
  const gaming = calculateGamingScores(build);

  const psuWattage = build.psu?.specs?.wattage || 750;
  const wattagePct = Math.min(100, Math.round((compatibility.estimatedWattage / psuWattage) * 100));

  // Copy build spec to clipboard
  const handleShareBuild = () => {
    let specText = `=== COMPUTER CARE CUSTOM PC BUILD ===\n\n`;
    const cats = [
      ['Cabinet', build.case],
      ['Processor (CPU)', build.cpu],
      ['Motherboard', build.motherboard],
      ['Graphics Card (GPU)', build.gpu],
      ['Memory (RAM)', build.ram],
      ['Storage', build.storage],
      ['Power Supply (PSU)', build.psu],
      ['Cooler', build.cooler],
      ['Monitor', build.monitor]
    ];

    cats.forEach(([label, item]) => {
      if (item) {
        specText += `• ${label}: ${item.title} (₹${item.price.toLocaleString('en-IN')})\n`;
      }
    });

    specText += `\nEstimated Consumption: ~${compatibility.estimatedWattage}W\n`;
    specText += `Total Price: ₹${totalPrice.toLocaleString('en-IN')}\n`;
    specText += `Compatibility: ${compatibility.isCompatible ? "100% Compatible" : "Issues Detected"}\n`;
    specText += `Configured on Computer Care 3D PC Configurator (computercare.in)\n`;

    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleOrderBuild = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    alert(`Order inquiry initiated for ${items.length} parts totaling ₹${totalPrice.toLocaleString('en-IN')}! Our Ghaziabad store team will review stock and contact you shortly.`);
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-5 flex flex-col gap-5 shadow-xl">
      {/* Price Summary Header */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
          <span>BUILD TOTAL ({items.length} parts)</span>
          {totalSavings > 0 && (
            <span className="text-emerald-400 font-medium">
              Save ₹{totalSavings.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
          {totalSavings > 0 && (
            <span className="text-sm font-mono text-slate-500 line-through">
              ₹{totalMrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Compatibility Badge & Diagnostics */}
      <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
        compatibility.isCompatible 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
          : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center gap-2">
          {compatibility.isCompatible ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span className="text-xs font-mono font-semibold uppercase tracking-wider">
            {compatibility.isCompatible ? "Compatibility Verified" : "Compatibility Alert"}
          </span>
        </div>

        {compatibility.issues.length > 0 && (
          <div className="text-[11px] space-y-1.5 mt-1 border-t border-rose-500/20 pt-2">
            {compatibility.issues.map((iss, i) => (
              <div key={i} className="text-rose-200">
                • <strong className="text-rose-100">{iss.title}:</strong> {iss.message}
              </div>
            ))}
          </div>
        )}

        {compatibility.warnings.length > 0 && (
          <div className="text-[11px] space-y-1 mt-1 border-t border-amber-500/20 pt-1.5 text-amber-300">
            {compatibility.warnings.map((w, i) => (
              <div key={i}>⚠️ {w.message}</div>
            ))}
          </div>
        )}
      </div>

      {/* Wattage Gauge */}
      <div className="p-3.5 bg-brand-card/70 border border-white/5 rounded-xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Power Consumption</span>
          </div>
          <span className="font-mono text-xs font-semibold text-white">
            ~{compatibility.estimatedWattage}W / {build.psu ? `${psuWattage}W` : "750W (rec)"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              wattagePct > 90 ? 'bg-rose-500' : wattagePct > 70 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(10, wattagePct))}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          {build.psu 
            ? `Load headroom: ${100 - wattagePct}% remaining on ${psuWattage}W PSU` 
            : `Recommended PSU rating: at least ${Math.ceil(compatibility.estimatedWattage * 1.3)}W`}
        </p>
      </div>

      {/* Estimated Gaming Performance Breakdown */}
      <div className="p-3.5 bg-brand-card/70 border border-white/5 rounded-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Estimated Gaming FPS</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Ultra Settings</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="block text-[10px] font-mono text-slate-400">1080p Ultra</span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              {gaming.aaa1080pFps}+
            </span>
            <span className="text-[9px] text-slate-500 block">FPS</span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="block text-[10px] font-mono text-slate-400">1440p High</span>
            <span className="font-mono font-bold text-sm text-cyan-400">
              {gaming.aaa1440pFps}+
            </span>
            <span className="text-[9px] text-slate-500 block">FPS</span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="block text-[10px] font-mono text-slate-400">4K Ray-Trace</span>
            <span className="font-mono font-bold text-sm text-pink-400">
              {gaming.aaa4kFps}+
            </span>
            <span className="text-[9px] text-slate-500 block">FPS</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-auto">
        <button
          onClick={handleOrderBuild}
          disabled={items.length === 0}
          className="w-full py-3 px-4 rounded-xl font-display uppercase tracking-wider text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Build / Buy Parts</span>
        </button>

        <button
          onClick={handleShareBuild}
          disabled={items.length === 0}
          className="w-full py-2.5 px-3 rounded-xl font-mono text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Build Spec Sheet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
