import React from 'react';
import { 
  Wrench, 
  Cpu, 
  HardDrive, 
  Laptop, 
  Headphones, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function ServicesView({ onNavigate }) {
  const services = [
    {
      id: 'custom-pc-building',
      title: 'Custom Gaming PC Building & Assembly',
      icon: Cpu,
      badge: 'Core Speciality in Ghaziabad',
      badgeColor: 'bg-blue-50 text-brand-blue border-blue-200',
      description:
        'Custom gaming and workstation PC building engineered with zero hardware bottlenecks. We assemble, cable-manage, BIOS-update, and stress-test custom rigs tailored to your favorite games, video editing workloads, or 3D rendering.',
      highlights: [
        'Intel Core 14th/13th Gen & AMD Ryzen 9000/7000 Series configurations',
        'NVIDIA GeForce RTX 40 & 50 Series GPU integration',
        'Real-time socket, RAM DDR generation, and PSU wattage checks',
        '24-hour synthetic thermal burn-in test before handover',
        'Insured pan-India door-to-door transit & local Ghaziabad store pickup'
      ],
      primaryAction: {
        label: 'Launch 3D PC Builder',
        onClick: () => onNavigate('builder')
      },
      secondaryAction: {
        label: 'Consult on WhatsApp',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20want%20to%20build%20a%20custom%20gaming%20PC'
      }
    },
    {
      id: 'hardware-upgrades',
      title: 'Computer Hardware Upgrades & Component Replacement',
      icon: HardDrive,
      badge: 'Speed & Storage Upgrades',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Transform slow computers and laptops with targeted hardware upgrades. We install ultra-fast NVMe SSDs, expand dual-channel RAM, upgrade graphics cards, and install high-efficiency power supplies and liquid coolers.',
      highlights: [
        'HDD to high-speed NVMe M.2 SSD migration with seamless OS cloning',
        'DDR4 & DDR5 RAM capacity and frequency expansions',
        'Graphics card upgrades with PSU wattage headroom verification',
        'Liquid AIO & high-airflow cabinet cooling to stop thermal throttling',
        '100% genuine brand-sealed parts with official manufacturer warranty'
      ],
      primaryAction: {
        label: 'Browse Components',
        onClick: () => onNavigate('catalog-all')
      },
      secondaryAction: {
        label: 'Check Upgrade Options',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20want%20to%20upgrade%20my%20desktop%20hardware'
      }
    },
    {
      id: 'computer-repair',
      title: 'Computer & Desktop Repair & Diagnostics',
      icon: Wrench,
      badge: 'Expert Troubleshooting in Ghaziabad',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description:
        'Professional diagnostic troubleshooting and repair for desktop computers and workstations in Ghaziabad. We resolve blue screen (BSOD) crashes, boot failures, motherboard issues, and power supply malfunctions.',
      highlights: [
        'Thorough hardware fault detection and diagnostic testing',
        'SMPS / PSU failure detection and reliable replacement',
        'Motherboard capacitor, RAM slot, and PCIe lane troubleshooting',
        'Deep thermal cleaning, fan maintenance, and thermal paste repasting',
        'Transparent pricing and prompt turnaround time'
      ],
      primaryAction: {
        label: 'Book Repair Diagnostic',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20need%20computer%20repair%20services%20in%20Ghaziabad'
      },
      secondaryAction: {
        label: 'Call Helpline',
        href: 'tel:+919810550222'
      }
    },
    {
      id: 'laptop-servicing',
      title: 'Laptop & Desktop Servicing & Maintenance',
      icon: Laptop,
      badge: 'Preventive Servicing',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description:
        'Comprehensive servicing to keep laptops and desktop PCs running cool, quiet, and fast. Includes internal dust removal, cooling fan servicing, high-performance thermal paste application, and OS optimization.',
      highlights: [
        'Internal heatsink de-clogging and dual-fan thermal repasting',
        'Operating system reinstallation, driver updates, and malware removal',
        'Storage drive health checks (SMART diagnostics) and bad sector analysis',
        'Display hinge, keyboard, and battery inspection for laptops',
        'Annual maintenance and periodic checkups for home & office setups'
      ],
      primaryAction: {
        label: 'Schedule Servicing',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20want%20to%20schedule%20laptop%2Fdesktop%20servicing'
      },
      secondaryAction: {
        label: 'WhatsApp Helpline',
        href: 'https://wa.me/919810550222'
      }
    },
    {
      id: 'computer-accessories',
      title: 'Computer Accessories & Gaming Peripherals Store',
      icon: Headphones,
      badge: 'Genuine Peripherals in Ghaziabad',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description:
        'Ghaziabad’s one-stop store for genuine computer accessories and gaming gear. We stock verified wired and Bluetooth optical mice, mechanical keyboards, surround-sound headsets, precision mousepads, webcams, and ergonomic gaming chairs.',
      highlights: [
        'Wired and Bluetooth wireless optical mice from Logitech, Consistent, Lapcare',
        'RGB mechanical and multimedia keyboards with tactile switches',
        'Noise-isolating gaming headsets with crystal-clear boom mics',
        'Full HD & 4K webcams and studio USB microphones for streaming',
        'Official manufacturer warranty on all accessories'
      ],
      primaryAction: {
        label: 'Explore Accessories',
        onClick: () => onNavigate('catalog-gaming_mouse')
      },
      secondaryAction: {
        label: 'Inquire Availability',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20do%20you%20have%20computer%20accessories%20in%20stock%3F'
      }
    },
    {
      id: 'b2b-procurement',
      title: 'B2B Bulk Hardware Procurement & Lab Setups',
      icon: Building2,
      badge: 'Enterprise & Institutional',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description:
        'Wholesale IT hardware procurement and deployment for schools, colleges, training institutes, gaming cafes, animation studios, and corporate offices across Uttar Pradesh and India.',
      highlights: [
        'Turnkey computer lab and esports arena workstation setups',
        'Official GST invoices for corporate expense filing and Input Tax Credit (ITC)',
        'Tiered bulk wholesale pricing for volume hardware orders',
        'Priority business warranty and on-site setup assistance',
        'Standardized hardware configurations with verified reliability'
      ],
      primaryAction: {
        label: 'Submit Bulk Order Inquiry',
        onClick: () => onNavigate('bulk-order')
      },
      secondaryAction: {
        label: 'B2B Sales WhatsApp',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20have%20a%20corporate%20B2B%20hardware%20requirement'
      }
    }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* 1. Header Banner */}
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COMPUTER CARE SERVICES IN GHAZIABAD</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          Computer Repair, Custom Gaming PCs & Hardware Services in Ghaziabad
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          From custom gaming PC assembly and high-speed hardware upgrades to desktop diagnostics, laptop servicing, and genuine computer accessories in Ghaziabad, Uttar Pradesh.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Ghaziabad, Uttar Pradesh</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>+91 9810550222</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Genuine Brand Warranty</span>
          </span>
        </div>
      </header>

      {/* 2. Grid of Core Services */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <article
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-brand-blue transition-all duration-200 p-6 shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-navy group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${svc.badgeColor}`}>
                    {svc.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold font-display text-slate-900 group-hover:text-brand-blue transition-colors leading-snug">
                  {svc.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {svc.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-2.5">
                    Service Capabilities
                  </h3>
                  <ul className="flex flex-col gap-2 text-xs text-slate-700 font-sans">
                    {svc.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {svc.primaryAction.onClick ? (
                  <button
                    type="button"
                    onClick={svc.primaryAction.onClick}
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{svc.primaryAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href={svc.primaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer no-underline text-center"
                  >
                    <span>{svc.primaryAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {svc.secondaryAction && (
                  <a
                    href={svc.secondaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-display font-semibold text-xs transition-colors cursor-pointer no-underline whitespace-nowrap"
                  >
                    {svc.secondaryAction.label}
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* 3. Ghaziabad Store Location & Contact Details */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">
              VISIT OUR GHAZIABAD STORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase leading-tight">
              Looking for a Trusted Computer Shop in Ghaziabad?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
              Visit Computer Care for custom PC quotes, on-spot hardware upgrades, troubleshooting diagnostics, laptop servicing, and authentic computer accessories. Speak with experienced technicians who help you choose the right components without paying for unnecessary extras.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Store Address:</strong>
                  <span>G 23 Shiva Tower, Ghaziabad, Uttar Pradesh - 201009</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Operating Hours:</strong>
                  <span>Monday – Saturday: 10:30 AM – 8:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Helpline & WhatsApp:</strong>
                  <span>+91 9810550222</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Email Address:</strong>
                  <span>contact@computercare.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-stretch bg-slate-800/80 p-6 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white text-center">
              Get Immediate Assistance
            </h3>
            <p className="text-xs text-slate-400 text-center mb-2">
              Have a hardware question or need a quick price estimate?
            </p>
            <a
              href="https://wa.me/919810550222?text=Hello%20Computer%20Care%2C%20I%20have%20an%20inquiry%20regarding%20computer%20services%20in%20Ghaziabad"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center no-underline"
            >
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="tel:+919810550222"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-display font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-center no-underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call +91 9810550222</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
