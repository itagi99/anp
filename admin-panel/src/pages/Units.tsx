import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Ruler, Plus, Trash2, X } from 'lucide-react';

export const Units: React.FC = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', symbol: '' });

  const fetchData = async () => {
    try {
      const res = await api.get<any>('/admin-features/units');
      setUnits(res.units || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin-features/units', { ...form });
      setShowModal(false);
      setForm({ name: '', symbol: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this unit?')) return;
    try {
      await api.delete(`/admin-features/units/${id}`);
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
            <Ruler className="w-6 h-6 text-blue-600" />
            Measurement Units
          </h2>
          <p className="text-xs text-slate-500">Define product measurement units (kg, pcs, litre, etc.)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Unit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {units.map((u) => (
          <div key={u.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
            <button
              onClick={() => handleDelete(u.id)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="font-bold text-lg text-slate-900">{u.name}</div>
            <div className="text-sm font-mono text-blue-600 mt-1">{u.symbol}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Add Unit</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kilogram"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Symbol</label>
                <input
                  type="text"
                  required
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  placeholder="kg"
                  className="w-full p-2 border rounded-xl font-mono"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">
                Save Unit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
