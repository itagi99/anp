import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { imageSrc } from '../components/ProductCard.jsx';

export default function CartPage() {
  const { cart, setQty, removeItem, clearCart, buildLines } = useCart();
  const [products, setProducts] = useState([]);
  const [delivery, setDelivery] = useState({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0, rule_id: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = Object.keys(cart);
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    api.get(`/store/products?ids=${ids.join(',')}`)
      .then(({ data }) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cart]);

  const lines = useMemo(() => {
    const l = buildLines(products);
    if (!l.length) return l;
    const payload = l.map((li) => ({
      product_id: li.id,
      quantity: li.base_qty,
      price_each: li.eff_rate,
    }));
    api.post('/store/delivery/calculate', { items: payload })
      .then(({ data }) => setDelivery(data))
      .catch(() => setDelivery({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0 }));
    return l;
  }, [products, cart, buildLines]);

  const subtotal = lines.reduce((a, li) => a + li.subtotal, 0);
  const grandTotal = subtotal + Number(delivery.delivery_charge || 0);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-cart-x"></i>
        <h2 style={{ marginTop: 20, fontWeight: 800 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-sec)', marginTop: 8 }}>Add items to start your shopping</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: 24, color: 'var(--primary)', fontWeight: 700, border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: 8 }}>Go to Shop</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ color: 'inherit', fontSize: 22 }}><i className="bi bi-chevron-left"></i></Link>
          <h1>Review Cart</h1>
        </div>
        <button className="clear-btn" style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }} onClick={() => { if (window.confirm('Clear all items from cart?')) clearCart(); }}>Clear Cart</button>
      </header>

      <div className="cart-section">
        {lines.map((p) => {
          const conv = Math.max(1, Number(p.unit_conversion) || 1);
          const pu = p.primary_unit || 'Unit';
          const su = p.secondary_unit || 'Pc';
          const pQty = Math.floor(p.base_qty / conv);
          const sQty = p.base_qty % conv;
          return (
            <div className="item" key={p.id}>
              <button type="button" className="btn-x-remove" onClick={() => removeItem(p.id)}><i className="bi bi-x-lg"></i></button>
              <div>
                <img className="item-img" src={imageSrc(p.image_url)} alt="" />
                {conv !== 1 && <span className="unit-info">1 {pu} = {conv === Math.floor(conv) ? Math.round(conv) : conv.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} {su}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 className="item-name">{p.name}</h2>
                {conv !== 1 && <span className="item-qty-label">P: {pQty} | S: {sQty} ({su})</span>}
                <div className="price-row d-flex align-items-baseline gap-2">
                  <span className="price-now">₹{Number(p.eff_rate).toFixed(2)}</span>
                  {Number(p.mrp) > Number(p.eff_rate) && <span className="price-mrp">₹{Number(p.mrp).toFixed(0)}</span>}
                </div>
                {p.is_flash && <span className="badge badge-flash"><i className="bi bi-lightning-fill"></i> Flash Deal</span>}
                {p.tier && <span className="badge badge-tier"><i className="bi bi-tags-fill"></i> Bulk Price Applied</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <div className="qty-box">
                  <button className="qty-btn" onClick={() => { if (p.base_qty - 1 < 1) removeItem(p.id); else setQty(p.id, p.base_qty - 1); }}>-</button>
                  <span className="qty-val">{p.base_qty}</span>
                  <button className="qty-btn" onClick={() => setQty(p.id, p.base_qty + 1)}>+</button>
                </div>
                <div className="subtotal-txt">₹{Number(p.subtotal).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bill-card">
        <h3>Bill Summary</h3>
        <div className="bill-row"><span>Item Total (Subtotal)</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="bill-row">
          <span>Delivery Charges</span>
          <span style={{ color: Number(delivery.delivery_charge) > 0 ? 'var(--text-main)' : 'var(--primary)' }}>
            {Number(delivery.delivery_charge) > 0 ? `₹${Number(delivery.delivery_charge).toFixed(2)}` : 'FREE'}
          </span>
        </div>
        {Number(delivery.excluded_value) > 0 && (
          <div className="savings-info">
            <i className="bi bi-check-circle-fill"></i> ₹{Math.round(Number(delivery.excluded_value))} free shipping items included
          </div>
        )}
        <div className="bill-row total"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
      </div>

      <div className="sticky-bar">
        <button className="btn-checkout" onClick={() => navigate('/checkout')}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16 }}>₹{grandTotal.toFixed(2)}</span>
            <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.9, textTransform: 'uppercase' }}>Total Amount</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Next</span><i className="bi bi-chevron-right"></i>
          </div>
        </button>
      </div>
    </div>
  );
}