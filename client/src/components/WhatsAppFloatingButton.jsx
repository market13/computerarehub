import React, { useState } from 'react';
import { X } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const phone = "919810550222";
  const message = encodeURIComponent("Hello Computer Care Team, I have an inquiry regarding PC builds, parts and pricing.");
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <aside 
      aria-label="WhatsApp Support Floating Action" 
      className="hidden lg:flex fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex-col items-end select-none group pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Tooltip Card (Reveals on Hover or Auto-Nudge) */}
      {!tooltipDismissed && (
        <div 
          className={`mb-3 mr-1 transition-all duration-300 transform origin-bottom-right ${
            isHovered ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 pointer-events-none translate-y-2'
          }`}
        >
          <div className="bg-white text-slate-800 rounded-2xl p-3.5 shadow-2xl border border-slate-200/90 w-64 flex flex-col gap-2 relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTooltipDismissed(true);
              }}
              className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Close"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-900 font-display">Computer Care Support</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              Need help choosing PC parts or want a custom quotation? Chat with our hardware specialists directly on WhatsApp!
            </p>

            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>+91 9810550222</span>
              <span className="text-emerald-600 font-semibold">Replies in ~5 mins</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Computer Care on WhatsApp (+91 9810550222)"
        title="Chat on WhatsApp (+91 9810550222)"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/50 drop-shadow-xl hover:drop-shadow-2xl"
      >
        <WhatsAppIcon variant="badge" className="w-full h-full" />

        {/* Online Status Pill on the corner */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center z-20 shadow-xs">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
        </span>
      </a>
    </aside>
  );
}
