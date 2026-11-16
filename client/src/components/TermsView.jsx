import React from 'react';
import { FileText, AlertCircle, Scale, CheckCircle2 } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants/storeInfo';

export default function TermsView() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Draft Notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider">DRAFT - review before publishing.</span>
          <span className="ml-1 text-amber-700">Please review these terms and conditions before final legal adoption.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold w-fit mb-3 border border-slate-200">
          <Scale className="w-3.5 h-3.5" />
          <span>TERMS OF SERVICE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Terms governing quotations, component orders, custom computer assemblies, and repairs provided by Computer Care.
        </p>
      </header>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            1. Quotations & Hardware Pricing Validity
          </h2>
          <p>
            Due to real-time volatility in national and international semiconductor pricing (notably graphics cards, processors, and flash storage), quotation estimates provided via our Custom PC Builder or direct WhatsApp consultations are valid for 24 to 48 hours or until distributor stock lasts. Final pricing is locked upon payment or order confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            2. Invoicing & Taxes (GST)
          </h2>
          <p>
            All products and services sold by Computer Care are accompanied by an official tax invoice reflecting applicable Goods & Services Tax (GST). For business buyers, valid GSTIN and business entity details must be provided prior to invoice generation to claim Input Tax Credit (ITC).
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            3. Custom PC Assembly & Compatibility
          </h2>
          <p>
            Our custom PC configurator performs real-time deterministic checks for socket compatibility, memory generation, and estimated power requirements. While we ensure physical and electrical compatibility based on published manufacturer data, customers requesting non-standard modifications or custom cooling setups are advised to consult our engineers prior to parts unsealing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            4. Cancellations & Order Changes
          </h2>
          <p>
            For custom PC builds, components are unboxed, assembled, and stress-tested specifically for the customer. Once component packaging has been opened and assembly initiated, orders cannot be cancelled without deduction of assembly and component re-testing costs. Unopened stock items can be cancelled prior to courier dispatch.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            Computer Care is not liable for indirect, incidental, or consequential damages resulting from improper third-party software installation, operating system crashes, data loss on customer storage drives during repair, or hardware overclocking conducted outside factory specifications. Customers are strongly encouraged to maintain independent backups of critical data before submitting systems for repair.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            6. Governing Jurisdiction
          </h2>
          <p>
            Any disputes arising out of or in connection with transactions or services on computercaregzb.com or at our physical store shall be subject to the exclusive jurisdiction of the competent courts in Ghaziabad, Uttar Pradesh, India.
          </p>
        </section>
      </div>
    </main>
  );
}
