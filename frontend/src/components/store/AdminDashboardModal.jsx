import React, { useState, useEffect } from 'react';
import { X, Shield, Package, TrendingUp, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminDashboardModal = ({ isOpen, onClose, onShowToast }) => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAllOrders(token);
      setOrders(data);
    } catch (err) {
      onShowToast(err.message || 'Failed to load admin orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token && user?.role === 'admin') {
      fetchAllOrders();
    }
  }, [isOpen, token, user]);

  if (!isOpen) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus }, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      onShowToast(`Order #${orderId} status updated to "${newStatus}"!`);
    } catch (err) {
      onShowToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handlePaymentToggle = async (orderId, currentPaid) => {
    try {
      await api.updateOrderStatus(orderId, { isPaid: !currentPaid }, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isPaid: !currentPaid } : o))
      );
      onShowToast(`Order #${orderId} payment marked as ${!currentPaid ? 'Paid' : 'Unpaid'}`);
    } catch (err) {
      onShowToast('Failed to update payment status', 'error');
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 960, padding: 32 }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', color: '#8c8275' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                padding: 10,
                borderRadius: 12,
                display: 'flex',
              }}
            >
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b18', margin: 0 }}>
                Store Admin Dashboard
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#655d54', margin: 0 }}>
                Manage all customer pickle orders, track revenue & update fulfillment statuses
              </p>
            </div>
          </div>

          <button
            onClick={fetchAllOrders}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              TOTAL REVENUE
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400e' }}>
              ₹{totalRevenue}
            </div>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              TOTAL ORDERS
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534' }}>
              {orders.length}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 12, padding: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              PENDING FULFILLMENT
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9a3412' }}>
              {pendingCount}
            </div>
          </div>

          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              DELIVERED ORDERS
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#075985' }}>
              {deliveredCount}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b18', marginBottom: 12 }}>
          Customer Orders List ({orders.length})
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#655d54' }}>Loading customer orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#655d54' }}>
            No orders placed yet.
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #e5e0d8', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#faf7f2', borderBottom: '1px solid #e5e0d8', color: '#655d54' }}>
                  <th style={{ padding: '12px 14px' }}>Order ID & Customer</th>
                  <th style={{ padding: '12px 14px' }}>Items & Jars</th>
                  <th style={{ padding: '12px 14px' }}>Amount</th>
                  <th style={{ padding: '12px 14px' }}>Payment</th>
                  <th style={{ padding: '12px 14px' }}>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f3ece1' }}>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <strong style={{ color: '#1e1b18', display: 'block' }}>#{o._id}</strong>
                      <span style={{ color: '#655d54' }}>{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</span>
                      <div style={{ fontSize: '0.75rem', color: '#8c8275' }}>
                        {o.shippingAddress?.city}, {o.shippingAddress?.phone}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      {o.orderItems?.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', marginBottom: 2 }}>
                          • {item.name} ({item.weight}) x{item.qty}
                        </div>
                      ))}
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'top', fontWeight: 800, color: '#1e1b18' }}>
                      ₹{o.totalAmount}
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <button
                        onClick={() => handlePaymentToggle(o._id, o.isPaid)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 9999,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: o.isPaid ? '#dcfce7' : '#fee2e2',
                          color: o.isPaid ? '#16a34a' : '#dc2626',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {o.isPaid ? '✓ Paid' : 'Pending Pay'}
                      </button>
                      <div style={{ fontSize: '0.72rem', color: '#8c8275', marginTop: 4 }}>
                        Via {o.paymentMethod || 'Razorpay'}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <select
                        value={o.orderStatus || 'Pending'}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          border: '1px solid #e5e0d8',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          color: '#1e1b18',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
