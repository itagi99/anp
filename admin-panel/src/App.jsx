import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  FolderTree,
  Users,
  Tag,
  Image as ImageIcon,
  Settings,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  LogOut,
  Shield,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('shopkart_admin_token') || 'demo_token');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [socket, setSocket] = useState(null);
  const [liveInventoryLogs, setLiveInventoryLogs] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  
  // Real-time stock adjustment modal state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('MANUAL_ADJUSTMENT');

  // Sample Mock / Real Data States
  const [inventoryList, setInventoryList] = useState([
    { id: 'p-01', name: 'Apple iPhone 15 Pro Max', brand: 'Apple', warehouse: 'Mumbai Central', stock: 2, threshold: 5, price: 134900 },
    { id: 'p-02', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', warehouse: 'Bengaluru Tech Hub', stock: 15, threshold: 5, price: 129999 },
    { id: 'p-06', name: 'MacBook Pro 16" M3 Max', brand: 'Apple', warehouse: 'Mumbai Central', stock: 1, threshold: 3, price: 299900 },
    { id: 'p-11', name: 'Sony WH-1000XM5', brand: 'Sony', warehouse: 'Delhi NCR Hub', stock: 2, threshold: 5, price: 24990 },
    { id: 'p-16', name: 'Apple Watch Series 9', brand: 'Apple', warehouse: 'Bengaluru Tech Hub', stock: 18, threshold: 5, price: 44900 },
    { id: 'p-26', name: 'Smart Air Purifier 4 Pro', brand: 'Xiaomi', warehouse: 'Mumbai Central', stock: 1, threshold: 5, price: 14999 }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ord-1001', customer: 'Praveen Kumar', total: 19992, status: 'DELIVERED', date: 'Today, 10:14 AM', items: 'Sony WH-1000XM5 (x1)' },
    { id: 'ord-1002', customer: 'Ananya Sharma', total: 41900, status: 'SHIPPED', date: 'Today, 08:30 AM', items: 'Apple Watch Series 9 (x1)' },
    { id: 'ord-1003', customer: 'Rahul Verma', total: 12000, status: 'CONFIRMED', date: 'Yesterday', items: 'Smart Air Purifier (x1)' },
    { id: 'ord-1004', customer: 'Vikram Singh', total: 134900, status: 'PLACED', date: 'Yesterday', items: 'iPhone 15 Pro Max (x1)' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Setup WebSocket connection to Server
  useEffect(() => {
    try {
      const s = io(API_BASE, { transports: ['websocket', 'polling'] });
      s.emit('join:admin');

      s.on('inventory:update', (data) => {
        setLiveInventoryLogs((prev) => [data, ...prev.slice(0, 19)]);
        setInventoryList((prev) =>
          prev.map((item) =>
            item.id === data.productId ? { ...item, stock: data.newQty } : item
          )
        );
      });

      s.on('inventory:low-stock', (alert) => {
        setLowStockAlerts((prev) => [alert, ...prev.slice(0, 9)]);
      });

      setSocket(s);
      return () => s.disconnect();
    } catch (e) {
      console.log('Socket fallback mode');
    }
  }, []);

  const chartData = [
    { day: 'Mon', sales: 420000 },
    { day: 'Tue', sales: 680000 },
    { day: 'Wed', sales: 510000 },
    { day: 'Thu', sales: 890000 },
    { day: 'Fri', sales: 1240000 },
    { day: 'Sat', sales: 1850000 },
    { day: 'Sun', sales: 2100000 },
  ];

  const handleStockAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustTarget) return;

    const newQty = Math.max(0, adjustTarget.stock + Number(adjustQty));
    setInventoryList((prev) =>
      prev.map((item) => (item.id === adjustTarget.id ? { ...item, stock: newQty } : item))
    );

    const logEntry = {
      productId: adjustTarget.id,
      newQty,
      reason: adjustReason,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLiveInventoryLogs((prev) => [logEntry, ...prev]);

    if (socket) {
      socket.emit('inventory:manual_adjust', logEntry);
    }

    setShowAdjustModal(false);
    setAdjustTarget(null);
    setAdjustQty(0);
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar (Flipkart Seller Hub Dark Blueprint) */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30">
                ⚡
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight">ShopKart</h1>
                <span className="text-[10px] font-semibold tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full uppercase border border-blue-800">
                  Seller Hub Live
                </span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventory', label: 'Real-Time Inventory', icon: Boxes, badge: 'Live' },
              { id: 'products', label: 'Product Catalog', icon: Package },
              { id: 'orders', label: 'Order Fulfillment', icon: ShoppingCart, count: orders.length },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'users', label: 'Customers', icon: Users },
              { id: 'coupons', label: 'Coupons & Banners', icon: Tag },
              { id: 'settings', label: 'Warehouses & Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  {item.count && (
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Status Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">admin@shopkart.com</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Turso Edge Connected
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/40 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-white capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edge Sync: <strong>3 Warehouses Active</strong></span>
            </div>
          </div>
        </header>

        {/* Dynamic Screen Panels */}
        <div className="p-8 space-y-8 flex-1">
          {/* ===================================================================
              DASHBOARD TAB
             =================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Total Revenue (7D)', value: '₹68,90,000', change: '+24.5%', trend: 'up', icon: TrendingUp },
                  { title: 'Orders Today', value: '142', change: '+18.2%', trend: 'up', icon: ShoppingCart },
                  { title: 'Low Stock SKUs', value: '4 SKUs', change: 'Action required', trend: 'down', alert: true, icon: AlertTriangle },
                  { title: 'Active Warehouses', value: '3 Hubs', change: '100% Online', trend: 'up', icon: Boxes },
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition-all ${
                      kpi.alert
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className={`w-4 h-4 ${kpi.alert ? 'text-rose-400' : 'text-blue-400'}`} />
                    </div>
                    <p className="text-2xl font-black text-white mt-2">{kpi.value}</p>
                    <span className={`text-xs mt-1 inline-block font-medium ${kpi.alert ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart & Live Stream Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Line Chart */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-white text-base">Weekly Revenue Velocity</h3>
                      <p className="text-xs text-slate-400">Live order fulfillment earnings across categories</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v / 100000}L`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                          formatter={(v) => [`₹${v.toLocaleString()}`, 'Sales']}
                        />
                        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Real-Time Inventory Socket Feed */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h3 className="font-bold text-white text-base">Live Inventory Feed</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                      WebSocket
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-64">
                    {liveInventoryLogs.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Listening for live stock transactions...
                      </div>
                    ) : (
                      liveInventoryLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-200">{log.productId}</p>
                            <p className="text-[10px] text-slate-400">{log.reason || 'ORDER_PLACED'}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-blue-400">{log.newQty} Left</span>
                            <p className="text-[9px] text-slate-500">{log.timestamp || 'Just now'}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              REAL-TIME INVENTORY GRID TAB
             =================================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Warehouse</th>
                      <th className="py-4 px-6">Current Stock</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inventoryList
                      .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.warehouse.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => {
                        const isLowStock = item.stock <= item.threshold;
                        return (
                          <tr key={item.id} className="hover:bg-slate-900/40 transition">
                            <td className="py-4 px-6 font-semibold text-white">
                              <div>{item.name}</div>
                              <span className="text-xs text-slate-500 font-normal">{item.brand} • ₹{item.price.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-400">{item.warehouse}</td>
                            <td className="py-4 px-6 font-mono font-bold text-base text-white">
                              {item.stock} units
                            </td>
                            <td className="py-4 px-6">
                              {isLowStock ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-800">
                                  <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                                  <CheckCircle className="w-3 h-3" /> Healthy
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => {
                                  setAdjustTarget(item);
                                  setShowAdjustModal(true);
                                }}
                                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-bold transition border border-blue-500/30"
                              >
                                Adjust Stock
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              ORDER FULFILLMENT TAB
             =================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Items Summary</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status Pipeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/40">
                        <td className="py-4 px-6 font-mono font-bold text-blue-400">{ord.id}</td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-white">{ord.customer}</p>
                          <span className="text-xs text-slate-500">{ord.date}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{ord.items}</td>
                        <td className="py-4 px-6 font-bold text-white">₹{ord.total.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PRODUCT CATALOG TAB
             =================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400">Manage 40 Live Catalog Products with JSON attributes</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {inventoryList.map((p) => (
                  <div key={p.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                        {p.brand}
                      </span>
                      <span className="text-sm font-black text-white">₹{p.price.toLocaleString()}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{p.name}</h4>
                    <p className="text-xs text-slate-400">Warehouse: {p.warehouse} (Stock: {p.stock})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              CATEGORIES, USERS & SETTINGS
             =================================================================== */}
          {(activeTab === 'categories' || activeTab === 'users' || activeTab === 'coupons' || activeTab === 'settings') && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white capitalize">{activeTab} Management Live</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Connected to Turso edge database. Active rules and configuration parameters synchronizing in real time.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && adjustTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white">Manual Stock Adjustment</h3>
              <p className="text-xs text-slate-400 mt-1">{adjustTarget.name} ({adjustTarget.warehouse})</p>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Adjustment Quantity (+/-)</label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  placeholder="e.g. 10 or -2"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for Audit Log</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200"
                >
                  <option value="RESTOCK">RESTOCK (Warehouse Intake)</option>
                  <option value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT (Audit correction)</option>
                  <option value="DAMAGED_GOODS">DAMAGED_GOODS (Write-off)</option>
                  <option value="RETURN_RESTOCK">RETURN_RESTOCK (Returned item restock)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 transition"
                >
                  Apply & Emit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
