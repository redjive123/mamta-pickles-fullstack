import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalAmount,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 599;
  const progressPercent = Math.min(100, Math.round((itemsPrice / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - itemsPrice);

  return (
    <div className="modal-overlay" style={{ padding: 0 }} onClick={() => setIsCartOpen(false)}>
      <div
        className="animate-slide"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#ffffff',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1100,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e0d8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b18' }}>Your Pickle Basket</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', padding: 4, color: '#8c8275' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ backgroundColor: '#fef3c7', padding: '12px 24px', borderBottom: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: '#b45309', marginBottom: 6 }}>
            <Truck size={16} />
            {amountNeeded > 0
              ? `Add ₹${amountNeeded} more to unlock FREE Shipping!`
              : '🎉 You have unlocked FREE Express Delivery!'}
          </div>
          <div style={{ height: 6, backgroundColor: '#fde68a', borderRadius: 9999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#d97706',
                borderRadius: 9999,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🫙</div>
              <h4 style={{ fontSize: '1.1rem', color: '#1e1b18', marginBottom: 6 }}>Your Basket is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: '#655d54', marginBottom: 20 }}>
                Explore our traditional pickles and add authentic homemade flavors to your cart!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-outline"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Browse Pickles
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: '#faf7f2',
                  border: '1px solid #e5e0d8',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b18', lineHeight: 1.2 }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        style={{ background: 'none', color: '#dc2626', padding: 2 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>
                      Jar Size: {item.weight}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b18' }}>
                      ₹{item.price * item.qty}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e5e0d8', borderRadius: 6 }}>
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        style={{ padding: '4px 8px', background: 'none', color: '#1e1b18' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        style={{ padding: '4px 8px', background: 'none', color: '#1e1b18' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid #e5e0d8', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#655d54' }}>
                <span>Subtotal</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#655d54' }}>
                <span>GST (5%)</span>
                <span>₹{taxPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#655d54' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#1e1b18', borderTop: '1px dashed #e5e0d8', paddingTop: 8 }}>
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
