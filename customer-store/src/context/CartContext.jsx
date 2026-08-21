import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

// Best tier that applies at qty
export function bestTier(tiers, qty) {
  let best = null;
  (tiers || []).forEach((t) => {
    if (qty >= Number(t.min) && (!best || Number(t.min) > Number(best.min))) best = t;
  });
  return best;
}

// Effective unit price after flash + tier discount
export function effectiveUnitPrice(unitPrice, tier) {
  if (!tier) return unitPrice;
  const value = Number(tier.value);
  const disc = tier.type === 'amount' ? value : unitPrice * (value / 100.0);
  return Math.max(0, Math.round((unitPrice - disc) * 100) / 100);
}

// Apply tier discount text
export function tierLabel(t) {
  return t.type === 'amount' ? `₹${Number(t.value)} OFF` : `${Number(t.value)}% OFF`;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('anpmart_cart')) || {};
    } catch {
      return {};
    }
  });

  const [flashMap, setFlashMap] = useState({});

  useEffect(() => {
    localStorage.setItem('anpmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    api.get('/store/offers')
      .catch(() => ({}))
      .then(() => {});
    api.get('/store/home')
      .then(({ data }) => {
        const map = {};
        const collect = (arr) => (arr || []).forEach((p) => {
          if (p.is_flash) map[p.id] = { flash_price: p.price };
        });
        collect(data.flash_deals);
        collect(data.deal_of_day);
        setFlashMap(map);
      })
      .catch(() => {});
  }, []);

  const setQty = (productId, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      const n = Math.max(0, Number(qty) || 0);
      if (n <= 0) delete next[productId];
      else next[productId] = n;
      return next;
    });
  };

  const addToCart = (productId, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      next[productId] = Math.max(1, Number(qty) || 1);
      return next;
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // Cart lines enriched with product data passed in
  const buildLines = (products) => {
    return Object.entries(cart).map(([pid, qty]) => {
      const p = products.find((pr) => String(pr.id) === String(pid));
      if (!p) return null;
      const flash = flashMap[pid];
      const unitPrice = flash ? Number(flash.flash_price) : Number(p.price);
      const tier = bestTier(p.tiers, qty);
      const effRate = effectiveUnitPrice(unitPrice, tier);
      const subtotal = Math.round(effRate * qty * 100) / 100;
      return {
        ...p,
        product_id: p.id,
        base_qty: qty,
        is_flash: !!flash,
        tier,
        eff_rate: effRate,
        subtotal,
      };
    }).filter(Boolean);
  };

  const value = useMemo(() => ({
    cart,
    setQty,
    addToCart,
    removeItem,
    clearCart,
    totalItems,
    buildLines,
    flashMap,
  }), [cart, totalItems, flashMap]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}