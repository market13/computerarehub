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
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  Copy,
  Tag,
  Loader2,
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import confetti from 'canvas-confetti';
import { createOrderRequest, formatWhatsAppOrderMessage } from '../services/orderService';
import { validateCoupon } from '../services/couponService';
import { notifyShopNewOrder } from '../services/notificationService';
import { STORE_PHONE } from '../constants/storeInfo';

export default function CartDrawer({
  isOpen,
  onClose,
  build = {},
  standaloneItems = [],
  onRemoveItem,
  onRemoveStandaloneItem,
  onClearCart,
}) {
  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Build items from PC configurator
  const buildItems = Object.entries(build)
    .filter(([, item]) => item !== null)
    .map(([key, item]) => ({ slotKey: key, itemType: 'custom_pc_build', ...item }));

  // Standalone items from catalog
  const directItems = (standaloneItems || []).map((item) => ({
    itemType: 'standalone_product',
    ...item,
  }));

  // Unified items
  const allItems = [...buildItems, ...directItems];

  const subtotal = allItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const gstTax = Math.round(subtotal * 0.18); // 18% GST standard in India
  const shipping = subtotal > 5000 ? 0 : 499;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shipping);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponMsg({ type: '', text: '' });

    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discount);
        setCouponMsg({ type: 'success', text: res.message });
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponMsg({ type: 'error', text: res.message });
      }
    } catch {
      setCouponMsg({ type: 'error', text: 'Error validating coupon code.' });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponMsg({ type: '', text: '' });
  };

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
      const clean = customer.phone.replace(/[^\d]/g, '');
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

    // Prevent duplicate orders with client-side idempotency key
    const idempotencyKey = `idem_${customer.phone.replace(/\D/g, '')}_${subtotal}_${Date.now()}`;

    try {
      const formattedItems = allItems.map((i) => ({
        product_id: i.dbId || i.id,
        quantity: i.quantity || 1,
        item_type: i.itemType,
        price: i.price,
        title: i.title,
      }));

      const result = await createOrderRequest({
        customerName: customer.fullName.trim(),
        customerEmail: customer.email.trim(),
        customerPhone: customer.phone.trim(),
        customerNotes: customer.notes.trim(),
        shippingAddress: { city: customer.city.trim() },
        items: formattedItems,
        couponCode: appliedCoupon?.code || null,
        idempotencyKey,
      });

      const orderNumber = result.orderNumber;
      const orderSummary = {
        orderNumber,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        city: customer.city,
        notes: customer.notes,
        itemCount: allItems.length,
        subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
        discount: couponDiscount > 0 ? `₹${couponDiscount.toLocaleString('en-IN')}` : null,
        total: `₹${grandTotal.toLocaleString('en-IN')}`,
        items: allItems,
      };

      setSubmittedOrder(orderSummary);
      setView('success');

      // Trigger store owner email notification (if CONTACT_EMAIL configured)
      notifyShopNewOrder({
        orderNumber,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        totalAmount: grandTotal,
        itemCount: allItems.length,
      }).catch((err) => console.warn('Shop notification error:', err));

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Confetti fallback
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      const fallbackWaText = formatWhatsAppOrderMessage({
        orderNumber: 'OFFLINE-REQ',
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerCity: customer.city,
        items: allItems,
        totalAmount: grandTotal,
      });

      setSubmitError({
        message: 'Could not submit order online. Please verify connection or confirm directly via WhatsApp.',
        details: fallbackWaText,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedOrder) {
      navigator.clipboard.writeText(submittedOrder.orderNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleFinishAndClear = () => {
    if (onClearCart) onClearCart();
    setView('cart');
    setSubmittedOrder(null);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-border">
          {/* Drawer Header */}
          <div className="p-4 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {view === 'checkout' && (
                <button
                  type="button"
                  onClick={() => setView('cart')}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-200 transition-colors mr-1 cursor-pointer"
                  title="Back to cart"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider">
                {view === 'success'
                  ? 'Order Request Received'
                  : view === 'checkout'
                  ? 'Confirm Order Request'
                  : `Your Hardware Cart (${allItems.length})`}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                  Order Request Submitted!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs font-sans">
                  Thank you, <strong className="text-slate-800">{submittedOrder.fullName}</strong>.
                  Your order request has been logged.
                </p>
              </div>

              {/* Ref badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 uppercase block font-semibold">
                    Order Reference ID
                  </span>
                  <span className="text-base font-black font-mono text-emerald-950">
                    {submittedOrder.orderNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
                {submittedOrder.discount && (
                  <div className="flex justify-between pb-2 border-b border-slate-200 text-emerald-700">
                    <span>Coupon Discount:</span>
                    <span className="font-bold">-{submittedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-sm font-bold text-slate-900 font-display">
                  <span>Total Payable (Offline):</span>
                  <span className="text-brand-navy">{submittedOrder.total}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Offline Confirmation:</strong> A Computer Care specialist will contact you via WhatsApp / Call at <strong>{submittedOrder.phone}</strong> to verify hardware availability, provide UPI / Bank QR details, and schedule dispatch.
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/${(STORE_PHONE || '919810550222').replace(/\D/g, '')}?text=${encodeURIComponent(
                    formatWhatsAppOrderMessage({
                      orderNumber: submittedOrder.orderNumber,
                      customerName: submittedOrder.fullName,
                      customerPhone: submittedOrder.phone,
                      customerCity: submittedOrder.city,
                      items: submittedOrder.items,
                      totalAmount: submittedOrder.total,
                    })
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <WhatsAppIcon variant="badge" className="w-4 h-4" />
                  <span>Send Order Confirmation on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleFinishAndClear}
                  className="w-full py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
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
                  Orders are processed as order requests and confirmed offline via WhatsApp/phone.
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
                      href={`https://wa.me/${(STORE_PHONE || '919810550222').replace(/\D/g, '')}?text=${encodeURIComponent(submitError.details)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <WhatsAppIcon variant="badge" className="w-3.5 h-3.5" />
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

              {/* Coupon Form */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-navy" />
                  <span>Have a Promo Coupon?</span>
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div>
                      <strong className="font-bold">{appliedCoupon.code}</strong> applied (-₹{couponDiscount.toLocaleString('en-IN')})
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. CARE1000, GHZFIRST"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-brand-navy font-mono uppercase"
                    />
                    <button
                      type="button"
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-brand-blue text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {couponMsg.text && (
                  <div className={`text-[11px] ${couponMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponMsg.text}
                  </div>
                )}
              </div>

              {/* Order total recap */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 font-sans mt-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Parts:</span>
                  <span className="font-semibold text-slate-800">{allItems.length} components</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Included):</span>
                  <span className="font-mono text-slate-500">₹{gstTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-mono text-emerald-600 font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
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
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                {allItems.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Box className="w-12 h-12 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-700 font-display">Your Rig Cart is Empty</h4>
                    <p className="text-xs text-slate-400 mt-1 font-sans">
                      Select components in the Custom PC Builder or add parts from our catalog.
                    </p>
                  </div>
                ) : (
                  allItems.map((item, idx) => (
                    <div key={item.slotKey || item.id || idx} className="py-3 flex items-start gap-3">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || item.cdn_image || `/images/products/${item.category || 'case'}/default.jpg`}
                          alt={item.title}
                          width="56"
                          height="56"
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {item.slotKey ? item.slotKey.toUpperCase() : 'STANDALONE'}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                          {item.title}
                        </h4>
                        <span className="text-xs font-bold font-display text-brand-navy block mt-1">
                          ₹{(Number(item.price) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (item.slotKey && onRemoveItem) {
                            onRemoveItem(item.slotKey);
                          } else if (onRemoveStandaloneItem) {
                            onRemoveStandaloneItem(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-red rounded transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Price & Checkout Footer */}
              {allItems.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-brand-border flex flex-col gap-3">
                  <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                    <div className="flex justify-between">
                      <span>Hardware Subtotal</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Coupon Discount</span>
                        <span className="font-mono font-bold">
                          -₹{couponDiscount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (18% Included)</span>
                      <span className="font-mono text-slate-500">
                        ₹{gstTax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Insured Shipping</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2 font-display">
                      <span>Total Payable (Offline)</span>
                      <span className="text-brand-navy text-base">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Collected Offline Upon Confirmation • Genuine Brand Warranty</span>
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
