import React, { useEffect, useState } from 'react';
import { getOrders, getOrderDetail } from '../api/salesman';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await getOrders();
        setOrders(d.orders || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDetail = async (id: string) => {
    try {
      const d = await getOrderDetail(id);
      setSelected(d.order);
    } catch {
      setSelected({ error: true });
    }
  };

  return (
    <div>
      {loading ? (
        <div className="center muted" style={{ marginTop: 30 }}>Loading…</div>
      ) : orders.length === 0 ? (
        <div className="center muted" style={{ marginTop: 30 }}>No orders yet</div>
      ) : (
        orders.map((o) => (
          <div className="card" key={o.id} style={{ padding: 14 }} onClick={() => openDetail(o.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="title">{o.customer_name || o.customer_id}</div>
                <div className="meta">{o.id}</div>
                <div className="meta">{formatDate(o.order_date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="value" style={{ fontSize: 18 }}>₹{Number(o.total_amount || 0).toFixed(0)}</div>
                <span className="badge">{o.status}</span>
              </div>
            </div>
          </div>
        ))
      )}

      {selected && (
        <div className="card" style={{ position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)', maxWidth: 452, width: 'calc(100% - 32px)', zIndex: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>Order Detail</h2>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '4px 10px', fontSize: 13 }} onClick={() => setSelected(null)}>Close</button>
          </div>
          {selected.error ? (
            <div className="error-text">Failed to load detail</div>
          ) : (
            <>
              <div className="meta">Customer: {selected.customer_name} ({selected.customer_phone})</div>
              <div className="meta">{selected.id} · {formatDate(selected.order_date)}</div>
              <div className="meta">Status: {selected.status} · Total: ₹{Number(selected.total_amount || 0).toFixed(2)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(s: string) {
  if (!s) return '';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}
