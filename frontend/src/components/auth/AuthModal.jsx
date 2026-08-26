import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ onShowToast }) => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
        onShowToast('Successfully logged in!');
      } else {
        await register(name, email, password);
        onShowToast('Account created successfully! Welcome to Mamta Pickles.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, padding: 32 }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            color: '#8c8275',
          }}
        >
          <X size={20} />
        </button>

        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>🫙</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b18' }}>
            {authMode === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#655d54' }}>
            {authMode === 'login'
              ? 'Sign in to access your saved orders & quick checkout'
              : 'Join Mamta Pickles family for exclusive discounts'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#faf7f2', padding: 4, borderRadius: 10, marginBottom: 20, border: '1px solid #e5e0d8' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#1e1b18' : '#8c8275',
              boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#1e1b18' : '#8c8275',
              boxShadow: authMode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {authMode === 'register' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8c8275' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: 8,
                    border: '1px solid #e5e0d8',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8c8275' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: 8,
                  border: '1px solid #e5e0d8',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8c8275' }} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: 8,
                  border: '1px solid #e5e0d8',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 8, fontSize: '0.95rem' }}
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
