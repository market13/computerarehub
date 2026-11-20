import React, { useState } from 'react';
import { Search, Wrench, Clock, CheckCircle2, AlertCircle, Laptop, MapPin, ArrowRight } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getRepairTicket, createRepairTicket, REPAIR_STATUS_MAP } from '../services/repairService';
import { validateIndianPhone, checkSubmissionRateLimit } from '../utils/validation';

export default function RepairStatusLookup() {
  const [activeTab, setActiveTab] = useState('track'); // 'track' | 'book'
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deviceType: 'Laptop',
    deviceBrandModel: '',
    issueDescription: '',
    accessoriesIncluded: '',
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setTicket(null);

    try {
      const res = await getRepairTicket(query);
      if (res && res.data) {
        setTicket(res.data);
      } else {
        setSearchError(`No repair job found for "${query}". Please check your Job ID (e.g. CC-REP-1042) or mobile number.`);
      }
    } catch {
      setSearchError('Unable to check repair status. Please try again or WhatsApp our service team.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.customerPhone || !bookingForm.deviceBrandModel || !bookingForm.issueDescription) {
      setBookingError('Please fill in your name, phone number, device model, and issue description.');
      return;
    }

    const rateCheck = checkSubmissionRateLimit('repair_booking', 15);
    if (!rateCheck.allowed) {
      setBookingError(rateCheck.message);
      return;
    }

    const phoneCheck = validateIndianPhone(bookingForm.customerPhone);
    if (!phoneCheck.isValid) {
      setBookingError(phoneCheck.message);
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError('');

    try {
      const res = await createRepairTicket(bookingForm);
      if (res && res.data) {
        setBookingSuccess(res.data);
        setBookingForm({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          deviceType: 'Laptop',
          deviceBrandModel: '',
          issueDescription: '',
          accessoriesIncluded: '',
        });
      } else {
        setBookingError('Could not register repair booking. Please reach us directly via WhatsApp.');
      }
    } catch {
      setBookingError('Error creating booking. Please contact Computer Care at +91 9810550222.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Top Banner & Tabs */}
      <div className="bg-gradient-to-r from-[#0d1633] via-[#15234f] to-[#1c2c66] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Computer Care Service Center | Shiva Tower, Ghaziabad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Repair & Service Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track live service progress for your laptop or desktop PC, or register a new repair diagnostic request before visiting our shop.
            </p>
          </div>

          <div className="flex items-center bg-white/10 p-1 rounded-xl backdrop-blur-xs border border-white/15 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'track' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Track Job Status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('book')}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'book' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Book Repair
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Track Status */}
      {activeTab === 'track' && (
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-600 mb-2">
              Enter Job ID or Registered 10-Digit Phone Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. CC-REP-1042 or 9810550000"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#1b2269] hover:bg-[#141a54] text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSearching ? 'Checking...' : 'Check Status'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Enter your repair job ID (e.g. <span className="font-mono text-slate-600 font-semibold">CC-REP-1042</span>) or your 10-digit registered mobile number.
            </p>
          </form>

          {searchError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{searchError}</p>
                <p className="text-xs text-amber-800 mt-1">
                  Need help? WhatsApp our service technicians at <a href="https://wa.me/919810550222" target="_blank" rel="noopener noreferrer" className="font-bold underline">+91 9810550222</a>.
                </p>
              </div>
            </div>
          )}

          {ticket && (
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Ticket Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-black font-mono text-brand-navy">
                      {ticket.job_id}
                    </span>
                    {ticket.status && REPAIR_STATUS_MAP[ticket.status] && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${REPAIR_STATUS_MAP[ticket.status].color}`}>
                        {REPAIR_STATUS_MAP[ticket.status].label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: <span className="font-semibold text-slate-800">{ticket.customer_name}</span> | Checked in: {new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <a
                  href={`https://wa.me/919810550222?text=${encodeURIComponent(`Hi Computer Care, inquiring regarding my Repair Job ID: ${ticket.job_id} (${ticket.device_brand_model})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all shadow-sm"
                >
                  <WhatsAppIcon variant="badge" className="w-4 h-4" />
                  <span>Ask Technician</span>
                </a>
              </div>

              {/* Status Visual Tracker */}
              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-3">
                  Service Milestone
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: 'received', title: '1. Received' },
                    { key: 'diagnosing', title: '2. Diagnosing' },
                    { key: 'in_progress', title: '3. Repairing' },
                    { key: 'ready_for_pickup', title: '4. Ready for Pickup' },
                    { key: 'delivered', title: '5. Delivered' },
                  ].map((step, idx) => {
                    const currentStep = REPAIR_STATUS_MAP[ticket.status]?.step || 1;
                    const stepNum = idx + 1;
                    const isDone = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-white animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                        <span className="text-[11px] font-bold">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Device & Issue Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Device Info
                  </span>
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>{ticket.device_brand_model}</span>
                  </div>
                  <p className="text-slate-600">Type: <span className="font-semibold text-slate-800">{ticket.device_type}</span></p>
                  {ticket.serial_number && (
                    <p className="text-slate-600">Serial/Tag: <span className="font-mono text-slate-800">{ticket.serial_number}</span></p>
                  )}
                  <p className="text-slate-600">Reported Issue: <span className="font-medium text-slate-800">{ticket.issue_description}</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Technician Notes & Estimate
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px] leading-relaxed">
                    {ticket.technician_notes || 'No public notes updated yet. Our bench engineers are currently servicing your machine.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Estimated Charges:</span>
                    <span className="font-black font-display text-brand-navy text-sm">
                      {ticket.final_cost ? `₹${Number(ticket.final_cost).toLocaleString('en-IN')}` : ticket.estimated_cost ? `~₹${Number(ticket.estimated_cost).toLocaleString('en-IN')}` : 'To be assessed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Book Repair Diagnostic */}
      {activeTab === 'book' && (
        <div className="p-6 sm:p-8">
          {bookingSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 text-emerald-900 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold">Repair Diagnostic Registered!</h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your service token has been generated. Bring your device to Computer Care at Shiva Tower, Ghaziabad.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Your Repair Job ID
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700">
                    {bookingSuccess.jobId}
                  </span>
                </div>
                <a
                  href={`https://wa.me/919810550222?text=${encodeURIComponent(`Hi Computer Care, I just booked a repair online with Job ID: ${bookingSuccess.jobId}. Please confirm desk availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <WhatsAppIcon variant="badge" className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => { setBookingSuccess(null); setActiveTab('track'); setQuery(bookingSuccess.jobId); }}
                className="self-start text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1">Track this Job ID now <ArrowRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5 max-w-3xl">
              {bookingError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold">
                  {bookingError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    placeholder="e.g. 9810550222"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Device Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bookingForm.deviceType}
                    onChange={(e) => setBookingForm({ ...bookingForm, deviceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop PC">Desktop Computer</option>
                    <option value="Custom Gaming Rig">Custom Gaming Rig</option>
                    <option value="Component">Individual Component (GPU, PSU, etc.)</option>
                    <option value="Other">Other Electronic Device</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Device Brand & Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.deviceBrandModel}
                    onChange={(e) => setBookingForm({ ...bookingForm, deviceBrandModel: e.target.value })}
                    placeholder="e.g. Dell Inspiron 15 / Asus ROG Strix"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Issue / Symptoms <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={bookingForm.issueDescription}
                  onChange={(e) => setBookingForm({ ...bookingForm, issueDescription: e.target.value })}
                  placeholder="e.g. Blue screen error (BSOD), no display on monitor, slow booting, fan noise, or liquid damage..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Shiva Tower, Ghaziabad | Mon-Sat 10:30 AM - 8:00 PM</span>
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSubmittingBooking ? 'Registering...' : 'Generate Repair Job ID'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
