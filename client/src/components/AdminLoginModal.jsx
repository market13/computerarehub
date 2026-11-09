import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccessAdminLogin
}) {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'customer'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Customer form state
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerMsg, setCustomerMsg] = useState('');

  if (!isOpen) return null;

  const isAlreadyAdmin = typeof window !== 'undefined' && localStorage.getItem('computercare_admin_auth') === 'true';

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Support 'admin', 'admin@computercare.in', 'computercare'
      const isUserValid = cleanUser === 'admin' || cleanUser === 'admin@computercare.in' || cleanUser === 'computercare';
      const isPassValid = cleanPass === 'admin123' || cleanPass === 'computercare';

      if (isUserValid && isPassValid) {
        localStorage.setItem('computercare_admin_auth', 'true');
        setIsLoading(false);
        onClose();
        onSuccessAdminLogin();
      } else {
        setIsLoading(false);
        setError('Invalid username or password. (Demo: admin / admin123)');
      }
    }, 400);
  };

  const handleOneClickDemo = () => {
    localStorage.setItem('computercare_admin_auth', 'true');
    onClose();
    onSuccessAdminLogin();
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('computercare_admin_auth');
    setError('');
    setPassword('');
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      setCustomerMsg('Please enter your email address');
      return;
    }
    setCustomerMsg('Guest shopper session authenticated. Cloud sync enabled!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden flex flex-col relative"
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
                Sign in to your account or administrator workspace
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
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'border-brand-navy text-brand-navy bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>Admin Portal</span>
          </button>

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
            <span>Customer Login</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <div>
              {isAlreadyAdmin ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-display font-bold text-sm text-emerald-900">
                        Admin Session Currently Active
                      </strong>
                      <span className="text-emerald-700 leading-relaxed block mt-0.5">
                        You are authenticated as store administrator with full control over orders, inventory, pricing, and quotations.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSuccessAdminLogin();
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
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Admin Username / Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin or admin@computercare.in"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent font-medium"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Administrator Password / Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>Default demo: <strong className="font-mono text-slate-700">admin / admin123</strong></span>
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
                    <span>{isLoading ? 'Verifying...' : 'Log In to Admin Portal'}</span>
                    <ArrowRight className="w-4 h-4 text-brand-gold" />
                  </button>

                  {/* One-Click Quick Demo Pill */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Need instant testing?</span>
                    <button
                      type="button"
                      onClick={handleOneClickDemo}
                      className="text-xs font-bold text-brand-blue hover:text-brand-navy flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      <span>1-Click Admin Access</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOMER LOGIN */}
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Customer Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {customerMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{customerMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Sign In as Customer
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                >
                  Continue browsing store as Guest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
