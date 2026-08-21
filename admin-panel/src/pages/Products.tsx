import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  RefreshCw
} from 'lucide-react';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category_id: 'cat-mobiles',
    price: '',
    mrp: '',
    description: '',
    image_url: '',
    initial_stock: '15',
    is_assured: true,
    is_featured: false,
  });

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>(`/products?q=${encodeURIComponent(search)}&category=${selectedCategory}&limit=50`);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get<any>('/categories');
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp || formData.price),
        description: formData.description,
        image_urls: formData.image_url ? [formData.image_url] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        initial_stock: parseInt(formData.initial_stock) || 10,
        is_assured: formData.is_assured ? 1 : 0,
        is_featured: formData.is_featured ? 1 : 0,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setShowAddModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;
    setImporting(true);
    try {
      const data = new FormData();
      data.append('file', importFile);
      const res = await api.upload<any>('/products/bulk-import', data);
      alert(res.message);
      setShowImportModal(false);
      setImportFile(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Product Catalogue</h2>
          <p className="text-xs text-slate-500">Manage Flipkart-style listings, pricing, and specs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                brand: '',
                category_id: categories[0]?.id || 'cat-mobiles',
                price: '',
                mrp: '',
                description: '',
                image_url: '',
                initial_stock: '15',
                is_assured: true,
                is_featured: false,
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product name, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Product Details</th>
                <th className="py-3.5 px-6">Brand</th>
                <th className="py-3.5 px-6">Selling Price & MRP</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6">Total Stock</th>
                <th className="py-3.5 px-6">Assured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Querying Turso libSQL...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.image_urls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <span className="text-[11px] font-mono text-slate-400">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">{p.brand}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-extrabold text-slate-900">₹{p.price.toLocaleString()}</div>
                      {p.mrp > p.price && (
                        <div className="text-[11px] text-slate-400">
                          <span className="line-through">₹{p.mrp.toLocaleString()}</span>{' '}
                          <span className="text-emerald-600 font-bold">{p.discount_pct}% off</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-2 py-0.5 rounded w-fit">
                        <span>{p.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                        p.total_stock <= 5 
                          ? 'bg-rose-100 text-rose-700 font-extrabold animate-pulse' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {p.total_stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      {p.is_assured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Assured</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setFormData({
                              name: p.name,
                              brand: p.brand,
                              category_id: p.category_id,
                              price: p.price.toString(),
                              mrp: p.mrp.toString(),
                              description: p.description,
                              image_url: p.image_urls[0] || '',
                              initial_stock: p.total_stock.toString(),
                              is_assured: Boolean(p.is_assured),
                              is_featured: Boolean(p.is_featured),
                            });
                            setShowAddModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Apple iPhone 15 (128 GB)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Apple, Samsung, Sony"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70999"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="79900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {!editingProduct && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Stock (Bangalore Hub)</label>
                  <input
                    type="number"
                    value={formData.initial_stock}
                    onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Product Highlights & Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bullet points and key specifications..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_assured}
                    onChange={(e) => setFormData({ ...formData, is_assured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>ShopKart Assured Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Featured on Home Slider</span>
                </label>
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
                  {editingProduct ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Bulk Import via CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-4 mt-4">
              <p className="text-xs text-slate-500">
                Upload a CSV file containing columns: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">name, brand, category_id, price, mrp, stock, description</code>
              </p>

              <input
                type="file"
                accept=".csv"
                required
                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 border border-dashed border-slate-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing || !importFile}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {importing ? 'Processing...' : 'Upload & Parse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
