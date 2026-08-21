import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Warehouse, Plus, Save, Database, Server } from 'lucide-react';

export const Settings: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [showAddWh, setShowAddWh] = useState(false);
  const [whForm, setWhForm] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    pincode: '',
    capacity: '50000',
  });

  const fetchWh = async () => {
    try {
      const data = await api.get<any[]>('/admin/warehouses');
      setWarehouses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWh();
  }, []);

  const handleAddWh = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/warehouses', whForm);
      setShowAddWh(false);
      setWhForm({ name: '', code: '', city: '', state: '', pincode: '', capacity: '50000' });
      fetchWh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">System & Warehouse Settings</h2>
        <p className="text-xs text-slate-500">Regional fulfillment centers and Turso database configuration</p>
      </div>

      {/* Warehouses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            <span>Fulfillment Warehouses</span>
          </h3>
          <button
            onClick={() => setShowAddWh(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fulfillment Hub</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((w) => (
            <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{w.code}</span>
                <span className="text-[10px] text-slate-400">ID: {w.id}</span>
              </div>
              <h4 className="font-bold text-slate-900">{w.name}</h4>
              <p className="text-xs text-slate-500">{w.city}, {w.state} - {w.pincode}</p>
              <div className="pt-2 border-t text-[11px] text-slate-500 flex justify-between">
                <span>Storage Capacity:</span>
                <span className="font-bold text-slate-800">{w.capacity.toLocaleString()} units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Connection Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>Edge Database Engine</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Database Architecture</span>
            <p className="font-bold text-slate-800 mt-1">Turso (libSQL Distributed Edge SQLite)</p>
            <p className="text-slate-500 mt-1">Sub-10ms global latency with write transactions and foreign key constraints.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold uppercase text-[10px]">WebSocket Stream</span>
            <p className="font-bold text-slate-800 mt-1">Socket.io Multi-Room Topology</p>
            <p className="text-slate-500 mt-1">Dedicated admin channels and individual product SKU rooms.</p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddWh && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h4 className="font-bold text-base mb-4">Add Regional Warehouse</h4>
            <form onSubmit={handleAddWh} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">Hub Name</label>
                <input
                  type="text"
                  required
                  value={whForm.name}
                  onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
                  placeholder="e.g. Pune Western Fulfillment"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Code</label>
                  <input
                    type="text"
                    required
                    value={whForm.code}
                    onChange={(e) => setWhForm({ ...whForm, code: e.target.value })}
                    placeholder="WH-PN-01"
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">City</label>
                  <input
                    type="text"
                    required
                    value={whForm.city}
                    onChange={(e) => setWhForm({ ...whForm, city: e.target.value })}
                    placeholder="Pune"
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">State</label>
                  <input
                    type="text"
                    required
                    value={whForm.state}
                    onChange={(e) => setWhForm({ ...whForm, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Pincode</label>
                  <input
                    type="text"
                    required
                    value={whForm.pincode}
                    onChange={(e) => setWhForm({ ...whForm, pincode: e.target.value })}
                    placeholder="411001"
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddWh(false)} className="px-3 py-1.5 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl">
                  Create Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
