import React from 'react';
import { Building2 } from 'lucide-react';

export default function BulkOrderFloatingBadge({ activeTab, onNavigate }) {
  const isBulkActive = activeTab === 'bulk-order';

  return (
    <>
      {/* Desktop & Tablet: Vertical Side Tab Clinging to Right Edge */}
      <aside 
        aria-label="Bulk Order & B2B Inquiries"
        className="hidden sm:block fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none"
      >
        <button
          type="button"
          onClick={() => onNavigate('bulk-order')}
          className={`flex items-center gap-2 py-3.5 px-2.5 rounded-l-xl shadow-2xl transition-all duration-200 border-l-2 border-t border-b group cursor-pointer ${
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
      </aside>

      {/* Mobile: Bulk order is integrated directly in header & hamburger menu, keeping mobile bottom navigation clutter-free matching user reference */}
    </>
  );
}
