import React from 'react';
import { ShieldCheck, Lock, AlertCircle, FileText } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants/storeInfo';

export default function PrivacyPolicyView() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Draft Notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider">DRAFT - review before publishing.</span>
          <span className="ml-1 text-amber-700">This privacy policy draft follows standard Indian e-commerce & IT Act guidelines. Please review before official legal deployment.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold w-fit mb-3 border border-slate-200">
          <Lock className="w-3.5 h-3.5" />
          <span>LEGAL & COMPLIANCE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          How Computer Care ("we", "our", or "us") collects, uses, and protects your personal information when you visit computercaregzb.com or contact our store.
        </p>
      </header>

      {/* Content Sections */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            1. Information We Collect
          </h2>
          <p>
            When you request a custom PC quote, submit a consultation form, place an order, or contact us via WhatsApp, we may collect:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
            <li>Contact details: Full name, phone/WhatsApp number, and email address.</li>
            <li>Delivery details: Postal shipping address, city, state, and pincode.</li>
            <li>Business details: Company name and GSTIN (for B2B bulk tax invoicing).</li>
            <li>Custom PC hardware specifications and budget preferences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            2. How We Use Your Information
          </h2>
          <p>
            We use your data solely for lawful business operations, including:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
            <li>Generating quotations and verifying custom PC hardware compatibility.</li>
            <li>Processing orders, issuing official GST tax invoices, and fulfilling deliveries.</li>
            <li>Sharing tracking links and courier dispatch updates.</li>
            <li>Providing technical assistance, warranty verification, and post-purchase repair support.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            3. Zero Data Sharing & Advertising Safeguards
          </h2>
          <p>
            Computer Care respects your privacy. We never sell, rent, or lease your personal information, phone numbers, or email addresses to third-party marketing companies, advertisers, or lead brokers. Information is only shared with licensed logistics partners (e.g. Bluedart, Delhivery) strictly to complete physical delivery.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            4. Security & Data Retention
          </h2>
          <p>
            We take appropriate technical and operational measures to prevent unauthorized access or disclosure of your information. Quotation and customer records are securely retained as necessary for tax compliance and warranty servicing under applicable Indian laws.
          </p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-brand-navy mb-2">
            5. Contact for Privacy Inquiries
          </h2>
          <p>
            If you have questions about your personal data or wish to update your details, contact us at:
          </p>
          <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <strong className="block text-slate-800">Computer Care</strong>
            <span>G 23 Shiva Tower, Ghaziabad, Uttar Pradesh 201009</span>
            <br />
            <span>Phone: +91 9810550222</span>
            {CONTACT_EMAIL && <span> | Email: {CONTACT_EMAIL}</span>}
          </div>
        </section>
      </div>
    </main>
  );
}
