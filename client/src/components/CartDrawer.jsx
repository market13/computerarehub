import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Box,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitToNetlify } from '../utils/formSubmit';

export default function CartDrawer({
  isOpen,
  onClose,
  build = {},
  onRemoveItem,
  onClearCart
}) {
  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  const items = Object.entries(build)
    .filter(([, item]) => item !== null)
    .map(([key, item]) => ({ slotKey: key, ...item }));

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const gstTax = Math.round(subtotal * 0.18); // 18% GST standard in India
  const shipping = subtotal > 5000 ? 0 : 499;
  const grandTotal = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setView('checkout');
    setSubmitError(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!customer.fullName.trim()) errs.fullName = 'Please enter your name';
    if (!customer.phone.trim()) {
      errs.phone = 'Please enter your 10-digit phone number';
    } else {
      const clean = customer.phone.replace(/[\s\-\+\(\)]/g, '');
      if (clean.length < 10) errs.phone = 'Please enter a valid 10-digit number';
    }
    if (!customer.city.trim()) errs.city = 'Please enter delivery city / address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const refNumber = `CC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsFormatted = items
      .map((i, idx) => `${idx + 1}. [${i.slotKey.toUpperCase()}] ${i.title} - ₹${i.price.toLocaleString('en-IN')}`)
      .join('\n');

    const orderData = {
      refNumber,
      fullName: customer.fullName.slice(0, 80),
      phone: customer.phone,
      email: customer.email || '',
      city: customer.city.slice(0, 100),
      notes: customer.notes || '',
      itemCount: items.length,
      subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
      tax: `₹${gstTax.toLocaleString('en-IN')}`,
      shipping: shipping === 0 ? 'FREE' : `₹${shipping}`,
      total: `₹${grandTotal.toLocaleString('en-IN')}`,
      cartItems: itemsFormatted,
      timestamp: new Date().toISOString()
    };

    try {
      await submitToNetlify('cart-checkout', orderData);

      // Save order to localStorage for customer/admin history
      try {
        const raw = localStorage.getItem('computercare_orders');
        const existing = raw ? JSON.parse(raw) : [];
        const updated = Array.isArray(existing) ? [orderData, ...existing].slice(0, 20) : [orderData];
        localStorage.setItem('computercare_orders', JSON.stringify(updated));
      } catch (saveErr) {
        console.warn('LocalStorage order save failed:', saveErr);
      }

      setSubmittedOrder(orderData);
      setView('success');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      const waText = `Hi Computer Care, I would like to submit my hardware order inquiry:\n\n*Cart Items (${items.length}):*\n${itemsFormatted}\n\n*Total Payable:* ₹${grandTotal.toLocaleString('en-IN')}\n\n*Customer Details:*\n• Name: ${customer.fullName}\n• Phone: ${customer.phone}\n• City: ${customer.city}\n• Notes: ${customer.notes || 'None'}\n(Ref: ${refNumber})`;
      setSubmitError({
        message: 'Could not submit order online. Please check your connection or send directly via WhatsApp.',
        details: waText,
        refNumber
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedOrder) {
      navigator.clipboard.writeText(submittedOrder.refNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleFinishAndClear = () => {
    if (onClearCart) onClearCart();
    setView('cart');
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-border">
          
          {/* Drawer Header */}
          <div className="p-4 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {view === 'checkout' && (
                <button
                  onClick={() => setView('cart')}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-200 transition-colors mr-1"
                  title="Back to cart"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider">
                {view === 'success' 
                  ? 'Order Confirmed' 
                  : view === 'checkout' 
                    ? 'Checkout Details' 
                    : `Your Hardware Cart (${items.length})`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* VIEW: SUCCESS CONFIRMATION */}
          {view === 'success' && submittedOrder && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex flex-col items-center text-center pt-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Order Inquiry Placed!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs font-sans">
                  Thank you, <strong className="text-slate-800">{submittedOrder.fullName}</strong>. Your hardware selection has been logged into our system.
                </p>
              </div>

              {/* Ref badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 uppercase block font-semibold">Order Reference ID</span>
                  <span className="text-base font-black font-mono text-emerald-950">{submittedOrder.refNumber}</span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  title="Copy Reference ID"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold">{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Order summary block */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-slate-700 font-sans">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Components Included:</span>
                  <span className="font-semibold text-slate-800">{submittedOrder.itemCount} items</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-semibold text-slate-800">{submittedOrder.phone}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Delivery Destination:</span>
                  <span className="font-semibold text-slate-800">{submittedOrder.city}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-slate-900 font-display">
                  <span>Total Payable:</span>
                  <span className="text-brand-navy">{submittedOrder.total}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Next Steps:</strong> A Computer Care assembly specialist will call or WhatsApp you at <strong>{submittedOrder.phone}</strong> within ~30 minutes to verify component compatibility, payment methods (Cash on Delivery / UPI / Card), and dispatch schedule.
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/919810550222?text=${encodeURIComponent(`Hi Computer Care, I just submitted order inquiry ${submittedOrder.refNumber} for ${submittedOrder.itemCount} parts (${submittedOrder.total}). Can you please verify dispatch status?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Shop on WhatsApp</span>
                </a>

                <button
                  onClick={handleFinishAndClear}
                  className="w-full py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Done & Clear Cart
                </button>
              </div>
            </div>
          )}

          {/* VIEW: CHECKOUT FORM */}
          {view === 'checkout' && (
            <form onSubmit={handleConfirmOrder} className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Delivery & Contact Information
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Provide your details for order confirmation and dispatch schedule.
                </p>
              </div>

              {submitError && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 text-rose-900 text-xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{submitError.message}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/919810550222?text=${encodeURIComponent(submitError.details)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp instead</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Rahul Sharma"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`px-3 py-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 focus:border-brand-navy'
                  }`}
                />
                {errors.fullName && <span className="text-[11px] text-rose-500">{errors.fullName}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number / WhatsApp <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  maxLength={15}
                  placeholder="+91 9876543210"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`px-3 py-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 focus:border-brand-navy'
                  }`}
                />
                {errors.phone && <span className="text-[11px] text-rose-500">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivery City & Address <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Indirapuram, Ghaziabad / Delhi NCR"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`px-3 py-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                    errors.city ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 focus:border-brand-navy'
                  }`}
                />
                {errors.city && <span className="text-[11px] text-rose-500">{errors.city}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address <span className="text-slate-400 font-normal">(Optional for GST invoice)</span></span>
                </label>
                <input
                  type="email"
                  maxLength={80}
                  placeholder="rahul@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-brand-navy focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">
                  Assembly & Delivery Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  placeholder="Need BIOS update, custom cable ties, specific delivery day..."
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-brand-navy focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Order total recap */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 font-sans mt-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Parts:</span>
                  <span className="font-semibold text-slate-800">{items.length} components</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Included):</span>
                  <span className="font-mono">₹{gstTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-mono text-emerald-600 font-semibold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm font-display">
                  <span>Total Payable:</span>
                  <span className="text-brand-navy">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setView('cart')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: DEFAULT CART ITEMS LIST */}
          {view === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
                {items.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Box className="w-12 h-12 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-700 font-display">Your Rig Cart is Empty</h4>
                    <p className="text-xs text-slate-400 mt-1 font-sans">
                      Select components in the 3D PC Builder or add parts from our catalog.
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.slotKey} className="py-3 flex items-start gap-3">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || item.cdn_image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                          {item.slotKey.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                          {item.title}
                        </h4>
                        <span className="text-xs font-bold font-display text-brand-navy block mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.slotKey)}
                        className="p-1.5 text-slate-400 hover:text-brand-red rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Price & Checkout Footer */}
              {items.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-brand-border flex flex-col gap-3">
                  <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                    <div className="flex justify-between">
                      <span>Hardware Subtotal</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% Included)</span>
                      <span className="font-mono text-slate-500">
                        ₹{gstTax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Insured Shipping</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2 font-display">
                      <span>Total Payable</span>
                      <span className="text-brand-navy text-base">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Secure Checkout • Brand Warranty Protected</span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
