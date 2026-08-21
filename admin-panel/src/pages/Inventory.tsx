import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useSocket } from '../context/SocketContext';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowUpDown, 
  History, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  Search, 
  X,
  Warehouse
} from 'lucide-react';

export const Inventory: React.FC = () => {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'matrix' | 'logs'>('matrix');
  
  // Filters
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');

  // Adjust Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('RESTOCK');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Socket
  const { latestStockUpdate } = useSocket();

  const fetchInventory = async () => {
    try {
      const data = await api.get<any[]>(`/inventory?warehouse_id=${selectedWarehouse}&low_stock_only=${lowStockOnly}&search=${encodeURIComponent(search)}`);
      setInventoryList(data);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await api.get<any[]>('/inventory/logs?limit=50');
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await api.get<any[]>('/admin/warehouses');
      setWarehouses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchInventory();
    if (activeView === 'logs') fetchLogs();
  }, [selectedWarehouse, lowStockOnly, search, activeView]);

  // Real-time stock change reaction
  useEffect(() => {
    if (latestStockUpdate) {
      setInventoryList((prev) =>
        prev.map((item) => {
          if (item.product_id === latestStockUpdate.productId) {
            return {
              ...item,
              stock_qty: latestStockUpdate.stockQty,
              is_low_stock: latestStockUpdate.stockQty <= item.low_stock_threshold,
              _justUpdated: true,
            };
          }
          return item;
        })
      );
    }
  }, [latestStockUpdate]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !adjustQty) return;

    try {
      await api.post('/inventory/adjust', {
        product_id: selectedItem.product_id,
        warehouse_id: selectedItem.warehouse_id,
        change_qty: parseInt(adjustQty),
        reason: adjustReason,
        notes: adjustNotes,
      });

      setShowAdjustModal(false);
      setAdjustQty('');
      setAdjustNotes('');
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Real-Time Inventory Matrix</h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500">Atomic warehouse reservations and instant stock propagation</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveView('matrix')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeView === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Stock Grid</span>
          </button>
          <button
            onClick={() => setActiveView('logs')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeView === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail Logs</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search product or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Fulfillment Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 cursor-pointer">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded text-rose-600"
            />
            <span className="text-rose-700">Low Stock Threshold Only</span>
          </label>

          <button
            onClick={fetchInventory}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeView === 'matrix' ? (
        /* Inventory Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Warehouse Facility</th>
                  <th className="py-3.5 px-6">Available Stock</th>
                  <th className="py-3.5 px-6">Reserved / Hold</th>
                  <th className="py-3.5 px-6">Low Stock Level</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">Loading live inventory...</td>
                  </tr>
                ) : inventoryList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">No inventory entries found.</td>
                  </tr>
                ) : (
                  inventoryList.map((item) => (
                    <tr 
                      key={`${item.product_id}-${item.warehouse_id}`}
                      className={`hover:bg-slate-50/70 transition-colors ${item._justUpdated ? 'animate-stock-flash' : ''}`}
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_urls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{item.product_name}</p>
                            <span className="text-[11px] text-slate-400">{item.product_brand}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.warehouse_name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{item.warehouse_city} ({item.warehouse_code})</span>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="text-base font-black text-slate-900">{item.stock_qty} units</div>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="text-xs font-medium text-slate-500">{item.reserved_qty} units</span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="text-xs font-semibold text-slate-600">&le; {item.low_stock_threshold} units</span>
                      </td>

                      <td className="py-3.5 px-6">
                        {item.stock_qty <= item.low_stock_threshold ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Low Stock Alert</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setAdjustQty('10');
                            setShowAdjustModal(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          <span>Adjust Stock</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Audit Logs Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">Immutable Inventory Audit Trail</h4>
            <span className="text-xs text-slate-400">All order reservations, manual restocks, and returns</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Warehouse</th>
                  <th className="py-3.5 px-6">Qty Change</th>
                  <th className="py-3.5 px-6">Before &rarr; After</th>
                  <th className="py-3.5 px-6">Reason Code</th>
                  <th className="py-3.5 px-6">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">No audit log records available.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-6 text-xs text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{log.product_name}</td>
                      <td className="py-3.5 px-6 text-xs text-slate-600">{log.warehouse_name || 'All Warehouses'}</td>
                      <td className="py-3.5 px-6">
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${
                          log.change_qty > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.change_qty > 0 ? `+${log.change_qty}` : log.change_qty}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                        {log.previous_qty} &rarr; <span className="font-bold text-slate-900">{log.new_qty}</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {log.reason}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500 max-w-xs truncate">{log.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Adjust Inventory Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">{selectedItem.product_name}</p>
                <p className="text-slate-500">Warehouse: <span className="font-semibold text-slate-700">{selectedItem.warehouse_name}</span></p>
                <p className="text-slate-500">Current Stock: <span className="font-black text-blue-600">{selectedItem.stock_qty} units</span></p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Stock Quantity Adjustment (+ or -) *</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 25 or -5"
                />
                <p className="text-[11px] text-slate-400">Use positive numbers for restock, negative numbers for damage write-off.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Audit Reason *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RESTOCK">RESTOCK (Supplier Intake)</option>
                  <option value="MANUAL_ADJUST">MANUAL_ADJUST (Admin Correction)</option>
                  <option value="DAMAGE">DAMAGE (Damaged in Warehouse)</option>
                  <option value="AUDIT">AUDIT (Physical Count Reconciliation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Notes / PO Reference</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. PO-8941 from Foxconn supplier"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
