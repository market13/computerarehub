import React from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

export default function ComponentCard({
  categoryKey,
  categoryLabel,
  icon: Icon,
  item,
  onSelect,
  onRemove,
  onViewDetails,
  compatibilityNote
}) {
  return (
    <div className={`rounded-xl transition-all duration-200 border ${
      item 
        ? 'bg-white border-elite-border hover:border-elite-blue shadow-sm' 
        : 'bg-slate-50 border-dashed border-slate-300 hover:border-elite-blue hover:bg-blue-50/30'
    }`}>
      {item ? (
        // Selected Component State
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Thumbnail & Badges */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div 
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5 cursor-pointer group"
              onClick={() => onViewDetails(item)}
            >
              <img
                src={item.image || item.cdn_image}
                alt={item.title}
                onError={(e) => {
                  if (item.cdn_image && e.target.src !== item.cdn_image) {
                    e.target.src = item.cdn_image;
                  }
                }}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-elite-navy/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-elite-navy text-white">
                  {categoryLabel}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {item.vendor}
                </span>
                {item.specs?.socket && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-elite-blue font-semibold">
                    {item.specs.socket}
                  </span>
                )}
                {item.specs?.vram && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-elite-red font-semibold">
                    {item.specs.vram}
                  </span>
                )}
              </div>

              <h4 
                className="text-xs sm:text-sm font-semibold text-slate-900 truncate hover:text-elite-blue cursor-pointer transition-colors"
                onClick={() => onViewDetails(item)}
                title={item.title}
              >
                {item.title}
              </h4>

              {/* Specs Pills */}
              <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-500 font-sans">
                {item.specs?.ram_type && <span>{item.specs.ram_type} {item.specs.speed}</span>}
                {item.specs?.form_factor && <span>Form: {item.specs.form_factor}</span>}
                {item.specs?.wattage && <span>{item.specs.wattage}W {item.specs.efficiency}</span>}
                {item.specs?.storage_type && <span>{item.specs.capacity} • {item.specs.storage_type}</span>}
                {item.specs?.radiator_size && <span>{item.specs.radiator_size}mm Radiator</span>}
                {item.specs?.color && <span>Color: {item.specs.color}</span>}
              </div>
            </div>
          </div>

          {/* Right: Price & Quick Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-left sm:text-right">
              <span className="font-display font-bold text-sm sm:text-base text-elite-navy block">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              {item.compare_at_price > item.price && (
                <span className="font-mono text-[10px] text-slate-400 line-through">
                  ₹{item.compare_at_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelect(categoryKey)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-700 hover:text-elite-navy bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1"
                title="Change component"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">Change</span>
              </button>

              <button
                onClick={() => onRemove(categoryKey)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-elite-red hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                title="Remove component"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty Slot State
        <div 
          onClick={() => onSelect(categoryKey)}
          className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-elite-blue group-hover:border-elite-blue transition-all shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-elite-blue transition-colors font-display">
                Select {categoryLabel}
              </h4>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                {compatibilityNote || "Click to browse compatible components"}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-lg bg-elite-blue/10 border border-elite-blue/20 text-elite-blue flex items-center justify-center group-hover:bg-elite-blue group-hover:text-white transition-all shadow-sm">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
