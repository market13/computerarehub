import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Lock
} from 'lucide-react';
import {
  isSupabaseConfigured,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  checkIsAdmin,
  onAuthStateChange
} from '../lib/supabase';

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccessAdminLogin,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'customer'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [logoutNotice, setLogoutNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState(null);

  // Customer auth state
  const [customerMode, setCustomerMode] = useState('login'); // 'login' | 'signup'
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMsg, setCustomerMsg] = useState({ type: '', text: '' });
  const [customerUser, setCustomerUser] = useState(null);

  // Check auth status on open and listen to changes
  useEffect(() => {
    if (!isOpen) return;

    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setCurrentAdminUser(null);
        setCustomerUser(null);
        return;
      }
      const user = await getCurrentUser();
      if (user) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) {
          setCurrentAdminUser(user);
        } else {
          setCustomerUser(user);
        }
      } else {
        setCurrentAdminUser(null);
        setCustomerUser(null);
      }
    }
    checkAuth();

    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) {
          setCurrentAdminUser(session.user);
        } else {
          setCustomerUser(session.user);
        }
      } else {
        setCurrentAdminUser(null);
        setCustomerUser(null);
      }
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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Admin unavailable: backend not configured. Please set Supabase environment variables.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = await signIn(adminEmail, adminPassword);
      if (authError || !data?.user) {
        setIsLoading(false);
        setError(authError?.message || 'Invalid administrator email or password.');
        return;
      }

      // Verify server-side role from public.profiles
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        await signOut();
        setIsLoading(false);
        setError('Access denied: Account does not possess administrator privileges in profiles.');
        return;
      }

      setCurrentAdminUser(data.user);
      setIsLoading(false);
      onClose();
      if (onSuccessAdminLogin) onSuccessAdminLogin();
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An unexpected authentication error occurred.');
    }
  };

  const handleLogoutAdmin = async () => {
    await signOut();
    setCurrentAdminUser(null);
    setAdminPassword('');
    setError('');
    setLogoutNotice('Administrator session has been securely terminated.');
    if (onLogout) onLogout();
  };

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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-tight text-white">
                Computer Care Portal
              </h3>
              <p className="text-[11px] text-slate-300 font-sans">
                Sign in to your customer account or administrator console
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-display font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setError(''); }}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'border-brand-navy text-brand-navy bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-brand-blue" />
            <span>Customer Account</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'border-brand-navy text-brand-navy bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>Store Admin</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: CUSTOMER AUTH */}
          {activeTab === 'customer' && (
            <div>
              {customerUser ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-display font-bold text-sm text-emerald-900">
                        Signed In as Customer
                      </strong>
                      <span className="text-emerald-700 leading-relaxed block mt-0.5">
                        {customerUser.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue Shopping</span>
                      <ArrowRight className="w-4 h-4 text-brand-gold" />
                    </button>

                    <button
                      type="button"
                      onClick={handleCustomerLogout}
                      className="py-3 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
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
          )}

          {/* TAB 2: ADMIN AUTH */}
          {activeTab === 'admin' && (
            <div>
              {!isSupabaseConfigured() ? (
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-950 font-display">
                    <Lock className="w-5 h-5 text-amber-700" />
                    <span>Admin unavailable: backend not configured</span>
                  </div>
                  <p className="leading-relaxed text-amber-800">
                    Administrator access requires a connected Supabase backend. Please configure <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code>.
                  </p>
                </div>
              ) : currentAdminUser ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-display font-bold text-sm text-emerald-900">
                        Admin Session Verified
                      </strong>
                      <span className="text-emerald-700 leading-relaxed block mt-0.5">
                        Authenticated as <strong>{currentAdminUser.email}</strong> with server-verified administrator role.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSuccessAdminLogin) onSuccessAdminLogin();
                      }}
                      className="flex-1 py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Open Admin Portal</span>
                      <ArrowRight className="w-4 h-4 text-brand-gold" />
                    </button>

                    <button
                      type="button"
                      onClick={handleLogoutAdmin}
                      className="py-3 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Log Out Admin"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  {logoutNotice && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{logoutNotice}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@computercaregzb.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter administrator password"
                        required
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

                  {error && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Verifying with Supabase...' : 'Log In to Admin Console'}</span>
                    <ArrowRight className="w-4 h-4 text-brand-gold" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
