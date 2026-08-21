import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Users as UsersIcon, Search, ShieldAlert, ShieldCheck } from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await api.get<any[]>(`/admin/users?search=${encodeURIComponent(search)}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleToggleBlock = async (id: string, currentStatus: number) => {
    try {
      await api.put(`/admin/users/${id}/block`, { is_blocked: currentStatus ? 0 : 1 });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user block state');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Customer Management</h2>
          <p className="text-xs text-slate-500">View user purchase history and manage account permissions</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Contact Phone</th>
              <th className="py-3.5 px-6">Total Orders Placed</th>
              <th className="py-3.5 px-6">Total Spent</th>
              <th className="py-3.5 px-6">Joined Date</th>
              <th className="py-3.5 px-6">Account Status</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-700">{u.phone || '-'}</td>
                <td className="py-3.5 px-6 font-bold text-slate-800">{u.order_count}</td>
                <td className="py-3.5 px-6 font-bold text-emerald-600">₹{u.total_spent.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-3.5 px-6">
                  {u.is_blocked ? (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Suspended
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => handleToggleBlock(u.id, u.is_blocked)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      u.is_blocked 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {u.is_blocked ? 'Unblock User' : 'Suspend Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
