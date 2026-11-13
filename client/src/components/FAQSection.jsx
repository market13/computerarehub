import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'Where can I buy a gaming PC in Ghaziabad?',
    answer:
      'You can buy pre-built and custom gaming PCs directly at Computer Care in Ghaziabad, Uttar Pradesh (G 23 Shiva Tower). We specialize in custom gaming rigs equipped with authentic brand-warranty processors, graphics cards, high-airflow cabinets, and certified power supplies, with insured delivery across Ghaziabad, Delhi NCR, and all of India.'
  },
  {
    question: 'Does Computer Care build custom gaming PCs?',
    answer:
      'Yes, custom gaming PC building is our primary speciality. You can configure your dream gaming rig online using our real-time 3D PC Builder with automated socket and wattage compatibility checks, or consult with our hardware engineers via WhatsApp (+91 9810550222) to design a rig tailored to your favorite games, streaming needs, and budget.'
  },
  {
    question: 'Can I upgrade my existing desktop?',
    answer:
      'Yes! Computer Care provides expert hardware upgrade services for desktops in Ghaziabad. We upgrade RAM (DDR4/DDR5), replace slow HDDs with high-speed PCIe NVMe SSDs, install high-performance NVIDIA GeForce graphics cards, upgrade power supplies (PSUs), and install liquid AIO or tower air coolers for better thermal performance.'
  },
  {
    question: 'Where can I buy computer accessories in Ghaziabad?',
    answer:
      'Computer Care offers a comprehensive collection of genuine computer accessories and peripherals in Ghaziabad. Our inventory includes wired and Bluetooth wireless optical mice, mechanical and gaming keyboards, surround-sound headsets, precision mousepads, streaming webcams, studio microphones, and ergonomic gaming chairs from top brands.'
  },
  {
    question: 'Does Computer Care provide computer repair services?',
    answer:
      'Yes, Computer Care provides professional computer repair, diagnostic troubleshooting, and laptop and desktop servicing in Ghaziabad. Our certified hardware technicians handle booting issues, blue screen (BSOD) errors, overheating, power supply failures, hardware cleaning, component replacements, and operating system reinstallation.'
  },
  {
    question: 'Can customers get help choosing PC components?',
    answer:
      'Absolutely. Our hardware specialists provide free consultation to help you choose the right components without bottlenecks. You can submit your requirements through our consultation form or chat directly with our PC builders on WhatsApp at +91 9810550222 for honest, budget-optimized hardware recommendations.'
  },
  {
    question: 'How does Computer Care ensure custom PC parts compatibility?',
    answer:
      'Our custom PC configurator performs real-time deterministic checks verifying CPU socket compatibility (such as LGA1700, AM5, AM4, LGA1200, LGA1155), motherboard chipset matching, RAM DDR generation standards (DDR5 vs DDR4 vs DDR3), cabinet GPU clearance length, CPU cooler height, and dynamic PSU wattage capacity.'
  },
  {
    question: 'Do all components and custom PC builds carry official manufacturer warranty?',
    answer:
      'Yes, 100% of products sourced and sold by Computer Care are authentic brand-sealed units backed by official manufacturer warranties across India with authorized service center network support.'
  },
  {
    question: 'Which brands are officially available at Computer Care?',
    answer:
      'Computer Care provides genuine hardware from leading authorized brands including Lenovo, Samsung, HP, Cosmic Byte, Zebronics, Lapcare, Ant Esports, Acer, TVS, Consistent, iBall, Geonix, Prodot, and Logitech.'
  },
  {
    question: 'Does Computer Care deliver custom gaming rigs across India?',
    answer:
      'Yes, we securely package, crate, and ship pre-assembled and custom configured desktop PCs to all major cities and states across India with insured door-to-door transit.'
  },
  {
    question: 'How is power supply (PSU) wattage calculated for a custom build?',
    answer:
      'Our builder calculates the combined thermal design power (TDP) of the processor and graphics card, adds a 75W operational overhead buffer for motherboards, memory, fans, and storage, and factors in a 25% safety headroom multiplier to recommend the minimum and optimal PSU rating.'
  },
  {
    question: 'Can businesses, schools, or gaming cafes place bulk orders with GST invoices?',
    answer:
      'Yes, our B2B procurement division provides specialized bulk quotation tiers, official GST tax invoices for input tax credit, and turnkey deployment assistance for educational computer labs, esports cafes, and creative studios.'
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section className="w-full bg-white border border-brand-border rounded-2xl p-6 sm:p-10 shadow-xs">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold w-fit mb-3">
          <HelpCircle className="w-4 h-4" />
          <span>HELP & FREQUENTLY ASKED QUESTIONS</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          Got Questions? We Have Answers.
        </h2>

        <p className="mt-2 text-sm text-slate-600 font-sans leading-relaxed">
          Frequently asked questions about buying gaming PCs, computer repair, hardware upgrades, genuine parts warranties, and services in Ghaziabad and across India.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-brand-blue bg-blue-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="font-display font-bold text-sm sm:text-base text-brand-navy leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-blue' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100/80 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp Callout for Extra Questions */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-center sm:text-left">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display uppercase">
            Have a specific custom requirement or question?
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Our hardware engineers in Ghaziabad are available on WhatsApp for direct guidance.
          </p>
        </div>

        <a
          href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20have%20a%20question%20about%20custom%20PC%20building%20or%20repair"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-sm transition-colors cursor-pointer no-underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </section>
  );
}
