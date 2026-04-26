"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)', padding: '24px' }}>
      <div style={{ background: 'var(--dark-3)', padding: '48px', border: '1px solid rgba(201,168,76,0.2)', width: '100%', maxWidth: '400px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--gold), transparent)' }}></div>
        
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: 'var(--gold)', marginBottom: '24px', textAlign: 'center' }}>
          Admin Login
        </h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '12px 0', color: 'var(--text)', outline: 'none', fontFamily: "'Outfit', sans-serif" }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '12px 0', color: 'var(--text)', outline: 'none', fontFamily: "'Outfit', sans-serif" }}
              required
            />
          </div>
          
          {error && <p style={{ color: '#ff4444', fontSize: '12px', textAlign: 'center' }}>{error}</p>}
          
          <button 
            type="submit" 
            style={{ marginTop: '16px', width: '100%', padding: '16px', background: 'var(--gold)', border: 'none', color: 'var(--dark)', fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
