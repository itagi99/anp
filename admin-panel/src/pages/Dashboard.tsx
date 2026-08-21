import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useSocket } from '../context/SocketContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  PackageCheck, 
  AlertOctagon, 
  Users, 
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { latestStockUpdate } = useSocket();
  const [recentLiveUpdates, setRecentLiveUpdates] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Listen to socket live stock updates
  useEffect(() => {
    if (latestStockUpdate) {
      setRecentLiveUpdates(prev => [latestStockUpdate, ...prev.slice(0, 9)]);
      // Refresh KPI counts
      fetchStats();
    }
  }, [latestStockUpdate]);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Connecting to Turso Analytics...</p>
        </div>
      </div>
    );
  }

  const { kpis, revenueChart, topProducts } = stats;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Gross Sales</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">₹{(kpis.totalSales || 0).toLocaleString()}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Orders Processed</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{kpis.totalOrders}</h3>
            <p className="text-xs font-medium text-slate-500 mt-2">
              <span className="text-slate-800 font-bold">{kpis.ordersToday}</span> new orders today
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Catalogue</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{kpis.activeProducts} Items</h3>
            <p className="text-xs font-medium text-slate-500 mt-2">Across 3 regional hubs</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Low Stock Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">{kpis.lowStockCount} Products</h3>
            <p className="text-xs font-medium text-rose-500 mt-2">Requires immediate restock</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Line / Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-800">Sales & Revenue Trend</h4>
              <p className="text-xs text-slate-500">Daily fulfillment value (Last 14 days)</p>
            </div>
            <span className="text-xs bg-slate-100 font-semibold text-slate-600 px-3 py-1 rounded-full">
              Turso Edge Queries
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart && revenueChart.length > 0 ? revenueChart : [{ date: 'Today', revenue: 70999 }]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2874F0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2874F0" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2874F0" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Real-Time Inventory Event Feed (Socket.io) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
              <h4 className="text-base font-bold text-slate-800">Live Inventory Stream</h4>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
              Websocket
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Real-time stock decrement and restock events</p>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[250px] pr-1">
            {recentLiveUpdates.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <PackageCheck className="w-8 h-8 mb-2 stroke-1 text-slate-300" />
                <p className="text-xs">Waiting for stock mutations...</p>
                <span className="text-[11px] text-slate-400 mt-1">Orders placed on mobile app will trigger live events here</span>
              </div>
            ) : (
              recentLiveUpdates.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 animate-stock-flash">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800 truncate max-w-[120px]">{ev.productId}</span>
                    <span className="text-[10px] text-slate-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-slate-500 font-medium">{ev.reason}</span>
                    <span className="font-extrabold text-blue-600">Stock: {ev.stockQty}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800">Top Selling Products</h4>
            <p className="text-xs text-slate-500">Highest volume items fulfilled across all hubs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Product ID</th>
                <th className="py-3.5 px-6">Units Sold</th>
                <th className="py-3.5 px-6">Gross Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts && topProducts.length > 0 ? (
                topProducts.map((p: any) => (
                  <tr key={p.product_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={p.product_image} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                      <span className="font-semibold text-slate-800 truncate max-w-xs">{p.product_name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{p.product_id}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{p.units_sold}</td>
                    <td className="py-4 px-6 font-bold text-emerald-600">₹{(p.gross_revenue || 0).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">No sales transactions logged yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
