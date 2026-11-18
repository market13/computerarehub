import React from 'react';
import { ShoppingBag, MapPin, Clock, Phone, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Navigation, Laptop, Cpu } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import StoreLocationMap from './StoreLocationMap';
import { STORE_NAME, STORE_ADDRESS, STORE_PHONE, STORE_DISPLAY_PHONE, STORE_HOURS } from '../constants/storeInfo';

export default function ComputerShopRajNagarView({ onNavigate = () => {} }) {
  // TODO: Verify exact driving distance and commute time from Raj Nagar Extension (e.g. ~7-9 km via Meerut Road / Elevated Road)
  const drivingDistanceKm = '8.0 km'; // TODO: confirm exact distance
  const commuteTimeMin = '15–20 mins'; // TODO: confirm commute time

  const RAJ_NAGAR_FAQS = [
    {
      q: 'How far is Computer Care from Raj Nagar Extension, Ghaziabad?',
      a: `Computer Care at G 23 Shiva Tower is just ${drivingDistanceKm} (${commuteTimeMin}) from Raj Nagar Extension via the Meerut Road / Grand Trunk Road corridor. Residents and students regularly visit our shop for same-day hardware upgrades, accessories, and PC builds.`
    },
    {
      q: 'Can I purchase genuine computer accessories like Bluetooth mice and keyboards?',
      a: 'Yes, Computer Care stocks genuine wired and Bluetooth mice, gaming mechanical keyboards, headsets, webcams, cables, adapters, and power strips with official manufacturer warranties.'
    },
    {
      q: 'Do you offer desktop repair for home and office PCs near Raj Nagar Extension?',
      a: 'Yes! We provide on-spot diagnostics and repair for power supply failures, boot issues, operating system crashes, motherboard defects, and RAM upgrades.'
    },
    {
      q: 'Are all products sold with official GST invoices for warranty?',
      a: 'Every single component, pre-built PC, and accessory purchased at Computer Care includes an official GST tax invoice, ensuring full pan-India warranty coverage at authorized brand service centers.'
    }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* 1. Header Hero */}
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold w-fit mb-3 border border-emerald-200">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>YOUR NEARBY HARDWARE STORE & REPAIR SHOP</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          Computer Shop near Raj Nagar Extension, Ghaziabad
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Looking for a genuine computer hardware store and repair center near Raj Nagar Extension? Computer Care is located just {drivingDistanceKm} ({commuteTimeMin}) away at Shiva Tower, Ghaziabad.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Serving Raj Nagar Extension, Meerut Road, Noor Nagar & Kavi Nagar</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Mon–Sat 10:30 AM – 8:00 PM IST</span>
          </span>
        </div>
      </header>

      {/* 2. Core Offerings for Raj Nagar Ext Families, Students & Offices */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              Genuine Computer Accessories & Peripherals
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Wired and Bluetooth wireless optical mice, multimedia keyboards, webcams for online classes, headsets, and mousepads with official brand warranty.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog-gaming_mouse')}
            className="mt-4 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
          >
            <span>Explore Accessories Catalog &rarr;</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              Budget Student & Home Study PC Builds
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Reliable, value-engineered desktop systems for online school, coding, accounting, and family computing starting from budget-conscious price points.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="mt-4 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
          >
            <span>Configure Student PC &rarr;</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display mb-2">
              Fast Desktop Diagnostics & Laptop Repairs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Prompt hardware troubleshooting for blue screens, overheating fans, corrupt Windows installations, and hardware upgrades at transparent bench rates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="mt-4 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
          >
            <span>Check Repair Services &rarr;</span>
          </button>
        </div>
      </section>

      {/* 3. Distance & Direction Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            QUICK ACCESS VIA MEERUT ROAD
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
            Visit Computer Care from Raj Nagar Extension
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Direct 15-minute drive via Meerut Road into central Ghaziabad at Shiva Tower. Ample parking, immediate customer assistance, and live testing benches.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <a
            href={`https://www.google.com/maps/dir/Raj+Nagar+Extension,+Ghaziabad,+Uttar+Pradesh/${encodeURIComponent(STORE_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm no-underline"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route from Raj Nagar Ext</span>
          </a>
        </div>
      </div>

      {/* 4. Interactive Store Map */}
      <StoreLocationMap />

      {/* 5. Raj Nagar Extension Specific FAQs */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight mb-4">
          Frequently Asked Questions — Computer Shop near Raj Nagar Extension
        </h2>
        <div className="divide-y divide-slate-100">
          {RAJ_NAGAR_FAQS.map((faq, idx) => (
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
