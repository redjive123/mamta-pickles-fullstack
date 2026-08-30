import React, { useState } from 'react';
import { ShoppingBag, User, Search, PackageCheck, LogOut, Flame, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ search, setSearch, onOpenOrders, onOpenAdmin }) => {
  const { user, openAuthModal, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e0d8',
      }}
    >
      {/* Top Banner Notice */}
      <div
        style={{
          backgroundColor: '#d97706',
          color: '#ffffff',
          textAlign: 'center',
          padding: '6px 12px',
          fontSize: '0.82rem',
          fontWeight: 600,
          letterSpacing: '0.3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Flame size={15} /> Free All-India Express Shipping on Orders Above ₹599! Code: <b>FREESHIP</b>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              border: '2px solid #d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            🫙
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e1b18', margin: 0, lineHeight: 1.1 }}>
              Mamta Pickles
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Homemade with Love
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: 440, margin: '0 24px', position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8c8275' }}
          />
          <input
            type="text"
            placeholder="Search Mango, Chili, Garlic Pickles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: 9999,
              border: '1px solid #e5e0d8',
              backgroundColor: '#faf7f2',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Admin Panel Button */}
          {user && user.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem', backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}
            >
              <Shield size={16} /> Admin Panel
            </button>
          )}

          {/* Order History */}
          {user && (
            <button
              onClick={onOpenOrders}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <PackageCheck size={16} /> My Orders
            </button>
          )}

          {/* User Account */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#b45309',
                }}
              >
                <User size={16} />
                <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </button>

              {showUserDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 170,
                    zIndex: 10,
                    border: '1px solid #e5e0d8',
                  }}
                >
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAdmin();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        background: 'none',
                        borderRadius: 6,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#b45309',
                        fontWeight: 700,
                      }}
                    >
                      <Shield size={14} /> Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenOrders();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      borderRadius: 6,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <PackageCheck size={14} /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      borderRadius: 6,
                      fontSize: '0.85rem',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.88rem' }}
            >
              <User size={16} /> Sign In
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{ position: 'relative', padding: '8px 16px' }}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {totalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
