import React, { useState } from 'react';
import { X, ExternalLink, Check, ShieldCheck, Truck } from 'lucide-react';

const SPEC_KEY_LABELS = {
  form_factor: 'Form Factor',
  cabinet_style: 'Cabinet Style',
  color: 'Color',
  supported_motherboards: 'Supported Motherboards',
  max_gpu_length: 'Max GPU Length',
  side_panel: 'Side Panel',
  included_fans: 'Included Fans',
  socket: 'Socket Compatibility',
  ram_type: 'RAM Standard',
  speed: 'Clock Speed / Frequency',
  capacity: 'Capacity',
  vram: 'VRAM / Memory',
  tdp: 'Power / TDP',
  wattage: 'Wattage',
  efficiency: 'Efficiency Rating',
  cooler_type: 'Cooler Type',
  radiator_size: 'Radiator Size',
  fan_size: 'Fan Size',
  lighting: 'Lighting / RGB',
  screen_size: 'Screen Size',
  resolution: 'Resolution',
  refresh_rate: 'Refresh Rate',
  panel_type: 'Panel Type',
  pc_tier: 'Target Use / Tier'
};

function formatSpecKey(key) {
  if (SPEC_KEY_LABELS[key]) return SPEC_KEY_LABELS[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSpecValue(key, val) {
  if (val === null || val === undefined || val === '') return 'N/A';
  if (Array.isArray(val)) return val.join(', ');

  // Append proper engineering units
  if (key === 'max_gpu_length' && (typeof val === 'number' || /^\d+$/.test(String(val)))) {
    return `${val} mm`;
  }
  if (key === 'max_cooler_height' && (typeof val === 'number' || /^\d+$/.test(String(val)))) {
    return `${val} mm`;
  }
  if ((key === 'wattage' || key === 'tdp') && (typeof val === 'number' || /^\d+$/.test(String(val)))) {
    return `${val} W`;
  }

  return String(val);
}

function getSafeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed === '#') {
    return trimmed;
  }
  return '#';
}

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onSelectProduct,
  isSelected 
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !product) return null;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image || product.cdn_image];
  const cdnImages = product.cdn_images || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-elite-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header (EliteHubs Navy) */}
        <div className="p-4 sm:p-5 bg-elite-navy text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-elite-red text-white">
              {product.category}
            </span>
            <span className="text-xs font-medium text-slate-300">
              {product.vendor}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <div className="relative w-full h-64 sm:h-72 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
              <img
                src={images[activeImageIdx] || cdnImages[activeImageIdx]}
                alt={product.title}
                onError={(e) => {
                  if (cdnImages[activeImageIdx] && e.target.src !== cdnImages[activeImageIdx]) {
                    e.target.src = cdnImages[activeImageIdx];
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-14 rounded-lg bg-white border p-1 flex-shrink-0 transition-all ${
                      activeImageIdx === idx 
                        ? 'border-elite-blue ring-2 ring-elite-blue/30' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img || cdnImages[idx]}
                      alt=""
                      onError={(e) => {
                        if (cdnImages[idx] && e.target.src !== cdnImages[idx]) {
                          e.target.src = cdnImages[idx];
                        }
                      }}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Specs & Pricing */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 flex-shrink-0">
            <div>
              <span className="text-[11px] text-emerald-600 font-semibold uppercase block mb-1">
                ● In Stock at Computer Care
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug">
                {product.title}
              </h2>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-display font-black text-elite-navy">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compare_at_price > product.price && (
                  <span className="text-sm font-mono text-slate-400 line-through">
                    ₹{product.compare_at_price.toLocaleString('en-IN')}
                  </span>
                )}
                {product.compare_at_price > product.price && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-elite-red">
                    {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Specifications Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs flex-shrink-0">
              <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200 text-xs font-bold font-display uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Technical Specifications</span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Hardware Specs</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="px-3.5 py-2.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500 font-medium text-xs whitespace-nowrap">
                      {formatSpecKey(key)}
                    </span>
                    <span className="text-slate-800 font-semibold text-xs text-right break-words">
                      {formatSpecValue(key, val)}
                    </span>
                  </div>
                ))}
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-4">
                  <span className="text-slate-500 font-medium text-xs whitespace-nowrap">Brand / Vendor</span>
                  <span className="text-slate-800 font-semibold text-xs text-right">{product.vendor}</span>
                </div>
                {product.sku && (
                  <div className="px-3.5 py-2.5 flex items-center justify-between gap-4 bg-slate-50/40">
                    <span className="text-slate-500 font-medium text-xs whitespace-nowrap">SKU</span>
                    <span className="text-slate-700 font-mono text-[11px] text-right truncate max-w-[220px]" title={product.sku}>
                      {product.sku}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div className="flex items-center gap-4 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex-shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Brand Warranty</span>
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-elite-blue" />
                <span>Express Shipping</span>
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 mt-auto pt-2 flex-shrink-0">
              <button
                onClick={() => {
                  onSelectProduct(product.category, product);
                  onClose();
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-elite-red hover:bg-elite-redHover text-white shadow-md'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Your Rig</span>
                  </>
                ) : (
                  <span>Add To Custom Rig</span>
                )}
              </button>

              <a
                href={getSafeUrl(product.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors"
                title="View Official Product Page"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
