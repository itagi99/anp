import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { imageSrc } from '../components/ProductCard.jsx';

export default function Orders() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/orders');
      return;
    }
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const dateStr = (iso) => {
    try {
      return new Date(iso.replace(' ', 'T')).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div>
      <header className="header">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>My Orders</h1>
          <div style={{ fontSize: 12, color: 'var(--text-sec)', fontWeight: 600 }}>{user?.name}</div>
        </div>
        <Link to="/" style={{ fontSize: 22, color: 'var(--text-sec)' }}><i className="bi bi-house"></i></Link>
      </header>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-bag-x"></i>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '12px 0 4px' }}>No orders yet</h2>
          <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>Your orders will appear here once you shop.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</Link>
        </div>
      ) : (
        orders.map((o) => {
          const first = o.items?.[0];
          const rest = (o.items?.length || 0) - 1;
          return (
            <Link key={o.id} to={`/orders/${o.id}`} style={{ display: 'block' }}>
              <div className="order-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)' }}>
                    {o.id} <span style={{ marginLeft: 6 }}>{dateStr(o.created_at)}</span>
                  </div>
                  <span className={`order-status ${o.status}`}>{o.status.replace(/_/g, ' ')}</span>
                </div>
                {first && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <img src={imageSrc(first.image_urls?.[0])} alt="" style={{ width: 56, height: 56, objectFit: 'contain', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{first.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-sec)', fontWeight: 600 }}>Qty: {first.quantity}{rest > 0 ? ` + ${rest} more` : ''}</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)' }}>
                    {o.payment_method === 'COD' ? 'Cash on Delivery' : o.payment_method} · {o.payment_status}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900 }}>₹{Number(o.total).toFixed(2)}</div>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}