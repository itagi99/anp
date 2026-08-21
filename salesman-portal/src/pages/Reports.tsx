import React, { useEffect, useState } from 'react';
import { getReports } from '../api/salesman';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await getReports();
        setData(d);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="center muted" style={{ marginTop: 40 }}>Loading…</div>;
  if (!data) return <div className="center error-text" style={{ marginTop: 40 }}>Failed to load</div>;

  const monthly = data.monthly || { orders: 0, sales: 0 };
  const target = data.target;
  const daily = data.daily || [];
  const attendance = data.attendance || [];
  const achievement = target && Number(target.target_amount) > 0
    ? Math.round((Number(monthly.sales) / Number(target.target_amount)) * 1000) / 10
    : 0;

  return (
    <div>
      <div className="metric-grid">
        <div className="metric">
          <div className="label">Month Orders</div>
          <div className="value">{monthly.orders}</div>
        </div>
        <div className="metric">
          <div className="label">Month Sales</div>
          <div className="value">₹{Number(monthly.sales || 0).toFixed(0)}</div>
        </div>
      </div>

      {target && (
        <div className="card">
          <h2>Target Achievement</h2>
          <div className="muted">{achievement}% · ₹{Number(monthly.sales || 0).toFixed(0)} / ₹{Number(target.target_amount || 0).toFixed(0)}</div>
          <div style={{ background: '#eee', borderRadius: 8, height: 10, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, achievement)}%`, background: 'var(--primary)', height: '100%' }} />
          </div>
        </div>
      )}

      <div className="card">
        <h2>Daily Sales (This Month)</h2>
        {daily.length === 0 ? (
          <div className="muted">No sales yet</div>
        ) : (
          daily.map((d: any) => (
            <div className="list-item" key={d.day}>
              <div className="title">{d.day}</div>
              <div className="meta">{d.orders} orders</div>
              <div className="value" style={{ fontSize: 15 }}>₹{Number(d.sales || 0).toFixed(0)}</div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>Attendance (This Month)</h2>
        {attendance.length === 0 ? (
          <div className="muted">No attendance records</div>
        ) : (
          attendance.map((a: any) => (
            <div className="list-item" key={a.attendance_date}>
              <div className="title">{a.attendance_date}</div>
              <div className="meta">{a.punch_in_time || '—'} → {a.punch_out_time || '—'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
