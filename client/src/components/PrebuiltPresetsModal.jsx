import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PrebuiltPresetsModal({
  isOpen,
  onClose,
  presets = [],
  catalog = {},
  onLoadPreset
}) {
  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    const newBuild = {};
    if (preset.components) {
      Object.entries(preset.components).forEach(([cat, id]) => {
        if (id && catalog[cat]) {
          const found = catalog[cat].find(p => p.id === id);
          if (found) newBuild[cat] = found;
        }
      });
    }

    onLoadPreset(newBuild);
    onClose();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white border border-brand-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-brand-navy text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <h2 className="text-base sm:text-lg font-bold font-display uppercase tracking-wider">
                Battle-Tested Gaming Rig Presets
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Optimized for maximum FPS, zero bottlenecks, and optimal thermal headroom
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50">
          {presets.map((preset) => {
            let total = 0;
            if (preset.components) {
              Object.entries(preset.components).forEach(([cat, id]) => {
                if (id && catalog[cat]) {
                  const found = catalog[cat].find(p => p.id === id);
                  if (found) total += found.price;
                }
              });
            }

            return (
              <div
                key={preset.id}
                className="rounded-xl border border-brand-border bg-white p-5 flex flex-col justify-between transition-all group hover:border-brand-blue hover:shadow-brand-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-blue-50 text-brand-blue border border-blue-200">
                      {preset.tier}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {preset.cabinet_color} Chassis
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display mb-1.5 group-hover:text-brand-blue transition-colors">
                    {preset.name}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
                    {preset.target}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-[11px] font-sans text-slate-700">
                    <div>• RGB Theme: <strong>{preset.rgb_mode}</strong></div>
                    <div>• 100% Genuine Brand Warranty</div>
                    <div>• Assembly & Stress-Testing Included</div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Estimated Total</span>
                    <span className="font-display font-black text-lg text-brand-navy">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectPreset(preset)}
                    className="px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider text-white bg-brand-red hover:bg-brand-redHover flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Load Rig</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
