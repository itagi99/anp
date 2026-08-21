import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { imageSrc } from '../components/ProductCard.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Checkout() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { cart, buildLines, clearCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [delivery, setDelivery] = useState({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0, rule_id: null });
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [paymentMode, setPaymentMode] = useState('cod');
  const [gps, setGps] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    new_address: '', new_city: '', new_state: '', new_postal_code: '', new_country: 'India', phone: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout');
      return;
    }
  }, [token]);

  useEffect(() => {
    const ids = Object.keys(cart);
    if (!ids.length) {
      navigate('/cart');
      return;
    }
    api.get(`/store/products?ids=${ids.join(',')}`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {});
    api.get('/store/offers').then(({ data }) => setAllCoupons(data.coupons || [])).catch(() => {});
    api.get('/store/addresses').then(({ data }) => setSavedAddresses(data.addresses || [])).catch(() => {});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [cart]);

  const lines = useMemo(() => {
    const l = buildLines(products);
    if (!l.length) return l;
    const payload = l.map((li) => ({ product_id: li.id, quantity: li.base_qty, price_each: li.eff_rate }));
    api.post('/store/delivery/calculate', { items: payload })
      .then(({ data }) => setDelivery(data))
      .catch(() => setDelivery({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0 }));
    return l;
  }, [products, cart, buildLines]);

  const subtotal = lines.reduce((a, li) => a + li.subtotal, 0);
  const deliveryCharge = Number(delivery.delivery_charge || 0);

  // Coupon discount calculation (4 scopes)
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const { scope, discount_type, discount_value, category_id, product_id, min_cart_total } = appliedCoupon;
    const dval = Number(discount_value);
    const applyDisc = (base) => {
      if (base <= 0) return 0;
      if (discount_type === 'amount') return Math.min(dval, base);
      return Math.round((dval / 100.0) * base * 100) / 100;
    };
    let amt = 0;
    if (scope === 'sitewide') amt = applyDisc(subtotal);
    else if (scope === 'category') {
      const eligible = lines.filter((li) => String(li.category_id) === String(category_id)).reduce((a, li) => a + li.subtotal, 0);
      amt = applyDisc(eligible);
    } else if (scope === 'item') {
      const eligible = lines.filter((li) => String(li.id) === String(product_id)).reduce((a, li) => a + li.subtotal, 0);
      amt = applyDisc(eligible);
    } else if (scope === 'grand_total') {
      if (min_cart_total !== null && subtotal >= Number(min_cart_total)) amt = applyDisc(subtotal);
    }
    return Math.min(amt, subtotal);
  }, [appliedCoupon, lines, subtotal]);

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const applyCoupon = async () => {
    setErrors([]);
    if (!couponInput.trim()) {
      setErrors(['Please enter a coupon code.']);
      return;
    }
    try {
      const payload = {
        code: couponInput.trim(),
        line_items: lines.map((li) => ({ product_id: li.id, quantity: li.base_qty, category_id: li.category_id, price_each: li.eff_rate, line_sub: li.subtotal })),
        subtotal_total: subtotal,
      };
      const { data } = await api.post('/store/coupon/validate', payload);
      if (data.valid) {
        setAppliedCoupon(data);
        setSuccessMsg(`Coupon applied: ${data.code}`);
        setCouponInput('');
      } else {
        setAppliedCoupon(null);
        setErrors([data.reason || 'Coupon not applicable']);
      }
    } catch (e) {
      setErrors([e.response?.data?.error || 'Invalid or expired coupon code.']);
    }
  };

  const pickCoupon = async (code) => {
    setCouponInput(code);
    try {
      const payload = {
        code,
        line_items: lines.map((li) => ({ product_id: li.id, quantity: li.base_qty, category_id: li.category_id, price_each: li.eff_rate, line_sub: li.subtotal })),
        subtotal_total: subtotal,
      };
      const { data } = await api.post('/store/coupon/validate', payload);
      if (data.valid) {
        setAppliedCoupon(data);
        setSuccessMsg(`Coupon applied: ${data.code}`);
      } else {
        setErrors([data.reason || 'Coupon not applicable']);
      }
    } catch (e) {
      setErrors([e.response?.data?.error || 'Invalid or expired coupon code.']);
    }
  };

  const placeOrder = async () => {
    setErrors([]);
    if (!token) { navigate('/login?redirect=/checkout'); return; }

    const delivery_address = selectedAddress === 'new'
      ? `${form.new_address}, ${form.new_city}, ${form.new_state} - ${form.new_postal_code}, ${form.new_country}`
      : selectedAddress;

    if (!delivery_address || delivery_address.length < 10) {
      setErrors(['Please select or enter a delivery address.']);
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        items: lines.map((li) => ({
          product_id: li.id,
          quantity: li.base_qty,
          price_each: li.eff_rate,
          category_id: li.category_id,
        })),
        subtotal,
        discount: discountAmount,
        delivery_charge: deliveryCharge,
        total: finalTotal,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        delivery_address,
        payment_method: paymentMode === 'online' ? 'UPI' : 'COD',
        gps_lat: gps ? gps.lat : null,
        gps_lng: gps ? gps.lng : null,
        new_address: selectedAddress === 'new' ? form : null,
      };
      const { data } = await api.post('/orders/anp-checkout', payload);
      clearCart();
      showToast('Order placed successfully!');
      navigate(`/orders/${data.orderId}`);
    } catch (e) {
      setErrors([e.response?.data?.error || 'Failed to place order']);
    } finally {
      setPlacing(false);
    }
  };

  const upiLink = `upi://pay?pa=${encodeURIComponent('6363304520@okbizaxis')}&pn=${encodeURIComponent('Annapurna Mart')}&am=${finalTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order from ANP Mart')}`;

  return (
    <div>
      <header className="header">
        <Link to="/cart" style={{ color: 'inherit', fontSize: 22 }}><i className="bi bi-arrow-left"></i></Link>
        <h1 style={{ fontSize: 18, fontWeight: 800, flex: 1, textAlign: 'center' }}>Review & Pay</h1>
      </header>

      {errors.length > 0 && <div className="toast-err" style={{ margin: 12 }}>{errors.join(' ')}</div>}
      {successMsg && <div className="toast-succ" style={{ margin: 12 }}>{successMsg}</div>}

      <div className="card">
        <div className="section-title"><i className="bi bi-box-seam"></i> Shipment Items</div>
        {lines.map((li) => (
          <div className="item-row" key={li.id}>
            <img className="item-img" style={{ width: 45, height: 45 }} src={imageSrc(li.image_url)} alt="" />
            <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="item-name" style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{li.name}</div>
              <div className="item-meta" style={{ fontSize: 11, color: 'var(--text-sec)' }}>Qty: {li.base_qty}</div>
            </div>
            <div className="item-price" style={{ fontSize: 13, fontWeight: 800 }}>₹{Number(li.subtotal).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-ticket-perforated"></i> Coupons</div>
        <div className="coupon-input-group">
          <input placeholder="Enter coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} />
          <button onClick={applyCoupon}>APPLY</button>
        </div>
        {appliedCoupon && (
          <div className="toast-succ d-flex justify-content-between align-items-center">
            <span><i className="bi bi-check-circle-fill"></i> {appliedCoupon.code} applied (₹{discountAmount.toFixed(2)} off)</span>
            <button style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 800 }} onClick={() => { setAppliedCoupon(null); setSuccessMsg(''); }}>Remove</button>
          </div>
        )}
        <div className="coupon-scroll">
          {allCoupons.map((c) => (
            <div key={c.id} className="coupon-pill" onClick={() => pickCoupon(c.code)}>
              <span className="cp-code">{c.code}</span>
              <span className="cp-desc">{c.scope === 'sitewide' ? 'Sitewide' : c.scope === 'category' ? c.category_name : c.scope === 'item' ? c.product_name : 'Grand Total'} · {c.discount_pct}% off</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-geo-alt"></i> Delivery Address</div>
        {savedAddresses.map((addr) => (
          <div key={addr.id} className={`addr-card ${selectedAddress === addr.address ? 'selected' : ''}`} onClick={() => setSelectedAddress(addr.address)}>
            <div className="radio-dot"></div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{addr.address}</div>
          </div>
        ))}
        <div className={`addr-card ${selectedAddress === 'new' ? 'selected' : ''}`} onClick={() => setSelectedAddress('new')}>
          <div className="radio-dot"></div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>+ Add New Address</div>
        </div>
        {selectedAddress === 'new' && (
          <div style={{ marginTop: 16, background: '#f9fafb', padding: 14, borderRadius: 12 }}>
            <div className="input-group"><label>Address</label><input value={form.new_address} onChange={(e) => setForm({ ...form, new_address: e.target.value })} placeholder="Flat, Street, Area" /></div>
            <div className="input-group"><label>City</label><input value={form.new_city} onChange={(e) => setForm({ ...form, new_city: e.target.value })} /></div>
            <div className="input-group"><label>State</label><input value={form.new_state} onChange={(e) => setForm({ ...form, new_state: e.target.value })} /></div>
            <div className="input-group"><label>Postal Code</label><input value={form.new_postal_code} onChange={(e) => setForm({ ...form, new_postal_code: e.target.value })} /></div>
            <div className="input-group"><label>Country</label><input value={form.new_country} onChange={(e) => setForm({ ...form, new_country: e.target.value })} /></div>
            <div className="input-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Delivery contact number" /></div>
            <div className="input-group">
              <label>GPS Location {gps ? '(captured)' : '(tap to capture)'}</label>
              <button className="btn btn-outline btn-block" onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
                }
              }}><i className="bi bi-crosshair"></i> {gps ? `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}` : 'Capture GPS'}</button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-credit-card"></i> Payment Method</div>
        <div className={`pay-card ${paymentMode === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMode('cod')}>
          <span style={{ fontWeight: 700, fontSize: 13 }}><i className="bi bi-cash-coin me-2"></i> Cash on Delivery</span>
          <i className="bi bi-check-circle-fill" style={{ color: paymentMode === 'cod' ? 'var(--primary)' : '#ddd' }}></i>
        </div>
        <div className={`pay-card ${paymentMode === 'online' ? 'selected' : ''}`} onClick={() => setPaymentMode('online')}>
          <span style={{ fontWeight: 700, fontSize: 13 }}><i className="bi bi-wallet2 me-2"></i> UPI / Online</span>
          <i className="bi bi-check-circle-fill" style={{ color: paymentMode === 'online' ? 'var(--primary)' : '#ddd' }}></i>
        </div>
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-receipt"></i> Bill Details</div>
        <div className="bill-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="bill-row"><span>Coupon Discount</span><span style={{ color: 'var(--primary)' }}>- ₹{discountAmount.toFixed(2)}</span></div>
        <div className="bill-row"><span>Delivery Charges</span><span>{deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}</span></div>
        {Number(delivery.excluded_value) > 0 && (
          <div className="savings-info"><i className="bi bi-check-circle-fill"></i> ₹{Math.round(Number(delivery.excluded_value))} free shipping items included</div>
        )}
        <div className="bill-row total bill-total" style={{ fontSize: 16, fontWeight: 900, borderTop: '1px dashed #ddd', paddingTop: 12, marginTop: 10 }}>
          <span>Grand Total</span><span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="sticky-bar">
        {paymentMode === 'online' ? (
          <a href={upiLink} className="btn-pay text-decoration-none">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16 }}>₹{finalTotal.toFixed(2)}</span>
              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.9, textTransform: 'uppercase' }}>Pay via UPI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>Pay Now</span><i className="bi bi-arrow-right"></i></div>
          </a>
        ) : (
          <button className="btn-pay" onClick={placeOrder} disabled={placing}>
            {placing ? <div className="spinner" style={{ borderColor: '#fff', borderTopColor: 'transparent' }}></div> : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16 }}>₹{finalTotal.toFixed(2)}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.9, textTransform: 'uppercase' }}>Place Order</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>Order</span><i className="bi bi-arrow-right"></i></div>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}