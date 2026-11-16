import React from 'react';
import { CONTACT_EMAIL } from '../constants/storeInfo';
import { 
  Cpu, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  ExternalLink
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
              Computer Care is your trusted local computer hardware store, custom PC builder, and repair center in Ghaziabad. GST invoice with every purchase and manufacturer warranty on all parts.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GST Registered • Manufacturer Warranty</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Mon – Sat: 10:30 AM – 8:00 PM IST</span>
              </div>
              <span className="text-[11px] text-slate-500 ml-6">Closed Sunday</span>
            </div>
          </div>

          {/* Col 2: Custom PC Building & Services */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Services & Navigation
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="/services" onClick={(e) => { e.preventDefault(); onNavigate('services'); }} className="text-left hover:text-white transition-colors text-cyan-400 font-semibold no-underline">
                • Services & Repair in Ghaziabad
              </a>
              <a href="/builder" onClick={(e) => { e.preventDefault(); onNavigate('builder'); }} className="text-left hover:text-white transition-colors no-underline">
                • Custom PC Configurator
              </a>
              <a href="/catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }} className="text-left hover:text-white transition-colors no-underline">
                • Hardware Catalog (All Categories)
              </a>
              <a href="/bulk-order" onClick={(e) => { e.preventDefault(); onNavigate('bulk-order'); }} className="text-left hover:text-white transition-colors text-amber-400 font-semibold flex items-center gap-1.5 no-underline">
                • Corporate & Bulk Orders (B2B)
              </a>
              <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="text-left hover:text-white transition-colors no-underline">
                • About Computer Care
              </a>
            </div>
          </div>

          {/* Col 3: Customer Trust & Policy Pages */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Trust & Policies
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="/warranty-returns" onClick={(e) => { e.preventDefault(); onNavigate('warranty-returns'); }} className="text-left hover:text-white transition-colors no-underline">
                • Warranty & Returns Policy
              </a>
              <a href="/shipping-delivery" onClick={(e) => { e.preventDefault(); onNavigate('shipping-delivery'); }} className="text-left hover:text-white transition-colors no-underline">
                • Shipping & Delivery Information
              </a>
              <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('privacy-policy'); }} className="text-left hover:text-white transition-colors no-underline">
                • Privacy Policy
              </a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="text-left hover:text-white transition-colors no-underline">
                • Terms & Conditions
              </a>
              <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="text-left hover:text-white transition-colors no-underline">
                • Store Location & Contact
              </a>
            </div>
          </div>

          {/* Col 4: Contact & Store Information */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold uppercase tracking-wider text-xs text-white border-b border-white/10 pb-2">
              Store Support & Location
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>G 23 Shiva Tower, Ghaziabad, Uttar Pradesh 201009</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+919810550222" className="hover:text-white transition-colors font-medium">Helpline: +91 9810550222</a>
              </div>
              {CONTACT_EMAIL && (
                /* TODO: Configure store email on computercaregzb.com via VITE_CONTACT_EMAIL */
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">{CONTACT_EMAIL}</a>
                </div>
              )}
              {/* TODO: Add verified Google Maps Place ID embed / link */}
              <a
                href="https://maps.google.com/?q=Computer+Care+G+23+Shiva+Tower+Ghaziabad+Uttar+Pradesh+201009"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px] text-slate-400"
              >
                <span>View Store on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://wa.me/919810550222"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-lg font-bold text-xs transition-colors no-underline"
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
            © 2026 <strong>Computer Care</strong> (G 23 Shiva Tower, Ghaziabad, UP 201009). All Rights Reserved.
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
            <span>GST Invoicing • Pan-India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
