import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { to: '/dashboard', icon: '🏠', label: 'Home' },
  { to: '/customers', icon: '👥', label: 'Customers' },
  { to: '/products', icon: '📦', label: 'Products' },
  { to: '/orders', icon: '🧾', label: 'Orders' },
  { to: '/reports', icon: '📊', label: 'Reports' },
  { to: '/attendance', icon: '⏰', label: 'Attend' },
  { to: '/notifications', icon: '🔔', label: 'Alerts' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>AnpMart Salesman</h1>
            <div className="sub">{user ? `${user.name} · ${user.employee_id}` : 'Field Sales'}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="app-content">{children}</main>
      <nav className="bottom-nav">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
