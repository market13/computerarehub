import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  build = {},
  onRemoveItem,
  _onClearCart
}) {
  if (!isOpen) return null;

  const items = Object.entries(build)
    .filter(([, item]) => item !== null)
    .map(([key, item]) => ({ slotKey: key, ...item }));

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const gstTax = Math.round(subtotal * 0.18); // 18% GST standard in India
  const shipping = subtotal > 5000 ? 0 : 499;
  const grandTotal = subtotal + shipping;

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert(`Thank you for choosing Computer Care! Your order inquiry for ${items.length} parts totaling ₹${grandTotal.toLocaleString('en-IN')} has been submitted. Our technical team will reach out via WhatsApp/Phone for order dispatch and assembly verification.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-elite-border">
          {/* Drawer Header */}
          <div className="p-4 bg-elite-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-elite-gold" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider">
                Your Hardware Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
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
                    <span className="text-xs font-bold font-display text-elite-navy block mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.slotKey)}
                    className="p-1.5 text-slate-400 hover:text-elite-red rounded"
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
            <div className="p-4 bg-slate-50 border-t border-elite-border flex flex-col gap-3">
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
                  <span className="text-elite-navy text-base">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-elite-red hover:bg-elite-redHover text-white font-display font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
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
        </div>
      </div>
    </div>
  );
}
