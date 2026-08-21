import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { tierLabel } from '../context/CartContext.jsx';
import { useModal } from './ProductModal.jsx';

export function unitConvText(p) {
  const conv = Number(p.unit_conversion) || 1;
  const primary = p.primary_unit || '';
  const secondary = p.secondary_unit || '';
  if (conv > 0 && conv !== 1 && primary && secondary) {
    const formatted = conv === Math.floor(conv) ? String(Math.round(conv)) : conv.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    return `1 ${primary} = ${formatted} ${secondary}`;
  }
  return '';
}

export function imageSrc(path) {
  if (!path) return 'https://via.placeholder.com/150x150?text=No+Image&bg=eee';
  return path;
}

export default function ProductCard({ product, inCartQty, tiers }) {
  const { setQty, addToCart } = useCart();
  const { openModal } = useModal();

  const tiersArr = tiers || product.tiers || [];
  const oos = Number(product.in_stock === undefined ? product.stock_total : product.in_stock ? 1 : 0) <= 0;
  const hasTiers = tiersArr.length > 0;
  const unitText = unitConvText(product) || product.secondary_unit || 'Piece';
  const hasDisc = product.has_discount;

  const open = () => openModal({
    ...product,
    tiers: tiersArr,
    in_cart: inCartQty || 0,
  });

  return (
    <div className="col-4 col-md-3 col-lg-2 mb-2 px-1">
      <div className={`shop-card ${oos ? 'opacity-75' : ''}`} onClick={open}>
        <div className="shop-card-img-wrapper">
          {product.is_flash && !oos && <div className="shop-card-badge text-danger">⚡ FLASH</div>}
          {!product.is_flash && hasDisc && !oos && <div className="shop-card-badge text-success">{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF</div>}
          <div className="shop-card-gallery">
            <img src={imageSrc(product.image_url)} alt={product.name} loading="lazy" />
          </div>
        </div>
        <div className="shop-card-body">
          {product.is_flash && <div className="shop-card-time"><i className="bi bi-graph-down-arrow text-danger"></i> Price Drop</div>}
          <div className="shop-card-title">{product.name}</div>
          <div className="shop-card-meta">{unitText}</div>
          {hasTiers && <div className="save-more-pill"><i className="bi bi-tags-fill text-warning"></i> Bulk Offers</div>}
          <div className="mt-auto pt-1">
            <div className="lh-1 mb-2">
              <span className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>₹{Number(product.price).toFixed(2)}</span>
              {hasDisc && <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: '0.6rem' }}>₹{Number(product.mrp).toFixed(2)}</span>}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              {!oos ? (
                inCartQty > 0 ? (
                  <div className="cart-stepper shadow-sm">
                    <button className="step-btn text-danger" onClick={() => setQty(product.id, inCartQty - 1)}>-</button>
                    <input
                      type="number"
                      className="cart-input"
                      value={inCartQty}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => setQty(product.id, e.target.value)}
                    />
                    <button className="step-btn text-success" onClick={() => setQty(product.id, inCartQty + 1)}>+</button>
                  </div>
                ) : (
                  <button className="shop-card-btn shadow-sm" onClick={() => addToCart(product.id, 1)}>ADD</button>
                )
              ) : (
                <div className="shop-card-btn bg-light text-danger border-danger">OOS</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}