import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, token } = useAuth();
  const navigate = useNavigate();
  const [employee_id, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token) {
    navigate('/dashboard', { replace: true });
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!employee_id || !password) {
      setError('Employee ID and password are required');
      return;
    }
    setBusy(true);
    try {
      await login(employee_id.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="mark">AnpMart</div>
          <div className="muted">Salesman Portal</div>
        </div>
        {error && <div className="error-text">{error}</div>}
        <form onSubmit={submit}>
          <label className="label-text">Employee ID</label>
          <input
            className="input"
            placeholder="e.g. SAL01"
            value={employee_id}
            onChange={(e) => setEmployeeId(e.target.value)}
            autoCapitalize="characters"
          />
          <label className="label-text">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit" disabled={busy || loading}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="muted center" style={{ marginTop: 14 }}>
          Use your assigned employee ID and password.
        </div>
      </div>
    </div>
  );
}
