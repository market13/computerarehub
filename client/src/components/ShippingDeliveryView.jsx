import React from 'react';
import { Truck, Package, MapPin, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

export default function ShippingDeliveryView() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Draft Notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider">DRAFT - review before publishing.</span>
          <span className="ml-1 text-amber-700">Please review delivery lead times and carrier partner specifics before final publication.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue font-mono text-xs font-bold w-fit mb-3 border border-blue-200">
          <Truck className="w-3.5 h-3.5" />
          <span>SHIPPING & DELIVERY INFORMATION</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight">
          Shipping & Delivery Information
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Fast, secure shipping across all states in India and convenient same-day store pickup at Shiva Tower, Ghaziabad.
        </p>
      </header>

      {/* Grid of Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Pickup */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-2">
              Local Ghaziabad Store Pickup (Free)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-4">
              Pick up your components or test-drive your completed custom gaming rig directly at our shop in Ghaziabad.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 font-sans">
              <li><strong>Location:</strong> G 23 Shiva Tower, Ghaziabad, UP - 201009</li>
              <li><strong>Pickup Hours:</strong> Mon – Sat: 10:30 AM – 8:00 PM IST</li>
              <li><strong>Advantage:</strong> Live demonstration, on-the-spot component verification, and zero delivery fee.</li>
            </ul>
          </div>
        </div>

        {/* Pan-India Insured Shipping */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-2">
              Pan-India Insured Courier Delivery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-4">
              We ship to all pincodes across India via trusted express logistics partners (Bluedart, Delhivery, DTDC).
            </p>
            <ul className="text-xs text-slate-700 space-y-2 font-sans">
              <li><strong>Transit Insurance:</strong> 100% transit insurance against shipping loss or transit damage.</li>
              <li><strong>Protective Packaging:</strong> Multi-layer bubble wrap, edge guards, and custom expanding foam inside PC cases to protect GPUs during transit.</li>
              <li><strong>Tracking:</strong> Real-time tracking link shared via WhatsApp and SMS immediately upon dispatch.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dispatch & Delivery Timelines */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-lg font-display font-bold text-brand-navy">
          Dispatch & Estimated Delivery Timelines
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Order Category</th>
                <th className="p-3">Preparation & Dispatch Time</th>
                <th className="p-3">Transit Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Individual Components & Peripherals</td>
                <td className="p-3">24 to 48 Hours</td>
                <td className="p-3">Delhi NCR: 1-2 days | Rest of India: 3-5 days</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Custom Built PCs & Gaming Rigs</td>
                <td className="p-3">2 to 4 Business Days (Assembly + 24-hr stress testing)</td>
                <td className="p-3">Delhi NCR: 1-2 days | Major Cities: 3-5 days</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Bulk & B2B Orders</td>
                <td className="p-3">3 to 7 Business Days (Custom scheduling)</td>
                <td className="p-3">Dedicated freight logistics with delivery tracking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Unboxing Instructions */}
      <section className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h3 className="font-display font-bold text-sm text-slate-800 mb-2">
          Important Delivery & Unboxing Guidelines
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          To protect yourself against transit mishandling, we strongly advise recording a continuous unboxing video showing the outer package condition, courier label, and seal breakage. For completed PC builds, please remove the internal expanding packaging foam inside the cabinet before turning on the power supply.
        </p>
      </section>
    </main>
  );
}
