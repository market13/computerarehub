import React from 'react';
import FAQSection from './FAQSection';
import RepairStatusLookup from './RepairStatusLookup';
import StoreLocationMap from './StoreLocationMap';
import ReviewsSection from './ReviewsSection';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_EMAIL } from '../constants/storeInfo';
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

// TODO: Confirm exact baseline service pricing and turnaround times with store owner
const TYPICAL_SERVICE_PRICES = [
  {
    service: 'Operating System (OS) Install',
    description: 'Clean Windows 11 / 10 installation, chipset & GPU drivers, and essential utility setup.',
    startingPrice: '₹399*', // TODO: confirm starting price with store owner
    turnaround: '1 – 2 Hours', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, I need an OS installation service in Ghaziabad.'
  },
  {
    service: 'Laptop Deep Servicing & Cleaning',
    description: 'Internal disassembly, heatsink dust clearance, high-pressure fan cleaning & airflow test.',
    startingPrice: '₹599*', // TODO: confirm starting price with store owner
    turnaround: 'Same Day (2 – 3 Hours)', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, I want to book laptop servicing and internal cleaning in Ghaziabad.'
  },
  {
    service: 'Thermal Repaste (CPU / GPU)',
    description: 'Degraded compound removal and application of high-conductivity Arctic MX-4 / Noctua thermal paste.',
    startingPrice: '₹499*', // TODO: confirm starting price with store owner
    turnaround: '1 – 2 Hours', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, I need thermal repaste for my CPU/GPU to lower temperatures.'
  },
  {
    service: 'SSD Upgrade & OS Migration',
    description: 'High-speed M.2 NVMe / 2.5" SATA SSD installation with seamless OS cloning from slow mechanical hard drive.',
    startingPrice: '₹349*', // TODO: confirm starting price with store owner (service only, parts extra)
    turnaround: '1 – 2 Hours', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, I want to upgrade my PC/laptop with an SSD in Ghaziabad.'
  },
  {
    service: 'Diagnostics & Troubleshooting',
    description: 'Comprehensive bench diagnosis for blue screen (BSOD) crashes, boot loops, and SMPS power failures.',
    startingPrice: '₹299*', // TODO: confirm starting price with store owner (adjusted against repair if approved)
    turnaround: '2 – 4 Hours', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, my computer has a hardware issue and needs diagnostic troubleshooting.'
  },
  {
    service: 'Custom PC Assembly & Cable Routing',
    description: 'Professional assembly of customer or store components, custom cable management, BIOS flash & burn-in check.',
    startingPrice: '₹999*', // TODO: confirm starting price with store owner
    turnaround: 'Same Day / 24 Hours', // TODO: confirm turnaround time with store owner
    waMessage: 'Hi Computer Care, I want to assemble a custom gaming PC in Ghaziabad.'
  }
];

export default function ServicesView({ onNavigate }) {
  const services = [
    {
      id: 'custom-pc-building',
      title: 'Custom Gaming PC Building & Assembly',
      icon: Cpu,
      badge: 'Core Speciality in Ghaziabad',
      badgeColor: 'bg-blue-50 text-brand-blue border-blue-200',
      // TODO: Add real starting price when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real repair/build warranty when confirmed by store owner
      warranty: null,
      description:
        'Custom gaming and workstation PC building engineered with compatibility-checked hardware. We assemble, cable-manage, BIOS-update, and stress-test custom rigs tailored to your favorite games, video editing workloads, or creative rendering.',
      highlights: [
        'Intel Core 14th/13th Gen & AMD Ryzen 9000/7000 Series configurations',
        'NVIDIA GeForce RTX 40 & 50 Series GPU integration',
        'Real-time socket, RAM DDR generation, and PSU wattage checks',
        '24-hour synthetic thermal burn-in test before handover',
        'Insured pan-India door-to-door transit & local Ghaziabad store pickup'
      ],
      primaryAction: {
        label: 'Launch Custom PC Builder',
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
      // TODO: Add real starting price when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real repair/upgrade warranty when confirmed by store owner
      warranty: null,
      description:
        'Transform slow computers and laptops with targeted hardware upgrades. We install ultra-fast NVMe SSDs, expand dual-channel RAM, upgrade graphics cards, and install high-efficiency power supplies and liquid coolers.',
      highlights: [
        'HDD to high-speed NVMe M.2 SSD migration with seamless OS cloning',
        'DDR4 & DDR5 RAM capacity and frequency expansions',
        'Graphics card upgrades with PSU wattage headroom verification',
        'Liquid AIO & high-airflow cabinet cooling to stop thermal throttling',
        'Brand-sealed parts with official manufacturer warranty and GST invoice'
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
      // TODO: Add real starting price when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real repair warranty when confirmed by store owner
      warranty: null,
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
        label: 'Book Diagnostic / Track Job',
        onClick: () => {
          document.getElementById('repair-tracker')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      secondaryAction: {
        label: 'WhatsApp Desk',
        href: 'https://wa.me/919810550222?text=Hi%20Computer%20Care%2C%20I%20need%20computer%20repair%20services%20in%20Ghaziabad'
      }
    },
    {
      id: 'laptop-servicing',
      title: 'Laptop & Desktop Servicing & Maintenance',
      icon: Laptop,
      badge: 'Preventive Servicing',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      // TODO: Add real starting price when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real service warranty when confirmed by store owner
      warranty: null,
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
      // TODO: Add real starting price when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real warranty policy when confirmed by store owner
      warranty: null,
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
      // TODO: Add real starting price / MOQ when confirmed by store owner
      startingPrice: null,
      // TODO: Add real typical turnaround time when confirmed by store owner
      turnaroundTime: null,
      // TODO: Add real warranty policy when confirmed by store owner
      warranty: null,
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
            <span>Manufacturer Warranty on All Parts</span>
          </span>
        </div>
      </header>

      {/* 2. Live Repair Tracking & Service Booking Hub */}
      <section id="repair-tracker" className="w-full scroll-mt-24">
        <RepairStatusLookup />
      </section>

      {/* 3. Grid of Core Services */}
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

                  {/* Pricing, turnaround, and warranty fields: rendered only when real data is filled */}
                  {(svc.startingPrice || svc.turnaroundTime || svc.warranty) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600 font-sans">
                      {svc.startingPrice && (
                        <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium">
                          Starting from: <strong className="text-slate-800">{svc.startingPrice}</strong>
                        </span>
                      )}
                      {svc.turnaroundTime && (
                        <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium">
                          Turnaround: <strong className="text-slate-800">{svc.turnaroundTime}</strong>
                        </span>
                      )}
                      {svc.warranty && (
                        <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium">
                          Warranty: <strong className="text-slate-800">{svc.warranty}</strong>
                        </span>
                      )}
                    </div>
                  )}
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
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-display font-semibold text-xs transition-colors cursor-pointer no-underline whitespace-nowrap flex items-center gap-1.5"
                  >
                    {svc.secondaryAction.href?.includes('wa.me') && (
                      <WhatsAppIcon variant="badge" className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    <span>{svc.secondaryAction.label}</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* 4. Typical Prices & Turnaround Table (Requirement 9) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">
              TRANSPARENT SERVICE CHARGES
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight mt-0.5">
              Typical Service Pricing & Turnaround Times (Ghaziabad)
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Indicative bench rates for common computer repair, maintenance, and upgrade services at our Shiva Tower workshop.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            *Final quote provided after initial diagnostic assessment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-mono uppercase tracking-wider">
                <th className="py-3 px-3">Service Scope</th>
                <th className="py-3 px-3">Typical Starting Price</th>
                <th className="py-3 px-3">Estimated Turnaround</th>
                <th className="py-3 px-3 text-right">Instant Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {TYPICAL_SERVICE_PRICES.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block font-display">{item.service}</strong>
                    <span className="text-[11px] text-slate-500 leading-relaxed">{item.description}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-brand-navy font-display text-sm">{item.startingPrice}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-mono">
                      <Clock className="w-3 h-3 text-blue-600" />
                      {item.turnaround}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <a
                      href={`https://wa.me/919810550222?text=${encodeURIComponent(item.waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-colors shadow-2xs"
                      title={`Book ${item.service} on WhatsApp`}
                    >
                      <WhatsAppIcon variant="badge" className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Google Maps Embed & Store Location Section (Requirement 13) */}
      <StoreLocationMap />

      {/* 6. Customer Reviews Section (Requirement 12) */}
      <ReviewsSection />

      {/* Frequently Asked Questions Section for Ghaziabad Services */}
      <FAQSection />
    </main>
  );
}
