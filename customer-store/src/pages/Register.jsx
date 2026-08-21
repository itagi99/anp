import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim() || null, password });
      showToast('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
        <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Create account</h1>
        <p style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 20 }}>Join ANP MART for wholesale prices</p>

        {error && <div className="toast-err">{error}</div>}

        <form onSubmit={submit}>
          <div className="input-group">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-pay" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <div className="spinner" style={{ borderColor: '#fff', borderTopColor: 'transparent' }}></div> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, fontWeight: 700, color: 'var(--text-sec)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}