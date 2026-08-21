import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { UserCog, Plus, Trash2, X, MapPin, Target } from 'lucide-react';

export const Salesmen: React.FC = () => {
  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [beats, setBeats] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee_id: '', name: '', email: '', phone: '', password: '' });

  const [showBeatModal, setShowBeatModal] = useState(false);
  const [beatForm, setBeatForm] = useState({ beat_name: '', area: '', day_of_week: 'Monday', is_active: 1 });

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetForm, setTargetForm] = useState({ target_month: '1', target_year: '2025', target_amount: '', target_orders: '0' });

  const fetchSalesmen = async () => {
    try {
      const res = await api.get<any>('/admin-features/salesmen');
      setSalesmen(res.salesmen || []);
      if (!selected && (res.salesmen || []).length) {
        selectSalesman(res.salesmen[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const selectSalesman = (id: string) => {
    setSelected(id);
    loadBeats(id);
    loadTargets(id);
  };

  const loadBeats = async (id: string) => {
    try {
      const res = await api.get<any>(`/admin-features/salesmen/${id}/beats`);
      setBeats(res.beats || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTargets = async (id: string) => {
    try {
      const res = await api.get<any>(`/admin-features/salesmen/${id}/targets`);
      setTargets(res.targets || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin-features/salesmen', { ...form });
      setShowModal(false);
      setForm({ employee_id: '', name: '', email: '', phone: '', password: '' });
      fetchSalesmen();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this salesman?')) return;
    try {
      await api.delete(`/admin-features/salesmen/${id}`);
      if (selected === id) setSelected(null);
      fetchSalesmen();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.post('/admin-features/beats', {
        salesman_id: selected,
        beat_name: beatForm.beat_name,
        area: beatForm.area,
        day_of_week: beatForm.day_of_week,
        is_active: beatForm.is_active,
      });
      setShowBeatModal(false);
      setBeatForm({ beat_name: '', area: '', day_of_week: 'Monday', is_active: 1 });
      loadBeats(selected);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBeat = async (id: string) => {
    if (!window.confirm('Delete this beat?')) return;
    try {
      await api.delete(`/admin-features/beats/${id}`);
      if (selected) loadBeats(selected);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.post('/admin-features/targets', {
        salesman_id: selected,
        target_month: parseInt(targetForm.target_month),
        target_year: parseInt(targetForm.target_year),
        target_amount: parseFloat(targetForm.target_amount),
        target_orders: parseInt(targetForm.target_orders) || 0,
      });
      setShowTargetModal(false);
      setTargetForm({ target_month: '1', target_year: '2025', target_amount: '', target_orders: '0' });
      loadTargets(selected);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-600" />
            Salesman Management
          </h2>
          <p className="text-xs text-slate-500">Field sales accounts, beats and targets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Salesman</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Salesman list */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase text-slate-500 border-b">Salesmen</div>
          <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
            {salesmen.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSalesman(s.id)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between ${selected === s.id ? 'bg-blue-50' : ''}`}
              >
                <div>
                  <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{s.employee_id}</div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {s.is_active ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3 space-y-6">
          {selected ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-bold">Total Orders</p>
                  <p className="text-2xl font-black text-slate-900">{salesmen.find((s) => s.id === selected)?.total_orders || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-bold">Total Sales</p>
                  <p className="text-2xl font-black text-emerald-600">₹{salesmen.find((s) => s.id === selected)?.total_sales || 0}</p>
                </div>
              </div>

              {/* Beats */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" /> Beats
                  </h4>
                  <button
                    onClick={() => setShowBeatModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Beat
                  </button>
                </div>
                <div className="space-y-2">
                  {beats.map((b) => (
                    <div key={b.id} className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2">
                      <div>
                        <span className="font-semibold text-slate-800">{b.beat_name}</span>
                        <span className="text-xs text-slate-500 ml-2">{b.area} · {b.day_of_week}</span>
                        <span className="text-xs text-slate-400 ml-2">({b.customer_count} customers)</span>
                      </div>
                      <button onClick={() => handleDeleteBeat(b.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {!beats.length && <p className="text-xs text-slate-400">No beats assigned.</p>}
                </div>
              </div>

              {/* Targets */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" /> Targets
                  </h4>
                  <button
                    onClick={() => setShowTargetModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Target
                  </button>
                </div>
                <div className="space-y-2">
                  {targets.map((t) => (
                    <div key={t.id} className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2">
                      <div>
                        <span className="font-semibold text-slate-800">{t.target_month}/{t.target_year}</span>
                        <span className="text-xs text-slate-500 ml-2">₹{t.target_amount} · {t.target_orders} orders</span>
                      </div>
                    </div>
                  ))}
                  {!targets.length && <p className="text-xs text-slate-400">No targets set.</p>}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-400">
              Select a salesman to manage their beats and targets.
            </div>
          )}
        </div>
      </div>

      {/* Salesman Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Add Salesman</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Employee ID</label>
                <input type="text" required value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value.toUpperCase() })} className="w-full p-2 border rounded-xl font-mono" />
              </div>
              <div>
                <label className="font-bold">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Password</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">Save Salesman</button>
            </form>
          </div>
        </div>
      )}

      {/* Beat Modal */}
      {showBeatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Add Beat</h4>
              <button onClick={() => setShowBeatModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateBeat} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Beat Name</label>
                <input type="text" required value={beatForm.beat_name} onChange={(e) => setBeatForm({ ...beatForm, beat_name: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Area</label>
                <input type="text" value={beatForm.area} onChange={(e) => setBeatForm({ ...beatForm, area: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Day of Week</label>
                <select value={beatForm.day_of_week} onChange={(e) => setBeatForm({ ...beatForm, day_of_week: e.target.value })} className="w-full p-2 border rounded-xl">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold">Active</label>
                <select value={beatForm.is_active} onChange={(e) => setBeatForm({ ...beatForm, is_active: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl">
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">Save Beat</button>
            </form>
          </div>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Add Target</h4>
              <button onClick={() => setShowTargetModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTarget} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Month</label>
                  <input type="number" required value={targetForm.target_month} onChange={(e) => setTargetForm({ ...targetForm, target_month: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Year</label>
                  <input type="number" required value={targetForm.target_year} onChange={(e) => setTargetForm({ ...targetForm, target_year: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold">Target Amount (₹)</label>
                <input type="number" required value={targetForm.target_amount} onChange={(e) => setTargetForm({ ...targetForm, target_amount: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold">Target Orders</label>
                <input type="number" value={targetForm.target_orders} onChange={(e) => setTargetForm({ ...targetForm, target_orders: e.target.value })} className="w-full p-2 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl mt-4">Save Target</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
