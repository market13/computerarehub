import React from 'react';
import { MapPin, Phone, Clock, Mail, ShieldCheck, Wrench, Cpu, Building2, AlertCircle } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants/storeInfo';

export default function AboutView({ onNavigate }) {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Draft Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider">DRAFT - review before publishing.</span>
          <span className="ml-1 text-amber-700">This policy page draft contains standard Indian IT retail guidelines. Please verify specific details.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold w-fit mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>ABOUT COMPUTER CARE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight">
          About Computer Care — Ghaziabad
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Your neighborhood computer hardware store, custom PC builder, and hardware repair center located at Shiva Tower, Ghaziabad, Uttar Pradesh.
        </p>
      </header>

      {/* Shop Story & Profile */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <h2 className="text-xl font-display font-bold text-brand-navy">
          Who We Are
        </h2>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex flex-col gap-4">
          <p>
            Computer Care is a local retail computer shop and technical service center based in Ghaziabad, Uttar Pradesh. We serve students, office professionals, competitive gamers, content creators, and local businesses across Ghaziabad and the Delhi NCR region, as well as shipping custom desktop builds across India.
          </p>
          <p>
            We specialize in custom computer building across all budget tiers — from affordable office desktops and value-conscious home setups (including H61, LGA1155, Lapcare, and Consistent components) to high-performance gaming rigs powered by modern Intel Core, AMD Ryzen, and NVIDIA GeForce RTX hardware.
          </p>

          {/* TODO: Add owner and founding story */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider mb-1">
              Store Background & Philosophy
            </span>
            <p className="text-slate-600 text-xs italic">
              {/* TODO: Add store owner name, founding year, and shop history */}
              Founded with the goal of providing transparent pricing, honest compatibility advice, and dependable after-sales repair support in Ghaziabad. Every component sold comes with an official GST tax invoice and manufacturer warranty.
            </p>
          </div>
        </div>

        {/* Shop Photos Placeholder */}
        <div className="mt-2">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-3">
            Our Store & Lab
          </h3>
          {/* TODO: Replace placeholder with verified store photos when provided */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-44 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-bold text-slate-600">Store Front — Shiva Tower, Ghaziabad</span>
              <span className="text-[11px] text-slate-400 mt-1">Photo placeholder (TODO: upload real shop front photo)</span>
            </div>
            <div className="h-44 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-bold text-slate-600">PC Assembly & Diagnostic Bench</span>
              <span className="text-[11px] text-slate-400 mt-1">Photo placeholder (TODO: upload real workbench photo)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Activities */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 mb-1">
            Custom PC Building
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Tailored configurations from budget office PCs to high-end gaming and 4K editing rigs with verified compatibility.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 mb-1">
            Hardware Repair & Servicing
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Desktop diagnostics, component replacement, laptop servicing, dust cleaning, and thermal repasting in Ghaziabad.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 mb-1">
            GST Invoice & Warranty
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            All parts backed by official manufacturer warranties across India with genuine GST tax invoices for peace of mind.
          </p>
        </div>
      </section>

      {/* Store Location & Hours */}
      <section className="bg-brand-navy text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <h2 className="text-lg font-display font-bold text-white mb-4">
          Visit Our Store in Ghaziabad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <strong className="text-slate-300 block mb-1">Location</strong>
            <span>G 23 Shiva Tower, Ghaziabad, Uttar Pradesh 201009</span>
          </div>
          <div>
            <strong className="text-slate-300 block mb-1">Store Hours</strong>
            <span>Monday – Saturday: 10:30 AM – 8:00 PM IST (Closed Sunday)</span>
          </div>
          <div>
            <strong className="text-slate-300 block mb-1">Phone / WhatsApp</strong>
            <a href="tel:+919810550222" className="text-emerald-400 hover:underline block font-bold">+91 9810550222</a>
          </div>
          <div>
            <strong className="text-slate-300 block mb-1">Support Email</strong>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-300 hover:underline block font-bold">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
