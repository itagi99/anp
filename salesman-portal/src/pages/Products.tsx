import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts, createOrder } from '../api/salesman';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const state: any = location.state || {};
  const customer_id = state.customer_id;
  const customer_name = state.customer_name;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const d = await getProducts(search || undefined);
        setProducts(d.products || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const cur = (next[id] || 0) + delta;
      if (cur <= 0) delete next[id];
      else next[id] = cur;
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const submitOrder = async () => {
    setError('');
    if (!customer_id) {
      setError('Select a customer first from the Customers tab.');
      return;
    }
    const items = Object.entries(cart).map(([product_id, quantity]) => {
      const p = products.find((x) => x.id === product_id);
      return { product_id, quantity, unit_price: p.price };
    });
    if (!items.length) {
      setError('Add at least one product.');
      return;
    }
    try {
      const res = await createOrder(customer_id, items);
      navigate('/orders');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Order failed');
    }
  };

  return (
    <div>
      {customer_name && (
        <div className="card" style={{ padding: 12 }}>
          <div className="muted">Ordering for</div>
          <div className="title">{customer_name}</div>
        </div>
      )}
      {!customer_id && (
        <div className="card" style={{ padding: 12, borderColor: '#f59e0b' }}>
          <div className="muted">No customer selected. Visit <b>Customers</b> and tap <b>Order</b> to attach this order.</div>
        </div>
      )}

      <input className="input" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
      {error && <div className="error-text">{error}</div>}

      {loading ? (
        <div className="center muted" style={{ marginTop: 20 }}>Loading…</div>
      ) : (
        products.map((p) => (
          <div className="card" key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12 }}>
            {p.image_url ? <img className="product-img" src={p.image_url} alt="" /> : <div className="product-img" />}
            <div style={{ flex: 1 }}>
              <div className="title">{p.name}</div>
              <div className="meta">{p.brand} · {p.category}</div>
              <div className="meta">₹{Number(p.price).toFixed(2)} / {p.primary_unit} · Stock: {p.stock_total}</div>
            </div>
            <div className="stepper">
              {cart[p.id] ? (
                <>
                  <button onClick={() => changeQty(p.id, -1)}>−</button>
                  <span className="qty">{cart[p.id]}</span>
                  <button onClick={() => changeQty(p.id, 1)}>+</button>
                </>
              ) : (
                <button onClick={() => changeQty(p.id, 1)}>＋</button>
              )}
            </div>
          </div>
        ))
      )}

      {cartCount > 0 && (
        <button className="btn" style={{ position: 'fixed', bottom: 70, maxWidth: 452, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)' }} onClick={submitOrder}>
          Submit Order ({cartCount} items)
        </button>
      )}
    </div>
  );
}
