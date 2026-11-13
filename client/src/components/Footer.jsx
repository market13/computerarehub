import React from 'react';
import { 
  Cpu, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-brand-navyDark text-slate-300 font-sans border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Top 4-Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Computer Care */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                COMPUTER <span className="text-brand-red">CARE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Computer Care is your trusted destination for genuine computer hardware, high-performance custom gaming rigs, and workstation builds. Sourced directly from authorized distributors across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Brand Authorized Retailer</span>
            </div>
          </div>

          {/* Col 2: Custom PC Building */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Custom PC Services
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="/services" onClick={(e) => { e.preventDefault(); onNavigate('services'); }} className="text-left hover:text-white transition-colors text-cyan-400 font-semibold no-underline">
                • Services & Repair in Ghaziabad
              </a>
              <a href="/builder" onClick={(e) => { e.preventDefault(); onNavigate('builder'); }} className="text-left hover:text-white transition-colors no-underline">
                • Custom PC Configurator
              </a>
              <a href="/bulk-order" onClick={(e) => { e.preventDefault(); onNavigate('bulk-order'); }} className="text-left hover:text-white transition-colors text-amber-400 font-semibold flex items-center gap-1.5 no-underline">
                • Corporate & Bulk Orders (B2B)
              </a>
              <button onClick={() => onNavigate('presets')} className="text-left hover:text-white transition-colors">
                • Esports Battle-Ready Rigs
              </button>
              <button onClick={() => onNavigate('presets')} className="text-left hover:text-white transition-colors">
                • Unreal Engine 5 & 3D Workstations
              </button>
              <a href="/catalog/gpu" onClick={(e) => { e.preventDefault(); onNavigate('catalog-gpu'); }} className="text-left hover:text-white transition-colors no-underline">
                • RTX 40 & 50 Series GPUs
              </a>
              <a href="/catalog/cpu" onClick={(e) => { e.preventDefault(); onNavigate('catalog-cpu'); }} className="text-left hover:text-white transition-colors no-underline">
                • AMD Ryzen 9000 & Intel 14th Gen
              </a>
            </div>
          </div>

          {/* Col 3: Hardware Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Component Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <a href="/catalog/case" onClick={(e) => { e.preventDefault(); onNavigate('catalog-case'); }} className="text-left hover:text-white transition-colors no-underline">
                Cabinets & Cases
              </a>
              <a href="/catalog/gpu" onClick={(e) => { e.preventDefault(); onNavigate('catalog-gpu'); }} className="text-left hover:text-white transition-colors no-underline">
                Graphics Cards
              </a>
              <a href="/catalog/cpu" onClick={(e) => { e.preventDefault(); onNavigate('catalog-cpu'); }} className="text-left hover:text-white transition-colors no-underline">
                Processors
              </a>
              <a href="/catalog/motherboard" onClick={(e) => { e.preventDefault(); onNavigate('catalog-motherboard'); }} className="text-left hover:text-white transition-colors no-underline">
                Motherboards
              </a>
              <a href="/catalog/ram" onClick={(e) => { e.preventDefault(); onNavigate('catalog-ram'); }} className="text-left hover:text-white transition-colors no-underline">
                DDR4 & DDR5 RAM
              </a>
              <a href="/catalog/cooler" onClick={(e) => { e.preventDefault(); onNavigate('catalog-cooler'); }} className="text-left hover:text-white transition-colors no-underline">
                Liquid AIO Coolers
              </a>
              <a href="/catalog/storage" onClick={(e) => { e.preventDefault(); onNavigate('catalog-storage'); }} className="text-left hover:text-white transition-colors no-underline">
                M.2 NVMe SSDs
              </a>
              <a href="/catalog/psu" onClick={(e) => { e.preventDefault(); onNavigate('catalog-psu'); }} className="text-left hover:text-white transition-colors no-underline">
                Power Supplies
              </a>
            </div>
          </div>

          {/* Col 4: Contact & Store Information */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Store Support & Help
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>G 23 Shiva Tower, Ghaziabad, Uttar Pradesh - 201009</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Helpline: +91 9810550222</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>support@computercare.in</span>
              </div>
              <a
                href="https://wa.me/919810550222"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-lg font-bold text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong>Computer Care</strong>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-brand-gold transition-colors text-slate-400 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              title="Administrator Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Admin Portal</span>
            </button>
            <span className="text-slate-700">•</span>
            <span>Secure UPI, Cards, NetBanking, EMI Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
