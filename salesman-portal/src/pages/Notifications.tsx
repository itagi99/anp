import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api/salesman';

export default function Notifications() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await getNotifications();
        setItems(d.notifications || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="center muted" style={{ marginTop: 30 }}>Loading…</div>
      ) : items.length === 0 ? (
        <div className="center muted" style={{ marginTop: 30 }}>No notifications</div>
      ) : (
        items.map((n, i) => (
          <div className="card" key={n.id || i} style={{ padding: 14 }}>
            <div className="title">{n.title || 'Notification'}</div>
            <div className="meta" style={{ marginTop: 4 }}>{n.message || n.body || ''}</div>
            {n.created_at && <div className="meta" style={{ marginTop: 4 }}>{n.created_at}</div>}
          </div>
        ))
      )}
    </div>
  );
}
