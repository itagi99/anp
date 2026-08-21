import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome back!');
      navigate(params.get('redirect') || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', minHeight: '100vh', background: 'linear-gradient(160deg, var(--primary) 0%, #064e3b 100%)' }}>
      <div style={{ textAlign: 'center', color: '#fff', marginBottom: 28 }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-1px' }}>ANP MART</div>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' }}>Wholesale Grocery Store</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 20 }}>Log in to continue shopping</p>

        {error && <div className="toast-err">{error}</div>}

        <form onSubmit={submit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-pay" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <div className="spinner" style={{ borderColor: '#fff', borderTopColor: 'transparent' }}></div> : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, fontWeight: 700, color: 'var(--text-sec)' }}>
          New to ANP MART? <Link to="/register" style={{ color: 'var(--primary)' }}>Create account</Link>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link to="/" style={{ color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'underline' }}>Continue as guest</Link>
      </div>
    </div>
  );
}