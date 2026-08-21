import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { FolderTree, Plus, Edit, Trash2, X } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '',
    icon_name: 'Tag',
    display_order: '1',
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get<any>('/categories');
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        parent_id: formData.parent_id || null,
        icon_name: formData.icon_name,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setShowAddModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deactivate this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Product Categories</h2>
          <p className="text-xs text-slate-500">Manage hierarchical taxonomy and mobile navigation tabs</p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parent_id: '', icon_name: 'Tag', display_order: '1' });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Category Name</th>
              <th className="py-3.5 px-6">Slug Key</th>
              <th className="py-3.5 px-6">Hierarchy Level</th>
              <th className="py-3.5 px-6">Display Order</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <FolderTree className="w-4 h-4 text-blue-600" />
                    <span>{c.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 font-mono text-xs text-slate-500">{c.slug}</td>
                <td className="py-3.5 px-6">
                  {c.parent_id ? (
                    <span className="text-xs text-slate-500">Sub-category</span>
                  ) : (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Root Category</span>
                  )}
                </td>
                <td className="py-3.5 px-6 font-semibold text-slate-700">{c.display_order}</td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setFormData({
                          name: c.name,
                          slug: c.slug,
                          parent_id: c.parent_id || '',
                          icon_name: c.icon_name || 'Tag',
                          display_order: c.display_order.toString(),
                        });
                        setShowAddModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Laptops & Computers"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Parent Category (Optional)</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top-Level Root)</option>
                  {categories.filter(c => !c.parent_id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
