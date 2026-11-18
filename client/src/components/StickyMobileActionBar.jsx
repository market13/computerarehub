import React from 'react';
import { Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function StickyMobileActionBar() {
  const phone = '919810550222';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent('Hello Computer Care Team, I would like to enquire about custom PC builds, repairs, and hardware in Ghaziabad.')}`;

  return (
    <aside
      aria-label="Quick Mobile Helpline and WhatsApp Bar"
      className="md:hidden fixed bottom-[56px] left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 shadow-[0_-2px_12px_rgba(0,0,0,0.3)] select-none"
    >
      {/* 1-Tap Call */}
      <a
        href={`tel:+${phone}`}
        className="flex-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all no-underline"
      >
        <Phone className="w-3.5 h-3.5 text-blue-200 fill-current" />
        <span>Call Helpline</span>
      </a>

      {/* 1-Tap WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all no-underline"
      >
        <WhatsAppIcon variant="current" className="w-4 h-4 fill-current" />
        <span>WhatsApp</span>
      </a>
    </aside>
  );
}
