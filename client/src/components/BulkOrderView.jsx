import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { submitToNetlify } from '../utils/formSubmit';
import { 
  Building2, 
  Send, 
  ShieldCheck, 
  Truck, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Copy, 
  Check, 
  ArrowRight, 
  Package, 
  HelpCircle,
  Laptop,
  Monitor,
  Cpu
} from 'lucide-react';

const REQUIREMENT_CATEGORIES = [
  { id: 'office_pcs', label: 'Office & Business Desktop PCs', icon: Laptop },
  { id: 'gaming_rigs', label: 'Gaming & Esports Battle Rigs', icon: Cpu },
  { id: 'workstations', label: '3D Animation & Rendering Workstations', icon: Sparkles },
  { id: 'ai_servers', label: 'AI, Deep Learning & High-Compute Rigs', icon: Cpu },
  { id: 'monitors_bulk', label: 'Monitors & Display Walls in Bulk', icon: Monitor },
  { id: 'peripherals_bulk', label: 'Keyboards, Mice & Accessories in Bulk', icon: Package },
  { id: 'components_bulk', label: 'Individual Components (CPUs, GPUs, RAM, PSUs)', icon: Cpu },
  { id: 'other', label: 'Custom Enterprise / Institutional Setup', icon: Building2 }
];

const SUGGESTED_NOTES = [
  'Need 15 high-performance PCs for Unreal Engine 5 3D architectural rendering with RTX 4070 / 4080.',
  'Looking for 25 complete office workstation setups with Intel Core i5, 16GB RAM, 512GB SSD, and 24" FHD monitors.',
  'Setting up an Esports gaming arena with 12 rigs powered by Ryzen 7 7800X3D + 240Hz gaming monitors.',
  'Requirement for 20 Zebronics curved gaming monitors (27" 165Hz) and mechanical keyboard combos.',
  'Need bulk quotation for 10 custom deep-learning workstations with 64GB DDR5 and NVIDIA dual-GPU support.'
];

function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '***';
  const clean = phone.trim();
  if (clean.length < 4) return '***';
  return clean.slice(0, 3) + '****' + clean.slice(-3);
}

function maskEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '***';
  const [user, domain] = email.trim().split('@');
  return (user.length > 2 ? user.slice(0, 2) + '***' : '***') + '@' + domain;
}

export default function BulkOrderView({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    gstin: '',
    category: 'office_pcs',
    quantity: '10 - 25 Units',
    timeline: 'Immediate (Within 7-10 Days)',
    budgetRange: '₹5 Lakhs - ₹15 Lakhs',
    needDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your contact / WhatsApp number';
    } else if (!/^[0-9+\s-]{10,14}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.city.trim()) errs.city = 'Please enter your city';
    if (!formData.needDescription.trim()) {
      errs.needDescription = 'Please provide a short note describing your requirement';
    } else if (formData.needDescription.trim().length < 15) {
      errs.needDescription = 'Please add a few more details about what you need (min. 15 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const refNumber = `CC-B2B-${Math.floor(100000 + Math.random() * 900000)}`;
    const inquiryRecord = {
      ...formData,
      refNumber,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      await submitToNetlify('bulk-order', {
        ...formData,
        refNumber,
        timestamp: inquiryRecord.timestamp
      });

      try {
        const sanitizedStorageRecord = {
          refNumber,
          fullName: formData.fullName.slice(0, 80),
          companyName: formData.companyName.slice(0, 100),
          maskedEmail: maskEmail(formData.email),
          maskedPhone: maskPhone(formData.phone),
          city: formData.city.slice(0, 80),
          category: formData.category,
          quantity: formData.quantity,
          timeline: formData.timeline,
          budgetRange: formData.budgetRange,
          timestamp: inquiryRecord.timestamp
        };
        const rawExisting = localStorage.getItem('computercare_bulk_inquiries');
        const existing = rawExisting ? JSON.parse(rawExisting) : [];
        const updated = Array.isArray(existing) ? [sanitizedStorageRecord, ...existing].slice(0, 20) : [sanitizedStorageRecord];
        localStorage.setItem('computercare_bulk_inquiries', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }

      setSubmittedInquiry(inquiryRecord);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      const waText = `Hi Computer Care, I would like to submit a B2B Bulk Order inquiry:\n• Company: ${formData.companyName}\n• Contact: ${formData.fullName}\n• Phone: ${formData.phone}\n• City: ${formData.city}\n• Category: ${formData.category}\n• Quantity: ${formData.quantity}\n• Budget: ${formData.budgetRange}\n• Timeline: ${formData.timeline}\n• Requirements: ${formData.requirements || 'N/A'}\n(Ref: ${refNumber})`;
      setSubmitError({
        message: 'Could not submit your bulk inquiry online. Please check your connection or send via WhatsApp.',
        details: waText
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedInquiry) {
      navigator.clipboard.writeText(submittedInquiry.refNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleSelectSuggestedNote = (text) => {
    setFormData(prev => ({
      ...prev,
      needDescription: text
    }));
    if (errors.needDescription) {
      setErrors(prev => ({ ...prev, needDescription: '' }));
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16 animate-in fade-in duration-200">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Bulk Order & B2B Inquiries</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#101b3d] to-[#1e293b] border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          {/* Subtle geometric background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

          <div className="relative z-10 max-w-3xl flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold w-fit">
              <Building2 className="w-3.5 h-3.5" />
              <span>DIRECT DISTRIBUTOR B2B SUPPLY • PAN-INDIA</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight">
              Order Computers & Hardware in <span className="text-amber-400">Bulk with Ease</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Equip your office, school/college lab, animation studio, or esports arena with genuine brand-certified hardware. Enjoy institutional tiered pricing, customized rig configurations, pan-India insured shipping, and 100% verified 18% GST tax input credit.
            </p>

            {/* Quick Assurances Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300">
                  <span className="font-bold text-white block">18% GST Credit</span>
                  Official B2B Invoices
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300">
                  <span className="font-bold text-white block">100% Brand Direct</span>
                  Genuine Manufacturer Warranty
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300">
                  <span className="font-bold text-white block">Insured Freight</span>
                  Wooden Crate Pan-India
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300">
                  <span className="font-bold text-white block">2-Hour Quote</span>
                  Dedicated Sales Engineer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS CONFIRMATION RECEIPT (IF SUBMITTED) */}
      {submittedInquiry && (
        <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-emerald-950">
                  Bulk Order Inquiry Received Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Thank you, <span className="font-semibold text-emerald-900">{submittedInquiry.fullName}</span>. Our corporate sales team has received your request and will contact you within 2-4 business hours.
                </p>
              </div>
            </div>

            {/* Reference Badge */}
            <div className="bg-white border border-emerald-300 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Inquiry Reference ID</span>
                <span className="text-sm sm:text-base font-black font-mono text-emerald-800">
                  {submittedInquiry.refNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="Copy Reference ID"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Details Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 bg-white/80 rounded-xl p-4 border border-emerald-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Contact Information</span>
              <span className="font-semibold text-slate-900 block mt-0.5">{submittedInquiry.fullName}</span>
              {submittedInquiry.companyName && (
                <span className="text-slate-600 block">{submittedInquiry.companyName}</span>
              )}
              <span className="text-slate-600 block mt-1">{submittedInquiry.email} • {submittedInquiry.phone}</span>
              <span className="text-slate-500 block">{submittedInquiry.city}, {submittedInquiry.state || 'India'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Requirement Details</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                Category: {REQUIREMENT_CATEGORIES.find(c => c.id === submittedInquiry.category)?.label || submittedInquiry.category}
              </span>
              <span className="text-slate-600 block mt-1">Quantity: <strong className="text-slate-900">{submittedInquiry.quantity}</strong></span>
              <span className="text-slate-600 block">Est. Budget: <strong className="text-slate-900">{submittedInquiry.budgetRange}</strong></span>
              <span className="text-slate-600 block">Timeline: {submittedInquiry.timeline}</span>
            </div>

            <div className="md:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Your Requirement Note</span>
              <p className="mt-1 text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs italic leading-relaxed">
                "{submittedInquiry.needDescription}"
              </p>
            </div>
          </div>

          {/* Next Steps Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Have immediate questions? Call our B2B Desk directly at <strong>+91 9810550222</strong></span>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/919810550222?text=Hello%20Computer%20Care%20B2B%20Team%2C%20I%20have%20submitted%20a%20bulk%20order%20inquiry%20(Ref%3A%20${encodeURIComponent(submittedInquiry.refNumber)})%20for%20${encodeURIComponent(submittedInquiry.quantity)}.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Follow Up via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium text-xs transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN FORM & BENEFITS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Bulk Order Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">
                Bulk Order Request Form
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Please share your contact details and a short note describing what you need. Our corporate hardware architects will prepare an itemized GST quote with tailored volume pricing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* SECTION 1: CONTACT DETAILS */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>1. Contact & Business Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span>Contact Person Name <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                      errors.fullName 
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                  {errors.fullName && <span className="text-[11px] text-rose-500">{errors.fullName}</span>}
                </div>

                {/* Company / Organization Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span>Company / Studio / School Name</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Apex Visuals Pvt Ltd / Self"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Business / Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    maxLength={100}
                    placeholder="ramesh@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                      errors.email 
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                  {errors.email && <span className="text-[11px] text-rose-500">{errors.email}</span>}
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span>Phone / WhatsApp Number <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-emerald-600 font-normal">Direct Quote Call</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={15}
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                      errors.phone 
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                  {errors.phone && <span className="text-[11px] text-rose-500">{errors.phone}</span>}
                </div>

                {/* City & State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    City & State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                      errors.city 
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                  {errors.city && <span className="text-[11px] text-rose-500">{errors.city}</span>}
                </div>

                {/* GSTIN Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span>GSTIN Number</span>
                    <span className="text-[10px] text-slate-400 font-normal">For 18% Tax Credit</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: REQUIREMENTS & SCOPE */}
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                2. Requirement Type & Estimated Quantity
              </h3>

              {/* Requirement Type Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {REQUIREMENT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold leading-snug">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scope Dropdowns: Quantity, Timeline, Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Estimated Quantity
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="3 - 5 Units">3 - 5 Units</option>
                    <option value="6 - 10 Units">6 - 10 Units</option>
                    <option value="11 - 25 Units">11 - 25 Units</option>
                    <option value="26 - 50 Units">26 - 50 Units</option>
                    <option value="50+ Units">50+ Units (Enterprise)</option>
                  </select>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Procurement Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Immediate (Within 7-10 Days)">Immediate (Within 7-10 Days)</option>
                    <option value="Within 15 - 30 Days">Within 15 - 30 Days</option>
                    <option value="1 - 2 Months">1 - 2 Months</option>
                    <option value="Quotation & Budgeting Phase">Quotation & Budgeting Phase</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Approx. Budget Range
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Under ₹3 Lakhs">Under ₹3 Lakhs</option>
                    <option value="₹3 Lakhs - ₹10 Lakhs">₹3 Lakhs - ₹10 Lakhs</option>
                    <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs+">₹50 Lakhs+ (Custom RFP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: SHORT NOTE OF WHAT THEIR NEED IS */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  3. Short Note of What Your Need Is <span className="text-rose-500">*</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formData.needDescription.length} characters
                </span>
              </div>

              <textarea
                rows={4}
                maxLength={1500}
                placeholder="Tell us what you are looking for (e.g., specific hardware parts, processor tiers, GPU requirements, monitor sizes, preferred brands, or custom configuration guidelines)..."
                value={formData.needDescription}
                onChange={(e) => setFormData({ ...formData, needDescription: e.target.value })}
                className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors leading-relaxed ${
                  errors.needDescription 
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' 
                    : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                }`}
              />
              {errors.needDescription && (
                <span className="text-[11px] text-rose-500">{errors.needDescription}</span>
              )}

              {/* Quick Suggestion Chips */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[11px] font-medium text-slate-500">
                  Quick examples (click to paste into note):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_NOTES.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestedNote(sug)}
                      className="text-[11px] text-left bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                    >
                      + {sug.slice(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON & ERROR BANNER */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{submitError.message}</span>
                </div>
                <a
                  href={`https://wa.me/919810550222?text=${encodeURIComponent(submitError.details)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp instead</span>
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 text-center sm:text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your information is encrypted & used strictly for official quotation purposes.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#2b38d1] hover:bg-[#202bb8] disabled:bg-blue-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer flex-shrink-0 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Bulk Order Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Why Buy Bulk from Computer Care & B2B Contacts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Direct B2B Corporate Desk Card */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white rounded-2xl p-6 border border-slate-700 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Building2 className="w-4 h-4" />
              <span>Dedicated B2B Desk</span>
            </div>

            <h3 className="text-lg font-bold font-display text-white">
              Need Instant Assistance or Official RFPs?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Have an existing Bill of Materials (BOM) or government / institutional tender requirement? Speak directly with our head of corporate procurement.
            </p>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10 text-xs">
              <a 
                href="tel:+919810550222" 
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Corporate Sales Phone</span>
                  <span className="font-bold text-white text-sm font-mono">+91 9810550222</span>
                </div>
              </a>

              <a 
                href="mailto:contact@computercare.in" 
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">B2B Email Desk</span>
                  <span className="font-bold text-white text-sm font-mono">contact@computercare.in</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Store Address</span>
                  <span className="text-slate-200">G 23 Shiva Tower, Ghaziabad, Uttar Pradesh - 201009</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Computer Care B2B */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              The Computer Care B2B Edge
            </h4>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Genuine Brand Tier-1 Sourcing</span>
                  <span className="text-slate-500 leading-normal">
                    Direct billing from authorized national distributors (Ingram Micro, Redington, Savex) with full brand serial tracking.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">18% GST Input Tax Credit</span>
                  <span className="text-slate-500 leading-normal">
                    Complete tax compliant B2B invoicing so your business claims 100% of GST input credits.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Burn-In & Stress Testing</span>
                  <span className="text-slate-500 leading-normal">
                    Every custom machine undergoes a 24-hour benchmark stability test before packaging to ensure zero DOA on delivery.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Heavy-Duty Crating & Transit Insurance</span>
                  <span className="text-slate-500 leading-normal">
                    Custom wooden-reinforced packaging protects tempered glass and delicate components across rail and air cargo.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs flex flex-col gap-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h4>

            <div className="flex flex-col gap-2.5 text-slate-600">
              <div className="pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-800 block">What is the minimum quantity for bulk pricing?</span>
                <span className="text-[11px] text-slate-500">Bulk discounts apply starting from 3-5 systems or orders above ₹1,50,000.</span>
              </div>

              <div className="pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-800 block">Can each PC have distinct specifications?</span>
                <span className="text-[11px] text-slate-500">Yes! We can tailor specs for design leads, developers, and general staff separately.</span>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block">How long does quote preparation take?</span>
                <span className="text-[11px] text-slate-500">Standard configurations are quoted within 2 hours; complex RFPs within 24 hours.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
