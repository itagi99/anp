import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { TicketPercent, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';

export const Marketing: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'PERCENTAGE',
    discount_value: '10',
    min_order_value: '500',
    max_discount: '500',
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    target_type: 'CATEGORY',
    target_value: 'cat-mobiles',
    badge_text: 'SUPER SALE',
  });

  const fetchData = async () => {
    try {
      const [c, b] = await Promise.all([
        api.get<any[]>('/coupons'),
        api.get<any[]>('/banners'),
      ]);
      setCoupons(c);
      setBanners(b);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/coupons', {
        ...couponForm,
        discount_value: parseFloat(couponForm.discount_value),
        min_order_value: parseFloat(couponForm.min_order_value),
        max_discount: couponForm.max_discount ? parseFloat(couponForm.max_discount) : null,
      });
      setShowCouponModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/banners', bannerForm);
      setShowBannerModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Deactivate coupon?')) return;
    await api.delete(`/coupons/${id}`);
    fetchData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete banner?')) return;
    await api.delete(`/banners/${id}`);
    fetchData();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Coupons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <TicketPercent className="w-5 h-5 text-blue-600" />
              <span>Discount Promo Codes</span>
            </h3>
            <p className="text-xs text-slate-500">Configure percentage and flat discount vouchers</p>
          </div>
          <button
            onClick={() => setShowCouponModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-dashed border-blue-300 shadow-sm relative group hover:border-blue-500 transition-colors">
              <button
                onClick={() => handleDeleteCoupon(c.id)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="font-mono font-black text-lg text-blue-600">{c.code}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}
              </div>
              <p className="text-xs text-slate-500 mt-2">Min order value: ₹{c.min_order_value}</p>
              {c.max_discount && <p className="text-xs text-slate-500">Max savings: ₹{c.max_discount}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Banners Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span>Promotional Hero Banners</span>
            </h3>
            <p className="text-xs text-slate-500">Slider carousels featured on mobile home page</p>
          </div>
          <button
            onClick={() => setShowBannerModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
              <img src={b.image_url} alt="" className="w-full h-40 object-cover" />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-yellow-400 text-blue-950 px-2 py-0.5 rounded">
                    {b.badge_text || 'PROMO'}
                  </span>
                  <h4 className="font-bold text-slate-900 mt-1">{b.title}</h4>
                  <p className="text-xs text-slate-500">{b.subtitle}</p>
                </div>
                <button
                  onClick={() => handleDeleteBanner(b.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Create Coupon</h4>
              <button onClick={() => setShowCouponModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full p-2 border rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Type</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
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
                    value={couponForm.discount_value}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponForm.min_order_value}
                    onChange={(e) => setCouponForm({ ...couponForm, min_order_value: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={couponForm.max_discount}
                    onChange={(e) => setCouponForm({ ...couponForm, max_discount: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-4">
                Save Promo Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <h4 className="font-bold">Add Banner</h4>
              <button onClick={() => setShowBannerModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateBanner} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold">Title</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="Big Billion Days"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="Up to 80% off on flagship smartphones"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  required
                  value={bannerForm.image_url}
                  onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl mt-4">
                Add Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
