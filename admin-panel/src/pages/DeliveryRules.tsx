import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Truck, Plus, Trash2, X } from 'lucide-react';

export const DeliveryRules: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    min_order_value: '0',
    max_order_value: '',
    delivery_charge: '0',
    priority: '10',
    is_active: 1,
  });

  const fetchData = async () => {
    try {
      const res = await api.get<any>('/admin-features/delivery-rules');
      setRules(res.rules || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', min_order_value: '0', max_order_value: '', delivery_charge: '0', priority: '10', is_active: 1 });
    setShowModal(true);
  };

  const openEdit = (r: any) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      min_order_value: String(r.min_order_value),
      max_order_value: r.max_order_value != null ? String(r.max_order_value) : '',
      delivery_charge: String(r.delivery_charge),
      priority: String(r.priority),
      is_active: r.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        min_order_value: parseFloat(form.min_order_value) || 0,
        max_order_value: form.max_order_value ? parseFloat(form.max_order_value) : null,
        delivery_charge: parseFloat(form.delivery_charge) || 0,
        priority: parseInt(form.priority) || 10,
        is_active: form.is_active,
      };
      if (editingId) {
        await api.put(`/admin-features/delivery-rules/${editingId}`, payload);
      } else {
        await api.post('/admin-features/delivery-rules', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this delivery rule?')) return;
    try {
      await api.delete(`/admin-features/delivery-rules/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Delivery Charge Rules
          </h2>
          <p className="text-xs text-slate-500">Configure order-value based delivery charges</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Rule Name</th>
              <th className="py-3.5 px-6">Min Order</th>
              <th className="py-3.5 px-6">Max Order</th>
              <th className="py-3.5 px-6">Charge</th>
              <th className="py-3.5 px-6">Priority</th>
              <th className="py-3.5 px-6">Active</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-6 font-bold text-slate-800">{r.name}</td>
                <td className="py-3.5 px-6">₹{r.min_order_value}</td>
                <td className="py-3.5 px-6">{r.max_order_value != null ? `₹${r.max_order_value}` : '∞'}</td>
                <td className="py-3.5 px-6 font-extrabold text-slate-900">₹{r.delivery_charge}</td>
                <td className="py-3.5 px-6">{r.priority}</td>
                <td className="py-3.5 px-6">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {r.is_active ? 'ON' : 'OFF'}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(r)} className="p-1.5 text-slate-500 hover:text-blue-600 rounded">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">{editingId ? 'Edit Rule' : 'Add Rule'}</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.min_order_value}
                    onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Max Order (₹)</label>
                  <input
                    type="number"
                    value={form.max_order_value}
                    onChange={(e) => setForm({ ...form, max_order_value: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.delivery_charge}
                    onChange={(e) => setForm({ ...form, delivery_charge: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Priority</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">Active</label>
                <select
                  value={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-xl"
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">
                Save Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
