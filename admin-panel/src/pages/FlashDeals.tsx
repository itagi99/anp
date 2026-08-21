import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Zap, Plus, Trash2, X } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_id: '',
    flash_price: '',
    flash_start: '',
    flash_end: '',
    status: 1,
  });

  const fetchData = async () => {
    try {
      const [d, p] = await Promise.all([
        api.get<any>('/admin-features/flash-deals'),
        api.get<any>('/store/products'),
      ]);
      setDeals(d.flash_deals || []);
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
    setForm({ product_id: products[0]?.id || '', flash_price: '', flash_start: '', flash_end: '', status: 1 });
    setShowModal(true);
  };

  const openEdit = (f: any) => {
    setEditingId(f.id);
    setForm({
      product_id: f.product_id,
      flash_price: String(f.flash_price),
      flash_start: f.flash_start ? f.flash_start.slice(0, 16) : '',
      flash_end: f.flash_end ? f.flash_end.slice(0, 16) : '',
      status: f.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: form.product_id,
        flash_price: parseFloat(form.flash_price),
        flash_start: form.flash_start,
        flash_end: form.flash_end,
        status: form.status,
      };
      if (editingId) {
        await api.put(`/admin-features/flash-deals/${editingId}`, payload);
      } else {
        await api.post('/admin-features/flash-deals', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this flash deal?')) return;
    try {
      await api.delete(`/admin-features/flash-deals/${id}`);
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
            <Zap className="w-6 h-6 text-amber-500" />
            Flash Deals
          </h2>
          <p className="text-xs text-slate-500">Time-bound discounted offers on products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Flash Deal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
            <button onClick={() => handleDelete(f.id)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-600">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="font-bold text-slate-900">{f.product_name || f.product_id}</div>
            <div className="text-2xl font-black text-amber-600 mt-1">₹{f.flash_price}</div>
            <p className="text-xs text-slate-500 mt-2">
              {f.flash_start} → {f.flash_end}
            </p>
            <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${f.status ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {f.status ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">{editingId ? 'Edit Flash Deal' : 'Add Flash Deal'}</h4>
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
                <label className="font-bold">Flash Price (₹)</label>
                <input
                  type="number"
                  required
                  value={form.flash_price}
                  onChange={(e) => setForm({ ...form, flash_price: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Start</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.flash_start}
                    onChange={(e) => setForm({ ...form, flash_start: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">End</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.flash_end}
                    onChange={(e) => setForm({ ...form, flash_end: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-xl"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-amber-500 text-white font-bold rounded-xl mt-4">
                Save Flash Deal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
