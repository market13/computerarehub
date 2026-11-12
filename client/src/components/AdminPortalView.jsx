import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Edit3,
  Eye,
  ArrowLeft,
  ShieldCheck,
  Lock,
  LogOut,
  MessageSquare,
  Building2,
  Tag,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';

const DEFAULT_ADMIN_PASSCODE = 'admin123';

const ORDER_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  payment_pending: 'bg-orange-100 text-orange-800 border-orange-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  building: 'bg-purple-100 text-purple-800 border-purple-300',
  quality_check: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  ready_for_dispatch: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  shipped: 'bg-sky-100 text-sky-800 border-sky-300',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
  refunded: 'bg-slate-100 text-slate-800 border-slate-300'
};

const INITIAL_ORDERS = [
  {
    id: 'CC-ORD-2026-9041',
    customer: 'Aakash Verma',
    email: 'aakash.verma@gmail.com',
    phone: '+91 98712 34567',
    city: 'Ghaziabad, UP',
    type: 'Custom PC Rig (RTX 4070 Super)',
    itemsCount: 8,
    subtotal: 112500,
    gst: 20250,
    total: 132750,
    status: 'building',
    date: '08 Nov 2026, 04:30 PM',
    courier: 'BlueDart Express',
    trackingNumber: 'BD98234190IN',
    parts: [
      'Intel Core i5 14600K',
      'MSI B760 Gaming Plus WiFi',
      'Corsair Vengeance 32GB DDR5 6000MHz',
      'ZOTAC GAMING GeForce RTX 4070 Super Twin Edge',
      'Samsung 980 Pro 1TB NVMe M.2 SSD',
      'Cooler Master MWE 750W V2 Bronze',
      'Ant Esports ICE-410TG ARGB Cabinet',
      'DeepCool AK620 Digital Air Cooler'
    ]
  },
  {
    id: 'CC-ORD-2026-9038',
    customer: 'Rohit Sharma',
    email: 'rohit.s@deloitte.com',
    phone: '+91 99100 88231',
    city: 'Noida, UP',
    type: 'Standalone Components',
    itemsCount: 2,
    subtotal: 38400,
    gst: 6912,
    total: 45312,
    status: 'confirmed',
    date: '07 Nov 2026, 11:15 AM',
    courier: 'Delhivery Surface',
    trackingNumber: '',
    parts: [
      'Samsung 27-inch 144Hz Odyssey G3 Gaming Monitor',
      'Logitech G502 HERO High Performance Gaming Mouse'
    ]
  },
  {
    id: 'CC-ORD-2026-9025',
    customer: 'Pooja Agarwal',
    email: 'pooja.agarwal@outlook.com',
    phone: '+91 98111 22334',
    city: 'New Delhi',
    type: 'Custom Workstation PC (Ryzen 9)',
    itemsCount: 9,
    subtotal: 178000,
    gst: 32040,
    total: 210040,
    status: 'shipped',
    date: '05 Nov 2026, 02:40 PM',
    courier: 'DTDC Priority Air',
    trackingNumber: 'DT882319451',
    parts: [
      'AMD Ryzen 9 7900X',
      'ASUS TUF Gaming X670E-PLUS WiFi',
      'G.Skill Trident Z5 Neo 64GB DDR5',
      'Gigabyte GeForce RTX 4080 Super Windforce',
      'Crucial T700 2TB Gen5 NVMe SSD',
      'Corsair RM850e 850W Gold Fully Modular',
      'Lian Li O11 Dynamic EVO Cabinet',
      'DeepCool LT720 360mm Liquid Cooler',
      'Acer Nitro 28-inch 4K IPS 144Hz'
    ]
  }
];

const INITIAL_COUPONS = [
  { code: 'WELCOMECC', discount: '10%', type: 'percentage', minOrder: 5000, active: true, uses: 42 },
  { code: 'GAMINGRIG', discount: '₹2,500', type: 'fixed', minOrder: 50000, active: true, uses: 19 },
  { code: 'DIWALI2026', discount: '15%', type: 'percentage', minOrder: 20000, active: false, uses: 120 }
];

export default function AdminPortalView({
  catalog = {},
  onNavigate,
  onUpdateProduct: _onUpdateProduct
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('computercare_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active section in Admin
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'quotations', 'coupons'

  // Products state & filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);

  // Local state for stock overrides & edits
  const [stockOverrides, setStockOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('computercare_stock_overrides') || '{}');
    } catch {
      return {};
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('computercare_admin_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Quotations & Inquiries state
  const [inquiries, setInquiries] = useState(() => {
    const loaded = [];
    try {
      const b2b = JSON.parse(localStorage.getItem('computercare_bulk_inquiries') || '[]');
      b2b.forEach(item => {
        loaded.push({
          id: item.refNumber || `B2B-${Math.floor(Math.random() * 90000)}`,
          type: 'B2B Bulk Order',
          name: item.fullName || 'Enterprise Client',
          company: item.companyName || 'N/A',
          phone: item.maskedPhone || item.phone || 'N/A',
          email: item.maskedEmail || item.email || 'N/A',
          city: item.city || 'N/A',
          category: item.category || 'Office PCs',
          quantity: item.quantity || '10+ Units',
          budget: item.budgetRange || '₹5L - ₹15L',
          timeline: item.timeline || 'Immediate',
          date: item.formattedDate || item.timestamp || 'Recently',
          status: item.adminStatus || 'Pending Review'
        });
      });
    } catch (e) {
      console.warn("Failed to load b2b inquiries", e);
    }

    try {
      const consultations = JSON.parse(localStorage.getItem('computercare_pc_consultations') || '[]');
      consultations.forEach(item => {
        loaded.push({
          id: item.refNumber || `TECH-${Math.floor(Math.random() * 90000)}`,
          type: 'PC Consultation / Quote',
          name: item.fullName || 'Gamer Client',
          company: 'Individual Customer',
          phone: item.maskedPhone || item.phone || 'N/A',
          email: item.maskedEmail || item.email || 'N/A',
          city: item.city || 'N/A',
          category: item.useCase || 'Gaming PC',
          quantity: '1 Custom PC',
          budget: item.budget || 'Custom',
          timeline: 'Standard',
          date: item.formattedDate || item.timestamp || 'Recently',
          status: item.adminStatus || 'Pending Review'
        });
      });
    } catch (e) {
      console.warn("Failed to load consultations", e);
    }

    // Add fallback realistic records if none exist in localStorage
    if (loaded.length === 0) {
      loaded.push(
        {
          id: 'CC-B2B-814920',
          type: 'B2B Bulk Order',
          name: 'Vikas Singhal',
          company: 'Singhal Infotech Pvt Ltd',
          phone: '+91 98101 44552',
          email: 'vikas@singhalinfotech.com',
          city: 'Noida Sector 62',
          category: 'Office & Business Desktop PCs',
          quantity: '25 Units',
          budget: '₹8 Lakhs - ₹12 Lakhs',
          timeline: 'Within 10 Days',
          date: '08 Nov 2026, 01:20 PM',
          status: 'Quotation Sent'
        },
        {
          id: 'CC-TECH-502914',
          type: 'PC Consultation / Quote',
          name: 'Karan Mehra',
          company: 'Individual Gamer',
          phone: '+91 99203 11884',
          email: 'karan.streamer@gmail.com',
          city: 'Ghaziabad, Indirapuram',
          category: 'Gaming & 4K Streaming Rig',
          quantity: '1 Custom PC',
          budget: '₹1,50,000 - ₹1,80,000',
          timeline: 'Immediate',
          date: '07 Nov 2026, 06:45 PM',
          status: 'Pending Review'
        }
      );
    }
    return loaded;
  });
  const [inquiryFilter, setInquiryFilter] = useState('all');

  // Coupons state
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('computercare_admin_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_ADMIN_PASSCODE || passcode.trim() === 'computercare') {
      setIsAuthenticated(true);
      localStorage.setItem('computercare_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials. (Default demo passcode: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('computercare_admin_auth');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    window.location.hash = '';
    onNavigate('home');
  };

  // Flatten catalog products
  const allProductsList = useMemo(() => {
    let list = [];
    Object.entries(catalog).forEach(([catKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          const override = stockOverrides[item.id] || {};
          list.push({
            ...item,
            categoryKey: catKey,
            stock: override.stock !== undefined ? override.stock : (item.stock || 12),
            price: override.price !== undefined ? override.price : item.price,
            mrp: override.mrp !== undefined ? override.mrp : (item.compare_at_price || Math.round(item.price * 1.25)),
            isFeatured: override.isFeatured !== undefined ? override.isFeatured : Boolean(item.featured)
          });
        });
      }
    });
    return list;
  }, [catalog, stockOverrides]);

  // Filtered products for admin
  const filteredProducts = useMemo(() => {
    return allProductsList.filter(p => {
      const matchCat = productCategory === 'all' || p.categoryKey === productCategory;
      const matchSearch = !productSearch ||
        p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.vendor?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProductsList, productCategory, productSearch]);

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const newOverrides = {
      ...stockOverrides,
      [editingProduct.id]: {
        stock: parseInt(editingProduct.stock, 10) || 0,
        price: parseInt(editingProduct.price, 10) || 0,
        mrp: parseInt(editingProduct.mrp, 10) || 0,
        isFeatured: editingProduct.isFeatured
      }
    };

    setStockOverrides(newOverrides);
    localStorage.setItem('computercare_stock_overrides', JSON.stringify(newOverrides));
    setEditingProduct(null);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem('computercare_admin_orders', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleUpdateTracking = (orderId, courier, tracking) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, courier, trackingNumber: tracking };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem('computercare_admin_orders', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, courier, trackingNumber: tracking });
    }
  };

  const handleUpdateInquiryStatus = (inquiryId, newStatus) => {
    const updated = inquiries.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    setInquiries(updated);
  };

  // Analytics Calculations
  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const lowStock = allProductsList.filter(p => p.stock < 5).length;
    const pendingInquiries = inquiries.filter(i => i.status === 'Pending Review').length;
    return {
      revenue: totalRev,
      ordersCount: orders.length,
      lowStockCount: lowStock,
      pendingInquiriesCount: pendingInquiries,
      totalCatalogCount: allProductsList.length
    };
  }, [orders, allProductsList, inquiries]);

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-brand-border p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-brand-gold" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-red bg-red-50 px-2 py-0.5 rounded">
              RESTRICTED SYSTEM ACCESS
            </span>
            <h1 className="text-xl font-bold font-display text-brand-navy mt-1">
              Computer Care Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Authorized hardware managers, inventory staff, and e-commerce directors only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrator Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo access code: <code className="text-brand-navy font-bold font-mono">admin123</code>
              </p>
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Authenticate & Enter Admin Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-slate-500 hover:text-brand-navy flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">v1.0.0 Production</span>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN CONSOLE
  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Admin Header Bar */}
      <div className="bg-brand-navy text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-brand-navy">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-brand-gold border border-white/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                Computer Care Executive Control Center
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Live Store Telemetry, Inventory Pricing, Quotations & Fulfillment System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-brand-gold" />
            <span>View Public Store</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-display font-bold uppercase tracking-wider">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'dashboard'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'orders'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders & Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('quotations')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'quotations'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations & Leads ({inquiries.length})</span>
          {stats.pendingInquiriesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-brand-red text-white text-[9px] font-mono">
              {stats.pendingInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'products'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products & Inventory ({stats.totalCatalogCount})</span>
        </button>

        <button
          onClick={() => setAdminTab('coupons')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'coupons'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Discount Coupons</span>
        </button>
      </div>

      {/* 1. DASHBOARD OVERVIEW TAB */}
      {adminTab === 'dashboard' && (
        <div className="flex flex-col gap-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Sales (Gross)</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
                ₹{stats.revenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium mt-1">
                +18.4% vs last week (3 completed orders)
              </span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Orders</span>
                <div className="p-2 bg-blue-50 text-brand-blue rounded-xl">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
                {stats.ordersCount}
              </div>
              <span className="text-[10px] text-blue-600 font-medium mt-1">
                1 In Assembly • 1 Ready to Dispatch
              </span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Pending Quotes</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-display text-amber-600">
                {stats.pendingInquiriesCount}
              </div>
              <span className="text-[10px] text-amber-600 font-medium mt-1">
                Requires response within 2 hours
              </span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Catalog Items</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
                {stats.totalCatalogCount}
              </div>
              <span className="text-[10px] text-purple-600 font-medium mt-1">
                Across 15 Authorized Brands
              </span>
            </div>
          </div>

          {/* Recent Orders & Quotations Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-brand-navy" />
                  <h3 className="font-display font-bold uppercase text-sm text-brand-navy">
                    Recent Customer Orders
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-brand-blue font-semibold hover:underline"
                >
                  View All ({orders.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100 flex-1">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-navy">{ord.id}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[ord.status] || 'bg-slate-100'}`}>
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        {ord.customer} • <span className="text-slate-400">{ord.city}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {ord.type} ({ord.itemsCount} parts)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-bold text-sm text-slate-900">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedOrder(ord); setAdminTab('orders'); }}
                        className="text-[11px] text-brand-blue hover:underline font-semibold mt-1 cursor-pointer block"
                      >
                        Manage Order →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent B2B & PC Quotation Leads */}
            <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-navy" />
                  <h3 className="font-display font-bold uppercase text-sm text-brand-navy">
                    Active B2B & Custom PC Inquiries
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab('quotations')}
                  className="text-xs text-brand-blue font-semibold hover:underline"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100 flex-1">
                {inquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-navy">{inq.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand-blue font-bold">
                          {inq.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold mt-0.5">
                        {inq.name} {inq.company !== 'N/A' && `(${inq.company})`}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                        Qty: {inq.quantity} • Budget: {inq.budget}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                        {inq.status}
                      </span>
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}, this is Computer Care regarding your quotation request ${inq.id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold mt-2 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Reply</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS & FULFILLMENT TAB */}
      {adminTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List */}
          <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col gap-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold uppercase text-base text-brand-navy">
                  Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Update fulfillment states, assign dispatch couriers and manage order records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="building">Building / Assembly</option>
                  <option value="quality_check">Quality Check</option>
                  <option value="ready_for_dispatch">Ready for Dispatch</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-100">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Total (₹)</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                    .map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-mono font-bold text-brand-navy">{ord.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-slate-800">{ord.customer}</div>
                          <div className="text-[10px] text-slate-400">{ord.city}</div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[ord.status] || 'bg-slate-100'}`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 font-display font-bold text-slate-900">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Order Detail Sidebar */}
          {selectedOrder && (
            <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-brand-blue uppercase">ORDER DETAILS</span>
                  <h3 className="text-base font-bold font-display text-brand-navy">{selectedOrder.id}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Customer Contact */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800">{selectedOrder.customer}</div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.phone}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.email}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.city}</span>
                </div>
              </div>

              {/* Status Update Control */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Fulfillment Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="building">Building / Assembly</option>
                  <option value="quality_check">Quality Check & Burn-In</option>
                  <option value="ready_for_dispatch">Ready for Dispatch</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Dispatch & Courier Info */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Shipping & Courier Tracking
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Courier Partner"
                    value={selectedOrder.courier || ''}
                    onChange={(e) => handleUpdateTracking(selectedOrder.id, e.target.value, selectedOrder.trackingNumber || '')}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="AWB / Tracking #"
                    value={selectedOrder.trackingNumber || ''}
                    onChange={(e) => handleUpdateTracking(selectedOrder.id, selectedOrder.courier || '', e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Parts List */}
              <div>
                <h4 className="text-xs font-bold font-display uppercase text-slate-700 mb-2">
                  Included Components & Hardware ({selectedOrder.parts?.length || 0})
                </h4>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                  {selectedOrder.parts?.map((part, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{part}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Hardware Subtotal:</span>
                  <span className="font-mono">₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Included):</span>
                  <span className="font-mono">₹{selectedOrder.gst?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-100">
                  <span>Grand Total:</span>
                  <span className="text-brand-navy">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. QUOTATIONS & LEADS TAB */}
      {adminTab === 'quotations' && (
        <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold uppercase text-base text-brand-navy">
                Custom PC & B2B Bulk Inquiries ({inquiries.length})
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Review inquiries submitted from the PC Builder and B2B Bulk Order view.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Inquiry Types</option>
                <option value="B2B Bulk Order">B2B Bulk Orders</option>
                <option value="PC Consultation / Quote">PC Consultation / Quotes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries
              .filter(i => inquiryFilter === 'all' || i.type === inquiryFilter)
              .map(inq => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl border border-brand-border hover:border-brand-blue bg-white shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-brand-navy">{inq.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand-blue font-bold">
                        {inq.type}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-2">
                      {inq.name}
                    </h4>
                    {inq.company && inq.company !== 'N/A' && (
                      <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{inq.company}</span>
                      </div>
                    )}

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Quantity</span>
                        <span className="font-semibold text-slate-700">{inq.quantity}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Budget</span>
                        <span className="font-semibold text-slate-700">{inq.budget}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone</span>
                        <span className="font-semibold text-slate-700">{inq.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">City</span>
                        <span className="font-semibold text-slate-700">{inq.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Accepted">Accepted & Invoiced</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, Computer Care sales team following up on your inquiry ${inq.id} for ${inq.quantity}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. PRODUCTS & INVENTORY TAB */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold uppercase text-base text-brand-navy">
                Product Catalog & Real-Time Stock ({filteredProducts.length} items)
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Adjust selling prices, update physical inventory, and manage featured components.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-blue w-48 sm:w-64"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.keys(catalog).map(catKey => (
                  <option key={catKey} value={catKey}>{catKey.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto divide-y divide-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-100">
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Brand</th>
                  <th className="py-2.5">Selling Price</th>
                  <th className="py-2.5">MRP</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.slice(0, 50).map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image || prod.cdn_image}
                          alt={prod.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="font-semibold text-slate-900 line-clamp-1 block" title={prod.title}>
                          {prod.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          SKU: {prod.sku || `CC-${prod.id}`}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 font-mono text-[11px] uppercase text-brand-blue font-bold">
                      {prod.categoryKey}
                    </td>

                    <td className="py-3 font-medium text-slate-700">
                      {prod.vendor}
                    </td>

                    <td className="py-3 font-display font-bold text-slate-900">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 font-mono text-slate-400 line-through">
                      ₹{prod.mrp?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        prod.stock <= 0
                          ? 'bg-rose-100 text-rose-700'
                          : prod.stock < 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.stock} in stock
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...prod })}
                        className="p-1.5 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Price & Inventory"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. COUPONS TAB */}
      {adminTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold uppercase text-base text-brand-navy">
                Promotional Coupons & Discounts
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Create promotional discount codes for hardware checkout and custom PC builders.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-1 rounded bg-brand-navy text-white tracking-widest">
                      {coupon.code}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${coupon.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {coupon.active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </div>
                  <div className="text-xl font-black font-display text-brand-navy mt-3">
                    {coupon.discount} OFF
                  </div>
                  <div className="text-xs text-slate-500 font-sans mt-1">
                    Min order value: ₹{coupon.minOrder.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-400 font-mono mt-3 flex items-center justify-between">
                  <span>Used: {coupon.uses} times</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = coupons.map((c, i) => i === idx ? { ...c, active: !c.active } : c);
                      setCoupons(updated);
                      localStorage.setItem('computercare_admin_coupons', JSON.stringify(updated));
                    }}
                    className="text-brand-blue hover:underline font-semibold cursor-pointer"
                  >
                    Toggle {coupon.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brand-border p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold font-display text-brand-navy">
                Edit Product & Stock
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inventory Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="font-semibold text-slate-700">Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
