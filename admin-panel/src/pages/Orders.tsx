import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle, 
  X,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  // Drawer Details
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get<any[]>(`/admin/orders?status=${statusFilter}&search=${encodeURIComponent(search)}&limit=50`);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(delay);
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLACED':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">Placed</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full">Confirmed</span>;
      case 'SHIPPED':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-1 rounded-full">Shipped</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-full">Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">Delivered</span>;
      case 'CANCELLED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Order Fulfillment Center</h2>
          <p className="text-xs text-slate-500">Track and advance shipments from warehouse to doorsteps</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, tracking #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Order ID & Date</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Status Stage</th>
                <th className="py-3.5 px-6">Advance Lifecycle</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">No orders matching the criteria.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-mono font-bold text-slate-900">{ord.id}</p>
                      <span className="text-[11px] text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</span>
                    </td>

                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-slate-800">{ord.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{ord.city}, {ord.state}</p>
                    </td>

                    <td className="py-3.5 px-6 font-black text-slate-900">
                      ₹{ord.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="text-xs font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {ord.payment_method}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      {getStatusBadge(ord.status)}
                    </td>

                    <td className="py-3.5 px-6">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="PLACED">Placed</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled (Restores Stock)</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end z-50">
          <div className="bg-white h-full max-w-lg w-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedOrder.id}</h3>
                  <p className="text-xs text-slate-400">Tracking: {selectedOrder.tracking_number}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Current Status</span>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Payment</span>
                  <p className="text-xs font-black text-slate-800">{selectedOrder.payment_method} ({selectedOrder.payment_status})</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="my-4 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Delivery Address</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="font-bold text-slate-800">{selectedOrder.address_name}</p>
                  <p className="text-slate-600">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                  <p className="text-slate-500 mt-1">Customer: {selectedOrder.customer_name} ({selectedOrder.customer_email})</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="my-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ordered Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.map((it: any) => (
                    <div key={it.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                      <img src={it.product_image} alt="" className="w-10 h-10 object-cover rounded-lg bg-white border" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{it.product_name}</p>
                        <span className="text-slate-400">Qty: {it.quantity} &times; ₹{it.unit_price}</span>
                      </div>
                      <div className="font-black text-slate-900">₹{it.total_price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="my-4 p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied</span>
                    <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Delivery Charge</span>
                  <span>{selectedOrder.delivery_fee === 0 ? 'FREE' : `₹${selectedOrder.delivery_fee}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-yellow-400">
                  <span>Total Amount Paid</span>
                  <span>₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
