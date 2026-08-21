import React, { useEffect, useState } from 'react';
import { getCustomers, getBeatCustomers } from '../api/salesman';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const [mode, setMode] = useState<'all' | 'beat'>('beat');
  const [customers, setCustomers] = useState<any[]>([]);
  const [beat, setBeat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (mode === 'all') {
          const d = await getCustomers();
          setCustomers(d.customers || []);
        } else {
          const d = await getBeatCustomers();
          setBeat(d.beat);
          setCustomers(d.customers || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [mode]);

  const filtered = customers.filter((c) =>
    (c.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_phone || '').includes(search)
  );

  return (
    <div>
      <div className="card" style={{ padding: 12 }}>
        <div className="row">
          <button className={`btn ${mode === 'beat' ? '' : 'btn-secondary'}`} style={{ fontSize: 13, padding: '8px' }} onClick={() => setMode('beat')}>Today's Beat</button>
          <button className={`btn ${mode === 'all' ? '' : 'btn-secondary'}`} style={{ fontSize: 13, padding: '8px' }} onClick={() => setMode('all')}>All Customers</button>
        </div>
        {mode === 'beat' && beat && (
          <div className="muted" style={{ marginTop: 8 }}>Beat: {beat.name || beat.beat_name || '—'}</div>
        )}
        <input className="input" style={{ marginTop: 10, marginBottom: 0 }} placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="center muted" style={{ marginTop: 30 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="center muted" style={{ marginTop: 30 }}>No customers found</div>
      ) : (
        filtered.map((c) => (
          <div className="card" key={c.customer_id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="title">{c.customer_name}</div>
                <div className="meta">{c.customer_phone || '—'}</div>
                <div className="meta">{[c.address, c.city, c.state].filter(Boolean).join(', ') || 'No address'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.visited_today ? <span className="badge">Visited</span> : <span className="badge badge-gray">Pending</span>}
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px' }} onClick={() => navigate('/products', { state: { customer_id: c.customer_id, customer_name: c.customer_name } })}>
                  Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
