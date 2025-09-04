import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page allowing user authentication via email/password. */
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-title"><span className="dot" /> RBAC Admin</div>
        <div className="login-sub">Sign in to manage users, roles and permissions</div>
        {err && <div className="chip" style={{ background:'#fde8e8', color:'#7f1d1d', borderColor:'#fecaca', marginBottom:12 }}>{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="col-12">
              <div className="label">Email</div>
              <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <div className="form-row">
            <div className="col-12">
              <div className="label">Password</div>
              <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <button className="btn primary" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign In'}</button>
            <span className="chip accent">Admin Console</span>
          </div>
        </form>
      </div>
    </div>
  );
}
