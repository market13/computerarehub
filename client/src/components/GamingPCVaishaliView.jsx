import React from 'react';
import { Cpu, MapPin, Clock, Phone, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Navigation, Box, Zap } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import StoreLocationMap from './StoreLocationMap';
import { STORE_NAME, STORE_ADDRESS, STORE_PHONE, STORE_DISPLAY_PHONE, STORE_HOURS } from '../constants/storeInfo';

export default function GamingPCVaishaliView({ onNavigate = () => {} }) {
  // TODO: Verify exact driving distance and commute time from Vaishali Metro / Sector 4 & 5 (e.g. ~10 km)
  const drivingDistanceKm = '10.2 km'; // TODO: confirm exact distance
  const commuteTimeMin = '20–28 mins'; // TODO: confirm commute time

  const VAISHALI_FAQS = [
    {
      q: 'How far is Computer Care from Vaishali, Ghaziabad?',
      a: `Computer Care is located at G 23 Shiva Tower, roughly ${drivingDistanceKm} (${commuteTimeMin}) from Vaishali Metro Station (Blue Line), Sector 4, and Sector 1. Gamers and creators frequently visit us for live build assembly and testing.`
    },
    {
      q: 'Can I choose my own components or bring my own graphics card?',
      a: 'Absolutely! You can choose all components from our authorized stock or bring specific parts (like your own GPU or storage) for professional assembly, custom cable management, and thermal stress testing.'
    },
    {
      q: 'Do you test custom gaming PCs before handover?',
      a: 'Yes, every custom gaming PC built at Computer Care undergoes a rigorous 24-hour hardware burn-in, Cinebench R23 thermal profiling, FurMark stress testing, and BIOS tuning for XMP/EXPO memory profiles.'
    },
    {
      q: 'What is the starting budget for a custom gaming PC?',
      a: 'We configure custom gaming rigs across all price points — from budget 1080p esports builds starting around ₹35,000 to ultra-enthusiast 4K ray-tracing powerhouses exceeding ₹2,50,000+.'
    }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* 1. Header Hero */}
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold w-fit mb-3 border border-indigo-200">
          <Zap className="w-3.5 h-3.5" />
          <span>ENTHUSIAST GAMING RIGS NEAR VAISHALI</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          Custom Gaming PC Builder near Vaishali, Ghaziabad
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Configure high-FPS gaming computers and 4K editing workstations just {drivingDistanceKm} ({commuteTimeMin}) from Vaishali Metro at Computer Care. Real-time compatibility checks, genuine brand warranty, and same-day consultation.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Serving Vaishali Sector 1, 2, 3, 4, 5 & Kaushambi Border</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>3-Year Brand Warranty on Core Components</span>
          </span>
        </div>
      </header>

      {/* 2. Custom PC Tiers for Vaishali Gamers */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              1080P COMPETITIVE ESPORTS
            </span>
            <h3 className="font-bold text-lg text-slate-900 font-display mt-2 mb-1">
              Esports Champion Builds
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
              Engineered for 165Hz+ high-refresh competitive play in Valorant, CS2, GTA V, and Apex Legends with high single-core CPU speeds.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 mb-4">
              <li>• Intel Core i5 / Ryzen 5 Processors</li>
              <li>• 16GB Dual-Channel DDR4/DDR5 RAM</li>
              <li>• NVIDIA RTX 3050 / RTX 4060 GPUs</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="w-full py-2 px-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-display font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition-colors"
          >
            Configure in Builder &rarr;
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-indigo-300 shadow-md ring-2 ring-indigo-100 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              1440P ULTRA AAA GAMING
            </span>
            <h3 className="font-bold text-lg text-slate-900 font-display mt-2 mb-1">
              High-FPS Ray Tracing Rigs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
              Experience maximum graphical fidelity with ray tracing, DLSS 3.5 frame generation, and liquid-cooled processors.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 mb-4">
              <li>• Intel Core i7 14700K / Ryzen 7 7800X3D</li>
              <li>• 32GB 6000MHz DDR5 Memory Kits</li>
              <li>• NVIDIA GeForce RTX 4070 Super / 4070 Ti</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition-colors"
          >
            Configure in Builder &rarr;
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              4K CREATOR & WORKSTATION
            </span>
            <h3 className="font-bold text-lg text-slate-900 font-display mt-2 mb-1">
              Studio Render Workstations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
              Uncompromised hardware throughput for DaVinci Resolve, Unreal Engine 5, Blender, 3ds Max, and local AI model fine-tuning.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 mb-4">
              <li>• Intel Core i9 / AMD Ryzen 9 7950X</li>
              <li>• 64GB DDR5 ECC / Low-Latency RAM</li>
              <li>• NVIDIA GeForce RTX 4080 Super / 4090</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="w-full py-2 px-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-display font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition-colors"
          >
            Configure in Builder &rarr;
          </button>
        </div>
      </section>

      {/* 3. Direct Route & Distance Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            COMMUTE FROM VAISHALI METRO
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
            Build with Us in Person at Shiva Tower, Ghaziabad
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Convenient drive via Link Road or Madan Mohan Malviya Marg directly to Shiva Tower. Test components in real-time on our test benches.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <a
            href={`https://www.google.com/maps/dir/Vaishali,+Ghaziabad,+Uttar+Pradesh/${encodeURIComponent(STORE_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm no-underline"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route from Vaishali</span>
          </a>
        </div>
      </div>

      {/* 4. Interactive Store Map */}
      <StoreLocationMap />

      {/* 5. Vaishali Specific FAQs */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight mb-4">
          Frequently Asked Questions — Custom Gaming PCs in Vaishali
        </h2>
        <div className="divide-y divide-slate-100">
          {VAISHALI_FAQS.map((faq, idx) => (
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
