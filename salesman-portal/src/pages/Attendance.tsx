import React, { useEffect, useState } from 'react';
import { getAttendance, punch } from '../api/salesman';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const d = await getAttendance();
      setRecords(d.attendance || []);
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
    } catch {}
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

  const today = records[0];
  const punchedIn = !!today && !!today.punch_in_time && !today.punch_out_time;

  return (
    <div>
      <div className="card">
        <h2>Attendance</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" disabled={punching || punchedIn} onClick={() => doPunch('in')}>
            {punching ? '…' : '🟢 Punch In'}
          </button>
          <button className="btn btn-secondary" disabled={punching || !punchedIn} onClick={() => doPunch('out')}>
            {punching ? '…' : '🔴 Punch Out'}
          </button>
        </div>
        {msg && <div className="punch-status">{msg}</div>}
        {today && (
          <div className="punch-status">
            Today: {today.attendance_date} {today.punch_in_time ? `In ${today.punch_in_time}` : '—'}
            {today.punch_out_time ? ` · Out ${today.punch_out_time}` : ''}
          </div>
        )}
      </div>

      <div className="card">
        <h2>History</h2>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : records.length === 0 ? (
          <div className="muted">No records</div>
        ) : (
          records.map((a) => (
            <div className="list-item" key={a.id || a.attendance_date}>
              <div>
                <div className="title">{a.attendance_date}</div>
                <div className="meta">{a.punch_in_time || '—'} → {a.punch_out_time || '—'}</div>
              </div>
              <span className={`badge ${a.punch_out_time ? '' : 'badge-gray'}`}>
                {a.punch_out_time ? 'Completed' : a.punch_in_time ? 'Open' : 'Absent'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
