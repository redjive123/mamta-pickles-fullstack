import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      api.getMyOrders(token)
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 620, padding: 28 }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', color: '#8c8275' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Package size={24} style={{ color: '#d97706' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b18' }}>My Pickle Orders</h2>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#655d54' }}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#655d54' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>No Previous Orders Found</p>
            <p style={{ fontSize: '0.85rem' }}>Place your first order to track shipments here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 440, overflowY: 'auto' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  border: '1px solid #e5e0d8',
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: '#faf7f2',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: '#1e1b18' }}>Order #{order._id}</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: order.isPaid ? '#dcfce7' : '#fef3c7',
                      color: order.isPaid ? '#16a34a' : '#b45309',
                    }}
                  >
                    {order.isPaid ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#8c8275', marginBottom: 12 }}>
                  Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                <div style={{ borderTop: '1px solid #e5e0d8', paddingTop: 10, marginBottom: 10 }}>
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                      <span>{item.name} ({item.weight}) x {item.qty}</span>
                      <strong style={{ color: '#1e1b18' }}>₹{item.price * item.qty}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e5e0d8', paddingTop: 8, fontSize: '0.9rem', fontWeight: 800 }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#d97706' }}>₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
