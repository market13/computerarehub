import React, { useState } from 'react';
import { 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Gamepad2, 
  Cpu, 
  Copy, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { submitToNetlify } from '../utils/formSubmit';

const USE_CASES = [
  { id: 'gaming', label: 'High-FPS Gaming', desc: 'Esports, GTA, Cyberpunk, AAA titles' },
  { id: 'rendering', label: '3D VFX & Animation', desc: 'Blender, Unreal Engine 5, 3ds Max' },
  { id: 'editing', label: '4K/8K Video Editing', desc: 'Premiere Pro, DaVinci Resolve, After Effects' },
  { id: 'office', label: 'Office & Accounting', desc: 'Tally, Busy, Excel, Multi-monitor' },
  { id: 'coding', label: 'Programming & DevOps', desc: 'Docker, Android Studio, Full-stack' },
  { id: 'ai_ml', label: 'AI & Deep Learning', desc: 'PyTorch, CUDA, Local LLMs, Stable Diffusion' },
  { id: 'student', label: 'Student / Home Study', desc: 'Classes, browsing, casual usage' }
];

const BUDGET_RANGES = [
  '₹25,000 - ₹40,000 (Entry Budget)',
  '₹40,000 - ₹70,000 (Mid-Range Gaming / Work)',
  '₹70,000 - ₹1,20,000 (1440p High / Heavy VFX)',
  '₹1,20,000 - ₹2,00,000 (4K Ultra Performance)',
  '₹2,00,000+ (Ultra Enthusiast / Custom Watercooled)'
];

const TIME_SLOTS = [
  'Immediate / ASAP (Next 30 Mins)',
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (1:00 PM - 5:00 PM)',
  'Evening (5:00 PM - 9:00 PM)'
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

export default function ExpertConsultationForm({ onBackToBuilder }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    useCase: 'gaming',
    budget: '₹40,000 - ₹70,000 (Mid-Range Gaming / Work)',
    preferredBrand: 'Suggest Best for Budget',
    callTime: 'Immediate / ASAP (Next 30 Mins)',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your name';
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your 10-digit phone number';
    } else {
      const cleanPhone = formData.phone.replace(/[^\d]/g, '');
      if (cleanPhone.length < 10) errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.city.trim()) errs.city = 'Please enter your city';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const refNumber = `CC-CALL-${Math.floor(100000 + Math.random() * 900000)}`;
    const requestRecord = {
      ...formData,
      refNumber,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await submitToNetlify('expert-consultation', {
        ...formData,
        refNumber,
        timestamp: requestRecord.timestamp
      });

      try {
        const sanitized = {
          refNumber,
          fullName: formData.fullName.slice(0, 80),
          maskedPhone: maskPhone(formData.phone),
          maskedEmail: maskEmail(formData.email),
          city: formData.city.slice(0, 80),
          useCase: formData.useCase,
          budget: formData.budget,
          callTime: formData.callTime,
          timestamp: requestRecord.timestamp
        };
        const raw = localStorage.getItem('computercare_pc_consultations');
        const existing = raw ? JSON.parse(raw) : [];
        const updated = Array.isArray(existing) ? [sanitized, ...existing].slice(0, 20) : [sanitized];
        localStorage.setItem('computercare_pc_consultations', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }

      setSubmittedRequest(requestRecord);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // fallback
      }
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      const purposeLabel = USE_CASES.find(u => u.id === formData.useCase)?.label || formData.useCase;
      const waText = `Hi Computer Care, I would like to request an expert PC consultation:\nName: ${formData.fullName}\nPhone: ${formData.phone}\nCity: ${formData.city}\nPurpose: ${purposeLabel}\nBudget: ${formData.budget}\nPreferred Call Time: ${formData.callTime}\nNotes: ${formData.notes || 'None'}\n(Ref: ${refNumber})`;
      setSubmitError({
        message: 'Could not send consultation request online. Please check your connection or connect with us on WhatsApp.',
        details: waText
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.refNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#121c3b] to-[#1e293b] text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FREE EXPERT HARDWARE CONSULTATION & RECOMMENDATION</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white leading-tight">
            Not Sure What Parts to Pick? <span className="text-amber-400">Let Our PC Architects Guide You</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Tell us your budget and what you want to use the computer for. A Computer Care hardware specialist will call you directly, discuss your requirements, check socket compatibility, and recommend the best zero-bottleneck rig tailored to your exact needs.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/10 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Callback in ~30 Mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Honest Guidance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Zero Bottlenecks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              <span>Direct Sales Engineer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success State */}
      {submittedRequest ? (
        <div className="bg-emerald-50 border-2 border-emerald-400/90 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-emerald-950">
                  Consultation Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Thank you, <span className="font-semibold text-emerald-900">{submittedRequest.fullName}</span>. An expert PC architect from Computer Care will call you at <span className="font-semibold text-emerald-900">{submittedRequest.phone}</span> shortly.
                </p>
              </div>
            </div>

            <div className="bg-white border border-emerald-300 rounded-xl px-4 py-2 flex items-center gap-3 shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Call Request ID</span>
                <span className="text-sm font-black font-mono text-emerald-800">{submittedRequest.refNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="Copy Reference"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white/80 rounded-xl p-4 border border-emerald-200 text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Primary Purpose</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {USE_CASES.find(u => u.id === submittedRequest.useCase)?.label || submittedRequest.useCase}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Budget</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{submittedRequest.budget}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Preferred Call Time</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{submittedRequest.callTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-emerald-900">
              Want immediate recommendations? Call our hardware team directly at <strong>+91 9810550222</strong>
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/919810550222?text=Hello%20Computer%20Care%20Team%2C%20I%20have%20submitted%20a%20PC%20recommendation%20call%20request%20(Ref%3A%20${encodeURIComponent(submittedRequest.refNumber)})%20for%20my%20${encodeURIComponent(submittedRequest.useCase)}%20PC%20build.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>WhatsApp Hardware Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onBackToBuilder}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium text-xs transition-colors"
              >
                Back to DIY Builder
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* The Form */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          {submitError && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>{submitError.message}</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/919810550222?text=${encodeURIComponent(submitError.details)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp instead</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">
              Request Your Free PC Recommendation Callback
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Fill in your details below and our hardware engineers will analyze market options and call you with a tailored parts list and official quotation.
            </p>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Your Name <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Vikas Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.fullName && <span className="text-[11px] text-rose-500">{errors.fullName}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone / WhatsApp <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="tel"
                maxLength={15}
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.phone && <span className="text-[11px] text-rose-500">{errors.phone}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>City & State <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Ghaziabad / Delhi NCR"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none transition-colors ${
                  errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.city && <span className="text-[11px] text-rose-500">{errors.city}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email</span>
                </span>
                <span className="text-[10px] text-slate-400">Optional</span>
              </label>
              <input
                type="email"
                maxLength={100}
                placeholder="vikas@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Primary Use Case Selection */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-brand-blue" />
              <span>What is the primary purpose of your PC? <span className="text-rose-500">*</span></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {USE_CASES.map((uc) => {
                const isSelected = formData.useCase === uc.id;
                return (
                  <button
                    key={uc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, useCase: uc.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold leading-snug">{uc.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{uc.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Time Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Target Budget Range
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Preferred Brand / Platform
              </label>
              <select
                value={formData.preferredBrand}
                onChange={(e) => setFormData({ ...formData, preferredBrand: e.target.value })}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="Suggest Best for Budget">Suggest Best for Budget (Recommended)</option>
                <option value="Intel Core + NVIDIA GeForce">Intel Core + NVIDIA GeForce</option>
                <option value="AMD Ryzen + NVIDIA GeForce">AMD Ryzen + NVIDIA GeForce</option>
                <option value="All-AMD (Ryzen + Radeon)">All-AMD (Ryzen + Radeon)</option>
                <option value="Budget Commercial / Office">Budget Commercial / Office</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>When should we call you?</span>
              </label>
              <select
                value={formData.callTime}
                onChange={(e) => setFormData({ ...formData, callTime: e.target.value })}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Notes */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Any specific requirements, target software, or questions?</span>
              <span className="text-[10px] text-slate-400">Optional</span>
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="e.g. Need high FPS in CS2 and Valorant, prefer white aesthetics with RGB, or need 32GB RAM for Blender..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit Strip */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>We never spam. You will receive a single consultative call from our hardware architect.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToBuilder}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel / Build Myself
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-transform hover:scale-105 disabled:opacity-50 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Request PC Recommendation Call'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
