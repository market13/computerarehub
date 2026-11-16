import React from 'react';
import { ShieldCheck, RotateCcw, AlertCircle, FileText, CheckCircle2, Phone } from 'lucide-react';

export default function WarrantyReturnsView() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Draft Notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider">DRAFT - review before publishing.</span>
          <span className="ml-1 text-amber-700">Please review these warranty and returns terms to ensure alignment with your specific store operations.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold w-fit mb-3 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>WARRANTY & RETURNS POLICY</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight">
          Warranty & Returns Policy
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Clear, straightforward manufacturer warranty coverage and replacement guidelines for all computer hardware purchased from Computer Care.
        </p>
      </header>

      {/* 1. Manufacturer Warranty */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-brand-navy">
            Manufacturer Warranty on All Hardware
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex flex-col gap-3">
          <p>
            All individual components and pre-built computer systems sold by Computer Care carry official manufacturer warranties backed by their respective authorized service centers across India.
          </p>
          <ul className="flex flex-col gap-2 mt-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Processors (CPUs):</strong> Typically 3 years limited manufacturer warranty (Intel & AMD boxed processors).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Motherboards & Graphics Cards:</strong> Typically 3 years manufacturer warranty via brand service centers (ASUS, MSI, Gigabyte, ZOTAC, Colorful, Galax).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>RAM & Storage (SSD):</strong> 3 to 5 years (or limited lifetime depending on manufacturer terms).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Power Supplies (PSUs):</strong> 3 to 10 years manufacturer warranty based on 80 Plus tier and brand.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Budget & Standard Components:</strong> Lapcare, Consistent, and Geonix products are covered by their official national service center networks.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Dead on Arrival (DOA) & Replacement */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-brand-navy">
            Dead On Arrival (DOA) & 7-Day Support
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex flex-col gap-3">
          <p>
            If any component purchased from Computer Care is found non-functional upon initial delivery or assembly, please report it to our team within 7 days of delivery:
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Contact us immediately on WhatsApp at +91 9810550222 with clear unboxing photos/videos and serial numbers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Our technical team will diagnose the issue remotely or in-store at Shiva Tower, Ghaziabad.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Upon verified defect without physical or electrical damage, we assist with immediate brand DOA replacement or RMA processing.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Warranty Exclusions */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-brand-navy">
            Standard Warranty Exclusions
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          <p className="mb-2">
            As per standard brand manufacturer guidelines across India, warranty does not cover:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Physical damage, bent CPU socket pins, cracked PCB, or liquid spillage.</li>
            <li>Burnt components resulting from power surges, improper electrical earthing, or faulty third-party cables.</li>
            <li>Tampered serial number stickers, barcodes, or removed warranty void seals.</li>
            <li>Unauthorized firmware modification or BIOS flashing failures performed outside manufacturer instructions.</li>
          </ul>
        </div>
      </section>

      {/* Contact for Warranty Assistance */}
      <section className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-800">
            Need Warranty Help or RMA Guidance?
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Reach out to our Ghaziabad support desk with your invoice number.
          </p>
        </div>
        <a
          href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20need%20help%20with%20warranty%20claim"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs rounded-lg flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact Warranty Support (+91 9810550222)</span>
        </a>
      </section>
    </main>
  );
}
