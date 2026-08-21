import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { useCart, effectiveUnitPrice, tierLabel } from '../context/CartContext.jsx';
import { unitConvText, imageSrc } from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get(`/store/product/${id}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state"><h2>Product not found</h2></div>;

  const inCart = cart[product.id] || 0;
  const mrp = Number(product.mrp);
  const price = Number(product.price);
  const displayPrice = price > 0 ? price : mrp;
  const oos = Number(product.stock_total ?? 0) <= 0;
  const baseDiscPct = mrp > displayPrice ? Math.round(((mrp - displayPrice) / mrp) * 100) : 0;

  const primaryUnit = product.primary_unit || 'Box';
  const secondaryUnit = product.secondary_unit || 'Pc';
  const conv = Math.max(1, Number(product.unit_conversion) || 1);
  const isSingleUnit = primaryUnit.toLowerCase() === secondaryUnit.toLowerCase() || conv === 1;

  const [qty, setQty] = useState(inCart > 0 ? inCart : 1);

  const applyTier = (q) => {
    let best = null;
    [...(product.tiers || [])].sort((a, b) => Number(b.min) - Number(a.min)).forEach((t) => {
      if (q >= Number(t.min) && !best) best = t;
    });
    return best;
  };
  const tier = applyTier(qty);
  const unitPrice = effectiveUnitPrice(displayPrice, tier);
  const total = unitPrice * qty;

  const addCustomQty = (q) => addToCart(product.id, q);

  return (
    <div>
      <header className="header">
        <Link to="/" className="back-btn" style={{ fontSize: 22 }}><i className="bi bi-chevron-left"></i></Link>
        <div className="header-title" style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <Link to="/cart" className="cart-btn position-relative" style={{ fontSize: 22 }}>
          <i className="bi bi-cart3"></i>
          {inCart + Object.values(cart).reduce((a, b) => a + b, 0) - inCart > 0 && (
            <span className="nav-badge" style={{ position: 'absolute', top: -4, right: -6 }}>{Math.min(Object.values(cart).reduce((a, b) => a + b, 0), 99)}</span>
          )}
        </Link>
      </header>

      {inCart > 0 && (
        <div className="sync-notice" style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', color: '#166534', padding: '8px 16px', fontSize: 12, fontWeight: 800, textAlign: 'center' }}>
          <i className="bi bi-check-circle-fill"></i> You have {inCart} of this item in your cart
        </div>
      )}

      <div className="hero-section">
        {baseDiscPct > 0 && !oos && <div className="status-badge discount">{baseDiscPct}% OFF</div>}
        {oos && <div className="status-badge oos">Out of Stock</div>}
        <img src={imageSrc(product.image_url)} alt={product.name} className="hero-img" />
      </div>

      <div className="info-section">
        <div className="p-title">{product.name}</div>
        <div className="p-unit-tag">1 {secondaryUnit}</div>
        <div className="price-block d-flex align-items-baseline gap-2">
          <span className="p-price">₹{displayPrice.toFixed(2)}</span>
          {mrp > 0 && mrp > displayPrice && (
            <>
              <span className="p-mrp">₹{mrp.toFixed(0)}</span>
              <span className="p-save-tag">SAVE ₹{Math.round(mrp - displayPrice)}</span>
            </>
          )}
        </div>
        {!isSingleUnit && (
          <div className="unit-conv">
            <i className="bi bi-arrow-left-right"></i>
            <span>1 {primaryUnit} = {conv === Math.floor(conv) ? Math.round(conv) : conv.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} {secondaryUnit}s</span>
          </div>
        )}
      </div>

      {product.tiers && product.tiers.length > 0 && !oos && (
        <div className="smart-buy-section">
          <div className="section-heading"><i className="bi bi-lightning-charge-fill" style={{ color: 'var(--primary)' }}></i> Smart Wholesale Offers</div>
          {product.tiers.map((t, i) => {
            const minQty = Number(t.min);
            const discPrice = effectiveUnitPrice(displayPrice, t);
            const savings = (displayPrice - discPrice) * minQty;
            return (
              <div className="sb-card" key={i} onClick={() => addCustomQty(minQty)}>
                <div className="sb-info">
                  <span className="sb-qty-lbl">Buy {minQty} {secondaryUnit}s</span>
                  <span className="sb-price-lbl">₹{discPrice.toFixed(2)} / {secondaryUnit}</span>
                  {savings > 0 && <span className="sb-save-lbl"><i className="bi bi-tags-fill"></i> Save ₹{Math.round(savings)} overall</span>}
                </div>
                <button className="btn-sb-add">ADD {minQty}</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="info-section">
        <div className="section-heading">Product Details</div>
        <div className="specs-grid">
          <div className="spec-item"><span className="spec-lbl">Category</span><span className="spec-val">{product.category_name || 'General'}</span></div>
          <div className="spec-item"><span className="spec-lbl">Brand</span><span className="spec-val">{product.brand || 'Generic'}</span></div>
          <div className="spec-item"><span className="spec-lbl">Availability</span><span className="spec-val" style={{ color: oos ? 'var(--danger)' : 'var(--primary)' }}>{oos ? 'Out of Stock' : 'In Stock'}</span></div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="info-section">
          <div className="section-heading">Similar Products</div>
          <div className="related-scroll">
            {related.map((rp) => (
              <Link key={rp.id} to={`/product/${rp.id}`} className="rel-card">
                <img src={imageSrc(rp.image_url)} className="rel-img" alt={rp.name} />
                <div className="rel-name">{rp.name}</div>
                <div className="rel-price">₹{Number(rp.price).toFixed(0)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="sticky-footer">
        {!oos ? (
          <>
            <div className="qty-controls">
              <button className="q-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input
                type="number"
                className="q-inp"
                value={qty}
                min="1"
                onClick={(e) => e.target.select()}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
              <button className="q-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-main-add" onClick={() => addToCart(product.id, qty)}>
              {inCart > 0 ? 'UPDATE CART' : 'ADD TO CART'} • ₹{total.toFixed(2)}
            </button>
          </>
        ) : (
          <button className="btn-main-add btn-oos">OUT OF STOCK</button>
        )}
      </div>
    </div>
  );
}