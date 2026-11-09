import React, { useState } from 'react';
import { X } from 'lucide-react';

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
        className="relative flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/50 overflow-visible"
      >
        {/* WhatsApp Official Silhouette Icon */}
        <svg 
          className="w-7 h-7 sm:w-9 sm:h-9 fill-current text-white relative z-10 drop-shadow-xs" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.086-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.2-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.234-.244-.587-.492-.507-.677-.516-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.802.376s-1.053 1.028-1.053 2.508 1.078 2.91 1.229 3.111c.15.201 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.94.55 3.75 1.51 5.29L2 22l4.83-1.48c1.48.88 3.2 1.38 5.21 1.38 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.25c-1.74 0-3.37-.53-4.74-1.45l-.34-.23-2.87.88.89-2.79-.24-.35c-1.02-1.45-1.57-3.17-1.57-4.99 0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25z"/>
        </svg>

        {/* Online Status Pill on the corner */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-300 border-2 border-white rounded-full flex items-center justify-center z-20">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600" />
        </span>
      </a>
    </aside>
  );
}
