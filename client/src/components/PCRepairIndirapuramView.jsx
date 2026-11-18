import React from 'react';
import { Wrench, MapPin, Clock, Phone, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import StoreLocationMap from './StoreLocationMap';
import { STORE_NAME, STORE_ADDRESS, STORE_PHONE, STORE_DISPLAY_PHONE, STORE_HOURS } from '../constants/storeInfo';

export default function PCRepairIndirapuramView({ onNavigate = () => {} }) {
  // TODO: Verify exact driving distance and commute time from Indirapuram (e.g. ~9 km via CISF Camp Road / NH-9)
  const drivingDistanceKm = '9.5 km'; // TODO: confirm exact distance
  const commuteTimeMin = '18–25 mins'; // TODO: confirm commute time

  const INDIRAPURAM_FAQS = [
    {
      q: 'How far is Computer Care from Indirapuram, Ghaziabad?',
      a: `Computer Care is situated at G 23 Shiva Tower, approximately ${drivingDistanceKm} (${commuteTimeMin}) from Shipra Sun City, Ahinsa Khand, Vaibhav Khand, and Nyay Khand in Indirapuram via NH-9 and Mohan Nagar link road. We provide on-spot diagnostics and same-day turnaround.`
    },
    {
      q: 'Do you offer laptop repair and servicing for Indirapuram residents?',
      a: 'Yes, we provide full laptop servicing including internal heatsink thermal repasting, keyboard replacements, broken hinge repairs, screen replacements, and SSD upgrades for all major brands (Dell, HP, Lenovo, Asus, Acer, Apple MacBook).'
    },
    {
      q: 'Can I drop off my desktop for diagnostics on Saturday?',
      a: 'Yes, Computer Care is open Monday through Saturday from 10:30 AM to 8:00 PM IST (closed Sunday). You can bring your machine directly to our Shiva Tower service desk for immediate testing.'
    },
    {
      q: 'Do you provide genuine brand replacement parts with warranty?',
      a: '100% of replacement components (SSDs, RAM modules, power supplies, motherboards, fans) installed at Computer Care are brand-sealed units accompanied by official manufacturer warranty and GST tax invoices.'
    }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* 1. Header Hero */}
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue font-mono text-xs font-bold w-fit mb-3 border border-blue-200">
          <Wrench className="w-3.5 h-3.5" />
          <span>FAST PC & LAPTOP REPAIR FOR INDIRAPURAM</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          PC Repair & Laptop Servicing in Indirapuram, Ghaziabad
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Reliable desktop troubleshooting, blue screen (BSOD) fixes, high-speed SSD upgrades, and thermal cleaning just {drivingDistanceKm} ({commuteTimeMin}) from Indirapuram at Computer Care Shiva Tower.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Serving Ahinsa Khand, Vaibhav Khand, Nyay Khand & Niti Khand</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Same-Day Diagnostic Turnaround</span>
          </span>
        </div>
      </header>

      {/* 2. Common Services for Indirapuram Working Professionals & Students */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              Work-From-Home Desktop & Laptop Diagnostics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Instant bench troubleshooting for sudden shutdowns, boot loops, overheating laptops, corrupted operating systems, and Wi-Fi connectivity failures.
            </p>
          </div>
          <a
            href={`https://wa.me/919810550222?text=${encodeURIComponent('Hi Computer Care, I need PC repair assistance in Indirapuram.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Ask Technician on WhatsApp &rarr;</span>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              HDD to High-Speed NVMe SSD Upgrades
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Make your slow office PC or study laptop boot in 10 seconds. We clone your complete Windows environment, personal documents, and apps with zero data loss.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog-storage')}
            className="mt-4 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
          >
            <span>Browse Storage Upgrades &rarr;</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              Gaming Rig Servicing & Thermal Repaste
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Deep dust extraction, heatsink flush, and premium Noctua/Arctic thermal compound application to lower gaming temps by up to 15°C.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="mt-4 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
          >
            <span>View All Repair Services &rarr;</span>
          </button>
        </div>
      </section>

      {/* 3. Distance & Direction Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            EASY COMMUTE FROM INDIRAPURAM
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
            Need Expert Help Today? Visit Our Shiva Tower Workshop
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Take the CISF Camp Road or NH-9 toward Shiva Tower, Ghaziabad. We inspect your device on our diagnostic bench while you consult directly with our hardware technicians.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <a
            href={`https://www.google.com/maps/dir/Indirapuram,+Ghaziabad,+Uttar+Pradesh/${encodeURIComponent(STORE_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm no-underline"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route from Indirapuram</span>
          </a>
        </div>
      </div>

      {/* 4. Interactive Store Map */}
      <StoreLocationMap />

      {/* 5. Indirapuram Specific FAQs */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight mb-4">
          Frequently Asked Questions — PC Repair in Indirapuram
        </h2>
        <div className="divide-y divide-slate-100">
          {INDIRAPURAM_FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5 font-display">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
