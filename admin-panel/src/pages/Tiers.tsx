import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Layers, Plus, Trash2, X } from 'lucide-react';

export const Tiers: React.FC = () => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_id: '',
    min_quantity: '1',
    discount_type: 'PERCENTAGE',
    discount_value: '5',
  });

  const fetchData = async () => {
    try {
      const [t, p] = await Promise.all([
        api.get<any>('/admin-features/tiers'),
        api.get<any>('/store/products'),
      ]);
      setTiers(t.tiers || []);
      setProducts(p.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ product_id: products[0]?.id || '', min_quantity: '1', discount_type: 'PERCENTAGE', discount_value: '5' });
    setShowModal(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      product_id: t.product_id,
      min_quantity: String(t.min_quantity),
      discount_type: t.discount_type,
      discount_value: String(t.discount_value),
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: form.product_id,
        min_quantity: parseInt(form.min_quantity),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
      };
      if (editingId) {
        await api.put(`/admin-features/tiers/${editingId}`, payload);
      } else {
        await api.post('/admin-features/tiers', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tier?')) return;
    try {
      await api.delete(`/admin-features/tiers/${id}`);
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
            <Layers className="w-6 h-6 text-blue-600" />
            Tier Pricing
          </h2>
          <p className="text-xs text-slate-500">Bulk quantity discounts per product</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tier</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">Min Quantity</th>
              <th className="py-3.5 px-6">Discount Type</th>
              <th className="py-3.5 px-6">Value</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tiers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-6 font-bold text-slate-800">{t.product_name || t.product_id}</td>
                <td className="py-3.5 px-6 font-semibold text-slate-700">{t.min_quantity}</td>
                <td className="py-3.5 px-6">{t.discount_type}</td>
                <td className="py-3.5 px-6 font-extrabold text-slate-900">
                  {t.discount_value}{t.discount_type === 'PERCENTAGE' ? '%' : ' ₹'}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 text-slate-500 hover:text-blue-600 rounded">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded">
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
              <h4 className="font-bold">{editingId ? 'Edit Tier' : 'Add Tier'}</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Product</label>
                <select
                  required
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold">Min Quantity</label>
                <input
                  type="number"
                  required
                  value={form.min_quantity}
                  onChange={(e) => setForm({ ...form, min_quantity: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Value</label>
                  <input
                    type="number"
                    required
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">
                Save Tier
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
