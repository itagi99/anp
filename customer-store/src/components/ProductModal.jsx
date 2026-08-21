import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart, effectiveUnitPrice, tierLabel } from '../context/CartContext.jsx';
import { unitConvText, imageSrc } from './ProductCard.jsx';

const ModalContext = createContext(null);

export function useModal() {
  return useContext(ModalContext);
}

export function ProductModalProvider({ children }) {
  const [product, setProduct] = useState(null);

  const openModal = (p) => setProduct(p);
  const closeModal = () => setProduct(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {product && <ProductModal product={product} onClose={closeModal} />}
    </ModalContext.Provider>
  );
}

function ProductModal({ product, onClose }) {
  const { cart, addToCart } = useCart();
  const inCart = Number(product.in_cart) || 0;
  const [qty, setQty] = useState(Math.max(1, inCart || 1));

  const price = Number(product.price);
  const mrp = Number(product.mrp);
  const conv = Math.max(1, Number(product.unit_conversion) || 1);
  const secUnit = product.secondary_unit || 'Piece';
  const priUnit = product.primary_unit || 'Box';
  const tiers = product.tiers || [];
  const oos = Number(product.in_stock ?? (product.stock_total ?? 0)) <= 0;

  const showConv = conv > 1 && priUnit !== secUnit;
  const unitDisplay = showConv ? `1 ${priUnit} = ${conv} ${secUnit}` : secUnit;

  // Auto-calc with tier logic
  const applyTier = (q) => {
    let best = null;
    [...tiers].sort((a, b) => Number(b.min) - Number(a.min)).forEach((t) => {
      if (q >= Number(t.min) && !best) best = t;
    });
    return best;
  };
  const tier = applyTier(qty);
  const unitPrice = effectiveUnitPrice(price, tier);
  const totalSec = qty * conv;
  const totalPrice = unitPrice * qty;

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div className="product-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '16px' }} onClick={onClose}>✕</button>
        </div>
        <div className="modal-img-container">
          <img src={imageSrc(product.image_url)} alt={product.name} />
        </div>
        <div className="modal-title-text">{product.name}</div>
        <div className="modal-meta-text">{unitDisplay}</div>

        {tiers.length > 0 && (
          <div className="tier-list-box">
            <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-tags-fill text-warning"></i> Bulk Offers Available
            </div>
            {tiers.map((t, i) => (
              <div className="tier-list-row" key={i}>
                <span>Buy {t.min} or more</span>
                <span>{tierLabel(t)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer-actions align-items-start flex-column">
          <div className="d-flex justify-content-between w-100 mb-3">
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: '1.3rem' }}>₹{totalPrice.toFixed(2)}</div>
              {tier && (
                <div className="text-success fw-bold mt-1" style={{ fontSize: '0.8rem' }}>
                  @ ₹{unitPrice.toFixed(2)} / {secUnit} (bulk)
                </div>
              )}
              {showConv && qty > 0 && (
                <div className="text-success fw-bold mt-1" style={{ fontSize: '0.8rem' }}>
                  Total you get: {conv === Math.floor(conv) ? totalSec.toFixed(0) : totalSec.toFixed(2)} {secUnit}s
                </div>
              )}
            </div>
          </div>

          {!oos ? (
            <div className="d-flex gap-2 w-100">
              <div className="cart-stepper shadow-sm" style={{ height: '38px', width: '120px', borderColor: '#e2e8f0', flexShrink: 0 }}>
                <button className="step-btn text-danger bg-light" style={{ width: '35px', fontSize: '1.4rem' }} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <input
                  type="number"
                  className="cart-input fs-5 w-100"
                  value={qty}
                  onClick={(e) => e.target.select()}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button className="step-btn text-success bg-light" style={{ width: '35px', fontSize: '1.4rem' }} onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button
                className="shop-card-btn w-100 py-3 text-white"
                style={{ background: '#0c831f' }}
                onClick={() => { addToCart(product.id, qty); onClose(); }}
              >
                {inCart > 0 ? 'UPDATE CART' : 'ADD TO CART'} • ₹{totalPrice.toFixed(2)}
              </button>
            </div>
          ) : (
            <div className="shop-card-btn bg-light text-danger border-danger px-3 py-2 w-100">OUT OF STOCK</div>
          )}
        </div>
      </div>
    </div>
  );
}