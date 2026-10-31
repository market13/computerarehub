import React from 'react';
import { Building2 } from 'lucide-react';

export default function BulkOrderFloatingBadge({ activeTab, onNavigate }) {
  const isBulkActive = activeTab === 'bulk-order';

  return (
    <aside 
      aria-label="Bulk Order & B2B Inquiries"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none"
    >
      {/* Desktop & Tablet: Vertical Side Tab Clinging to Right Edge */}
      <button
        type="button"
        onClick={() => onNavigate('bulk-order')}
        className={`hidden sm:flex items-center gap-2 py-3.5 px-2.5 rounded-l-xl shadow-2xl transition-all duration-200 border-l-2 border-t border-b group cursor-pointer ${
          isBulkActive
            ? 'bg-[#e11d48] text-white border-rose-300 shadow-rose-500/30 ring-2 ring-rose-400/50'
            : 'bg-[#2b38d1] hover:bg-[#202bb8] text-white border-blue-400/40 hover:pr-3.5 shadow-blue-900/40'
        }`}
        title="B2B & Corporate Bulk Order Inquiries"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span 
            className="text-[11px] font-display font-black tracking-wider uppercase whitespace-nowrap text-white"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Bulk Order
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mt-0.5" />
        </div>
      </button>

      {/* Mobile: Floating Bottom-Right Pill (Does Not Cover Content) */}
      <button
        type="button"
        onClick={() => onNavigate('bulk-order')}
        className={`sm:hidden fixed bottom-5 right-4 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl transition-all border cursor-pointer active:scale-95 ${
          isBulkActive
            ? 'bg-[#e11d48] text-white border-rose-300 ring-2 ring-rose-400/40'
            : 'bg-[#2b38d1] text-white border-blue-400'
        }`}
        title="B2B & Corporate Bulk Order Inquiries"
      >
        <Building2 className="w-4 h-4 text-white" />
        <span className="text-xs font-bold font-display uppercase tracking-wide text-white">Bulk Order</span>
        <span className="text-[9px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded font-mono">
          B2B
        </span>
      </button>
    </aside>
  );
}
