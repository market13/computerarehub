import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, Phone, ExternalLink } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { 
  STORE_NAME, 
  STORE_ADDRESS, 
  STORE_PHONE, 
  STORE_DISPLAY_PHONE, 
  STORE_HOURS, 
  STORE_LANDMARK,
  GOOGLE_MAPS_URL 
} from '../constants/storeInfo';

/**
 * Computes whether the store is currently open according to Indian Standard Time (IST, UTC+5:30)
 * Operating Hours: Monday to Saturday, 10:30 AM - 8:00 PM IST (Closed Sunday)
 */
function getIstStoreStatus() {
  const now = new Date();
  // IST is UTC + 5 hours 30 minutes
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcMs + istOffsetMs);

  const day = istTime.getDay(); // 0 = Sunday, 1-6 = Mon-Sat
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const openMinutes = 10 * 60 + 30; // 10:30 AM IST (630 mins)
  const closeMinutes = 20 * 60;     // 8:00 PM IST (1200 mins)

  if (day === 0) {
    return {
      isOpen: false,
      badgeText: 'Closed Today (Sunday)',
      detailText: 'Opens Monday at 10:30 AM IST'
    };
  }

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      badgeText: 'Open Now',
      detailText: 'Open today until 8:00 PM IST'
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      badgeText: 'Closed Now',
      detailText: 'Opens today at 10:30 AM IST'
    };
  } else {
    return {
      isOpen: false,
      badgeText: 'Closed Now',
      detailText: day === 6 ? 'Opens Monday at 10:30 AM IST' : 'Opens tomorrow at 10:30 AM IST'
    };
  }
}

export default function StoreLocationMap({ className = '' }) {
  const [status, setStatus] = useState(getIstStoreStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getIstStoreStatus());
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_ADDRESS)}`;

  return (
    <section className={`w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Information Pane */}
        <div className="p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between gap-6 bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-gold">
                STORE LOCATION & VISIT
              </span>
              {/* Live Open / Closed Indicator */}
              <span 
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  status.isOpen 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{status.badgeText}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-snug">
              Visit Computer Care in Ghaziabad
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
              Drop by for immediate PC hardware consultations, bench testing, custom build quotation reviews, and same-day computer repair diagnostics.
            </p>

            <div className="mt-5 flex flex-col gap-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Store Address:</strong>
                  <span className="text-slate-300">{STORE_ADDRESS}</span>
                  {/* Nearby Landmark with TODO */}
                  <div className="text-[11px] text-brand-gold/90 mt-0.5">
                    <strong>Nearby Landmark:</strong> {STORE_LANDMARK}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Business Hours:</strong>
                  <span className="text-slate-300">{STORE_HOURS}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Status: {status.detailText}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Direct Desk:</strong>
                  <a href={`tel:${STORE_PHONE}`} className="text-emerald-400 hover:underline font-bold">
                    {STORE_DISPLAY_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-slate-800">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-sm no-underline"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <a
              href={`https://wa.me/919810550222?text=${encodeURIComponent('Hello Computer Care, I am planning to visit your Shiva Tower Ghaziabad store.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-sm no-underline"
            >
              <WhatsAppIcon variant="badge" className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>

        {/* Right Google Maps Embed Pane */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] bg-slate-100 flex flex-col">
          <iframe
            title="Computer Care Store Location in Ghaziabad"
            src="https://maps.google.com/maps?q=G+23+Shiva+Tower+Ghaziabad+Uttar+Pradesh+201009&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[320px] lg:min-h-[400px] border-0"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <span>Can't view the map?</span>
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
