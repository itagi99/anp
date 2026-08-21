import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { imageSrc } from '../components/ProductCard.jsx';
import { useToast } from '../components/Toast.jsx';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=' + encodeURIComponent(`/orders/${id}`));
      return;
    }
    load();
  }, [token, id]);

  const cancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      showToast('Order cancelled');
      load();
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div>Loading order...</div>;
  if (!order) return <div className="empty-state"><i className="bi bi-bag-x"></i><p style={{ marginTop: 10, fontWeight: 700 }}>Order not found</p><Link to="/orders" className="btn btn-primary" style={{ marginTop: 12 }}>Back to Orders</Link></div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);
  const dateStr = (iso) => {
    try {
      return new Date(iso.replace(' ', 'T')).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div>
      <header className="header">
        <Link to="/orders" style={{ fontSize: 22, color: 'var(--text-sec)' }}><i className="bi bi-arrow-left"></i></Link>
        <h1 style={{ fontSize: 16, fontWeight: 800 }}>Order Details</h1>
        <span style={{ width: 22 }}></span>
      </header>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>{order.id}</div>
          <span className={`order-status ${order.status}`}>{order.status.replace(/_/g, ' ')}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-sec)', fontWeight: 600 }}>Placed on {dateStr(order.created_at)}</div>

        {!canCancel && stepIdx >= 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{ textAlign: 'center', width: '20%' }}>
                  <div style={{
                    width: 22, height: 22, margin: '0 auto 4px', borderRadius: '50%',
                    background: i <= stepIdx ? 'var(--primary)' : '#e2e8f0',
                    color: i <= stepIdx ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`bi ${i < stepIdx ? 'bi-check' : i === stepIdx ? 'bi-circle-fill' : 'bi-circle'}`} style={{ fontSize: 10 }}></i>
                  </div>
                  <div style={{ fontSize: 7, fontWeight: 700, color: i <= stepIdx ? 'var(--primary)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    {s === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : s.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-box-seam"></i> Items</div>
        {order.items?.map((it) => (
          <div className="item-row" key={it.id}>
            <img className="item-img" style={{ width: 48, height: 48 }} src={imageSrc(it.image_urls?.[0])} alt="" />
            <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="item-name" style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
              <div className="item-meta" style={{ fontSize: 11, color: 'var(--text-sec)' }}>Qty: {it.quantity} × ₹{Number(it.unit_price).toFixed(2)}</div>
            </div>
            <div className="item-price" style={{ fontSize: 13, fontWeight: 800 }}>₹{Number(it.total_price).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-geo-alt"></i> Delivery Address</div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{order.delivery_address || `${order.street_address || ''}, ${order.city || ''}, ${order.state || ''} - ${order.postal_code || ''}`.replace(/^,\s*|,\s*$/g, '')}</div>
        {order.payment_method === 'COD' ? (
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: '#b45309', background: '#fffbeb', padding: '8px 10px', borderRadius: 8 }}>
            <i className="bi bi-cash-coin me-1"></i> Pay ₹{Number(order.total).toFixed(2)} in cash at delivery
          </div>
        ) : (
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: '#f0fdf4', padding: '8px 10px', borderRadius: 8 }}>
            <i className="bi bi-check-circle me-1"></i> Paid via {order.payment_method} · {order.payment_status}
          </div>
        )}
      </div>

      <div className="card">
        <div className="section-title"><i className="bi bi-receipt"></i> Bill Details</div>
        <div className="bill-row"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
        {Number(order.discount) > 0 && <div className="bill-row"><span>Discount</span><span style={{ color: 'var(--primary)' }}>- ₹{Number(order.discount).toFixed(2)}</span></div>}
        <div className="bill-row"><span>Delivery Charges</span><span>{Number(order.delivery_charge) > 0 ? `₹${Number(order.delivery_charge).toFixed(2)}` : 'FREE'}</span></div>
        <div className="bill-row total"><span>Total</span><span>₹{Number(order.total).toFixed(2)}</span></div>
      </div>

      {canCancel && (
        <div style={{ padding: '12px 16px' }}>
          <button className="btn btn-outline btn-block" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={cancel} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}

      <div style={{ height: 30 }}></div>
    </div>
  );
}