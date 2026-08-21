import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { TicketPercent, Plus, Trash2, X } from 'lucide-react';

export const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    discount_pct: '10',
    min_order_value: '0',
    max_discount_amount: '0',
    expiry_date: '',
    usage_limit: '1000',
    is_active: 1,
    scope: 'sitewide',
    category_id: '',
    product_id: '',
  });

  const fetchData = async () => {
    try {
      const [c, p, cat] = await Promise.all([
        api.get<any>('/admin-features/coupons'),
        api.get<any>('/store/products'),
        api.get<any>('/store/categories'),
      ]);
      setCoupons(c.coupons || []);
      setProducts(p.products || []);
      setCategories(cat.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      code: '', discount_pct: '10', min_order_value: '0', max_discount_amount: '0',
      expiry_date: '', usage_limit: '1000', is_active: 1, scope: 'sitewide', category_id: '', product_id: '',
    });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      discount_pct: String(c.discount_pct),
      min_order_value: String(c.min_order_value),
      max_discount_amount: String(c.max_discount_amount),
      expiry_date: c.expiry_date ? c.expiry_date.slice(0, 10) : '',
      usage_limit: String(c.usage_limit),
      is_active: c.is_active,
      scope: c.scope,
      category_id: c.category_id || '',
      product_id: c.product_id || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        code: form.code,
        discount_pct: parseFloat(form.discount_pct),
        min_order_value: parseFloat(form.min_order_value) || 0,
        max_discount_amount: parseFloat(form.max_discount_amount) || 0,
        expiry_date: form.expiry_date,
        usage_limit: parseInt(form.usage_limit) || 1000,
        is_active: form.is_active,
        scope: form.scope,
        category_id: form.scope === 'category' ? form.category_id || null : null,
        product_id: form.scope === 'item' ? form.product_id || null : null,
      };
      if (editingId) {
        await api.put(`/admin-features/coupons/${editingId}`, payload);
      } else {
        await api.post('/admin-features/coupons', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/admin-features/coupons/${id}`);
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
            <TicketPercent className="w-6 h-6 text-indigo-600" />
            Coupons (4-Scope)
          </h2>
          <p className="text-xs text-slate-500">Sitewide, category, item and grand-total coupons</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-dashed border-indigo-300 shadow-sm relative group">
            <button onClick={() => handleDelete(c.id)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-600">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="font-mono font-black text-lg text-indigo-600">{c.code}</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{c.discount_pct}% OFF</div>
            <p className="text-xs text-slate-500 mt-2">Scope: {c.scope}</p>
            {c.scope === 'category' && <p className="text-xs text-slate-500">Category: {c.category_name}</p>}
            {c.scope === 'item' && <p className="text-xs text-slate-500">Item: {c.product_name}</p>}
            <p className="text-xs text-slate-500">Used: {c.times_used}/{c.usage_limit}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 border rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Discount (%)</label>
                  <input
                    type="number"
                    required
                    value={form.discount_pct}
                    onChange={(e) => setForm({ ...form, discount_pct: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Scope</label>
                  <select
                    value={form.scope}
                    onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="sitewide">Sitewide</option>
                    <option value="category">Category</option>
                    <option value="item">Item</option>
                    <option value="grand_total">Grand Total</option>
                  </select>
                </div>
              </div>
              {form.scope === 'category' && (
                <div>
                  <label className="font-bold">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {form.scope === 'item' && (
                <div>
                  <label className="font-bold">Product</label>
                  <select
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
                  <label className="font-bold">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.max_discount_amount}
                    onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Expiry</label>
                  <input
                    type="date"
                    required
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usage_limit}
                    onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
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
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl mt-4">
                Save Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
