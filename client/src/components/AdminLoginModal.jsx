import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Package,
  Cpu
} from 'lucide-react';
import {
  isSupabaseConfigured,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  onAuthStateChange
} from '../lib/supabase';
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerOrders,
  getCustomerSavedBuilds
} from '../services/customerService';

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLogout
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Customer auth state
  const [customerMode, setCustomerMode] = useState('login'); // 'login' | 'signup'
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMsg, setCustomerMsg] = useState({ type: '', text: '' });
  const [customerUser, setCustomerUser] = useState(null);

  // Customer account & history state
  const [customerSubTab, setCustomerSubTab] = useState('orders'); // 'orders' | 'builds' | 'profile'
  const [customerProfile, setCustomerProfile] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerBuilds, setCustomerBuilds] = useState([]);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    if (!customerUser) return;
    getCustomerProfile(customerUser.id).then((prof) => {
      if (prof) {
        setCustomerProfile(prof);
        setEditFullName(prof.full_name || '');
        setEditPhone(prof.phone || '');
      }
    });
    getCustomerOrders(customerUser.id, customerUser.email).then((ords) => {
      setCustomerOrders(ords || []);
    });
    getCustomerSavedBuilds(customerUser.id).then((blds) => {
      setCustomerBuilds(blds || []);
    });
  }, [customerUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!customerUser) return;
    setIsSavingProfile(true);
    setProfileSaveSuccess(false);
    try {
      const { data } = await updateCustomerProfile(customerUser.id, {
        fullName: editFullName,
        phone: editPhone,
      });
      if (data) {
        setCustomerProfile(data);
        setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.warn('Profile save error:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Check auth status on open and listen to changes
  useEffect(() => {
    if (!isOpen) return;

    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setCustomerUser(null);
        return;
      }
      const user = await getCurrentUser();
      setCustomerUser(user || null);
    }
    checkAuth();

    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setCustomerUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isOpen]);

  // Support closing on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerMsg({ type: '', text: '' });

    if (!isSupabaseConfigured()) {
      setCustomerMsg({
        type: 'error',
        text: 'Customer account service is unavailable because the backend is not configured.'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (customerMode === 'signup') {
        const { data, error: signupError } = await signUp(customerEmail, customerPassword, {
          full_name: customerName
        });
        setIsLoading(false);
        if (signupError) {
          setCustomerMsg({ type: 'error', text: signupError.message });
        } else {
          setCustomerMsg({
            type: 'success',
            text: data?.session
              ? 'Account created and signed in successfully!'
              : 'Account registered. Please check your email to verify your account.'
          });
          if (data?.session) {
            setCustomerUser(data.user);
            setTimeout(() => onClose(), 1500);
          }
        }
      } else {
        const { data, error: loginError } = await signIn(customerEmail, customerPassword);
        setIsLoading(false);
        if (loginError) {
          setCustomerMsg({ type: 'error', text: loginError.message });
        } else {
          setCustomerUser(data.user);
          setCustomerMsg({ type: 'success', text: 'Welcome back! Signed in successfully.' });
          setTimeout(() => onClose(), 1200);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setCustomerMsg({ type: 'error', text: err.message });
    }
  };

  const handleCustomerLogout = async () => {
    await signOut();
    setCustomerUser(null);
    setCustomerMsg({ type: 'success', text: 'You have been signed out.' });
    if (onLogout) onLogout();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden flex flex-col relative animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-brand-navy text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-gold border border-white/10">
              <User className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-tight text-white">
                Customer Account
              </h3>
              <p className="text-[11px] text-slate-300 font-sans">
                Sign in to track orders, manage saved builds, and checkout faster
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {customerUser ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold text-emerald-950">
                      {customerProfile?.full_name || customerUser.email}
                    </strong>
                    <span className="text-[11px] text-emerald-700">{customerUser.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCustomerLogout}
                  className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Customer Subtabs */}
              <div className="flex border-b border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCustomerSubTab('orders')}
                  className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                    customerSubTab === 'orders' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Orders ({customerOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerSubTab('builds')}
                  className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                    customerSubTab === 'builds' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Saved Builds ({customerBuilds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerSubTab('profile')}
                  className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                    customerSubTab === 'profile' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Profile Settings
                </button>
              </div>

              {/* Subtab: Orders */}
              {customerSubTab === 'orders' && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {customerOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>No orders placed yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Orders placed under this account will appear here with live tracking.</p>
                    </div>
                  ) : (
                    customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{ord.order_ref || ord.id.slice(0, 8)}</span>
                          <span className="text-emerald-700">₹{(ord.total || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="capitalize">{ord.status || 'Pending'}</span>
                          <span>{new Date(ord.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                        {ord.tracking_number && (
                          <div className="text-[10px] text-brand-blue font-mono pt-1">
                            Tracking: {ord.courier || 'Courier'} #{ord.tracking_number}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Subtab: Builds */}
              {customerSubTab === 'builds' && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {customerBuilds.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>No saved PC builds found.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Save your custom PC rigs from the Configurator to easily revisit them later.</p>
                    </div>
                  ) : (
                    customerBuilds.map((b) => (
                      <div key={b.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                        <div>
                          <strong className="block font-bold text-slate-800">{b.title || 'Custom PC'}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">Code: {b.share_code}</span>
                        </div>
                        <a
                          href={`/builder?config=${b.share_code}`}
                          onClick={() => onClose()}
                          className="px-2.5 py-1 rounded-lg bg-brand-navy hover:bg-brand-blue text-white text-[11px] font-semibold transition-colors"
                        >
                          Load Build
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Subtab: Profile Settings */}
              {customerSubTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98105 50222"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                    />
                  </div>

                  {profileSaveSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Account Panel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {!isSupabaseConfigured() && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Account sync unavailable: Supabase backend is not configured.</span>
                </div>
              )}

              {customerMode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {customerMsg.text && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  customerMsg.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                }`}>
                  {customerMsg.type === 'error' ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{customerMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isSupabaseConfigured()}
                className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : (customerMode === 'signup' ? 'Create Account' : 'Sign In')}</span>
                <ArrowRight className="w-4 h-4 text-brand-gold" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode(customerMode === 'login' ? 'signup' : 'login');
                    setCustomerMsg({ type: '', text: '' });
                  }}
                  className="text-xs text-brand-blue hover:underline font-semibold"
                >
                  {customerMode === 'login'
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
