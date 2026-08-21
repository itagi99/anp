import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Megaphone, Plus, Trash2, X } from 'lucide-react';

export const Popups: React.FC = () => {
  const [popups, setPopups] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    message: '',
    image_url: '',
    button_text: '',
    button_link: '',
    active: 1,
    start_date: '',
    end_date: '',
    per_session: 0,
    dismissible: 1,
  });

  const fetchData = async () => {
    try {
      const res = await api.get<any>('/admin-features/popups');
      setPopups(res.popups || []);
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
      title: '', message: '', image_url: '', button_text: '', button_link: '',
      active: 1, start_date: '', end_date: '', per_session: 0, dismissible: 1,
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      message: p.message || '',
      image_url: p.image_url || '',
      button_text: p.button_text || '',
      button_link: p.button_link || '',
      active: p.active,
      start_date: p.start_date ? p.start_date.slice(0, 10) : '',
      end_date: p.end_date ? p.end_date.slice(0, 10) : '',
      per_session: p.per_session,
      dismissible: p.dismissible,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        message: form.message || null,
        image_url: form.image_url || null,
        button_text: form.button_text || null,
        button_link: form.button_link || null,
        active: form.active,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        per_session: form.per_session,
        dismissible: form.dismissible,
      };
      if (editingId) {
        await api.put(`/admin-features/popups/${editingId}`, payload);
      } else {
        await api.post('/admin-features/popups', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this popup?')) return;
    try {
      await api.delete(`/admin-features/popups/${id}`);
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
            <Megaphone className="w-6 h-6 text-rose-600" />
            Promotional Popups
          </h2>
          <p className="text-xs text-slate-500">App home-screen promotional overlays</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Popup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popups.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
            <button onClick={() => handleDelete(p.id)} className="absolute top-3 right-3 z-10 p-1 bg-white/80 text-slate-400 hover:text-rose-600 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
            {p.image_url && <img src={p.image_url} alt="" className="w-full h-32 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
                {p.per_session && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">PER SESSION</span>}
              </div>
              <h4 className="font-bold text-slate-900 mt-1">{p.title}</h4>
              <p className="text-xs text-slate-500">{p.message}</p>
              {p.button_text && <p className="text-xs font-semibold text-rose-600 mt-1">{p.button_text}</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">{editingId ? 'Edit Popup' : 'Add Popup'}</h4>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Message</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Button Text</label>
                  <input
                    type="text"
                    value={form.button_text}
                    onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Button Link</label>
                  <input
                    type="text"
                    value={form.button_link}
                    onChange={(e) => setForm({ ...form, button_link: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold">Active</label>
                  <select value={form.active} onChange={(e) => setForm({ ...form, active: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl">
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Per Session</label>
                  <select value={form.per_session} onChange={(e) => setForm({ ...form, per_session: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Dismissible</label>
                  <select value={form.dismissible} onChange={(e) => setForm({ ...form, dismissible: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl">
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-rose-600 text-white font-bold rounded-xl mt-4">
                Save Popup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
