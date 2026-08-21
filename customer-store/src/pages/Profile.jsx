import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const doLogout = () => {
    logout();
    showToast('Logged out');
    navigate('/');
  };

  const initials = (user?.name || '?').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <header className="header">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>Profile</h1>
        </div>
        <Link to="/" style={{ fontSize: 22, color: 'var(--text-sec)' }}><i className="bi bi-house"></i></Link>
      </header>

      {token ? (
        <>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #064e3b 100%)', padding: '24px 16px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, border: '2px solid #fff',
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{user.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>{user.email}</div>
                {user.phone && <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>{user.phone}</div>}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderBottom: '1px solid var(--border)' }}>
              <i className="bi bi-bag-check" style={{ fontSize: 20, color: 'var(--primary)', width: 28 }}></i>
              <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>My Orders</span>
              <i className="bi bi-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </Link>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderBottom: '1px solid var(--border)' }}>
              <i className="bi bi-cart3" style={{ fontSize: 20, color: 'var(--primary)', width: 28 }}></i>
              <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>My Cart</span>
              <i className="bi bi-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </Link>
            <Link to="/category" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
              <i className="bi bi-grid" style={{ fontSize: 20, color: 'var(--primary)', width: 28 }}></i>
              <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>Browse Categories</span>
              <i className="bi bi-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </Link>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <button className="btn btn-outline btn-block" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={doLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <i className="bi bi-person-circle"></i>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '12px 0 4px' }}>Not logged in</h2>
          <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>Log in to view orders and manage your account.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 16 }}>Login</Link>
          <div style={{ marginTop: 12 }}>
            <Link to="/register" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>Create account</Link>
          </div>
        </div>
      )}
    </div>
  );
}