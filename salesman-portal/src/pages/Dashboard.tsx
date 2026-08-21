import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, punch } from '../api/salesman';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const d = await getDashboard();
      setData(d);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const doPunch = async (type: 'in' | 'out') => {
    setPunching(true);
    setMsg('');
    let lat: number | undefined;
    let lng: number | undefined;
    try {
      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
    } catch {
      // location optional
    }
    try {
      const res = await punch(type, lat, lng);
      setMsg(res.message || 'Done');
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Punch failed');
    } finally {
      setPunching(false);
    }
  };

  if (loading) return <div className="center muted" style={{ marginTop: 40 }}>Loading…</div>;
  if (!data) return <div className="center error-text" style={{ marginTop: 40 }}>Failed to load dashboard</div>;

  const isPunchedIn = data.is_punched_in;
  const todayStats = data.today_stats || { orders: 0, sales: 0 };
  const monthlyStats = data.monthly_stats || { orders: 0, sales: 0 };
  const target = data.target;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="muted">Hello, {user?.name}</div>
            <h2 style={{ margin: '2px 0 0' }}>Good {greet()}</h2>
          </div>
          <div className="badge">{data.day_of_week}</div>
        </div>

        <div style={{ marginTop: 14 }}>
          {!data.is_punched_in ? (
            <button className="btn" disabled={punching} onClick={() => doPunch('in')}>
              {punching ? 'Punching…' : '🟢 Punch In'}
            </button>
          ) : (
            <button className="btn btn-secondary" disabled={punching} onClick={() => doPunch('out')}>
              {punching ? 'Punching…' : '🔴 Punch Out'}
            </button>
          )}
          {msg && <div className="punch-status">{msg}</div>}
          {data.attendance && (
            <div className="punch-status">
              {data.attendance.punch_in_time ? `Punched in: ${data.attendance.punch_in_time}` : 'Not punched in yet'}
              {data.attendance.punch_out_time ? ` · Out: ${data.attendance.punch_out_time}` : ''}
            </div>
          )}
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <div className="label">Today's Orders</div>
          <div className="value">{todayStats.orders}</div>
        </div>
        <div className="metric">
          <div className="label">Today's Sales</div>
          <div className="value">₹{Number(todayStats.sales || 0).toFixed(0)}</div>
        </div>
        <div className="metric">
          <div className="label">Monthly Orders</div>
          <div className="value">{monthlyStats.orders}</div>
        </div>
        <div className="metric">
          <div className="label">Monthly Sales</div>
          <div className="value">₹{Number(monthlyStats.sales || 0).toFixed(0)}</div>
        </div>
      </div>

      {data.today_beat && (
        <div className="card">
          <h2>Today's Beat: {data.today_beat.name || data.today_beat.beat_name || 'Beat'}</h2>
          <div className="muted">{data.today_beat.total_customers} customers assigned</div>
          {(data.today_beat.customers || []).map((c: any) => (
            <div className="list-item" key={c.customer_id}>
              <div>
                <div className="title">{c.customer_name}</div>
                <div className="meta">{c.city || c.address || ''}</div>
              </div>
              {c.visited_today ? <span className="badge">Visited</span> : <span className="badge badge-gray">Pending</span>}
            </div>
          ))}
        </div>
      )}

      {target && (
        <div className="card">
          <h2>Monthly Target</h2>
          <div className="muted">Achievement: {data.achievement || 0}%</div>
          <div style={{ background: '#eee', borderRadius: 8, height: 10, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, data.achievement || 0)}%`, background: 'var(--primary)', height: '100%' }} />
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            ₹{Number(monthlyStats.sales || 0).toFixed(0)} / ₹{Number(target.target_amount || 0).toFixed(0)}
          </div>
        </div>
      )}

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="row">
          <button className="btn btn-secondary" onClick={() => navigate('/customers')}>View Customers</button>
          <button className="btn btn-secondary" onClick={() => navigate('/products')}>Take Order</button>
        </div>
      </div>
    </div>
  );
}

function greet() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
