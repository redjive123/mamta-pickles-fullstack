import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const CheckoutModal = ({ isOpen, onClose, onShowToast }) => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: '',
    address: '',
    city: '',
    state: 'Gujarat',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' | 'COD'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create order on backend first
      const orderPayload = {
        orderItems: cartItems.map((i) => ({
          name: i.name,
          qty: i.qty,
          weight: i.weight,
          price: i.price,
          image: i.image,
          product: i.product,
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalAmount,
        guestInfo: !user ? { name: formData.fullName, email: 'customer@mamtapickles.com' } : undefined,
      };

      const createdOrder = await api.createOrder(orderPayload, token);

      // 2. Handle Razorpay Online Payment Flow
      if (paymentMethod === 'Razorpay') {
        const razorpayOrder = await api.createRazorpayOrder(totalAmount);

        const options = {
          key: razorpayOrder.key || 'rzp_test_mamta_pickles_key',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'Mamta Pickles Store',
          description: `Payment for Order #${createdOrder._id}`,
          order_id: razorpayOrder.isSimulated ? undefined : razorpayOrder.id,
          handler: async function (response) {
            try {
              await api.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || razorpayOrder.id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'simulated_sig',
              });

              await api.updateOrderToPaid(createdOrder._id, {
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpayOrderId: response.razorpay_order_id || razorpayOrder.id,
              });

              clearCart();
              setOrderSuccess({ ...createdOrder, isPaid: true });
              onShowToast('Payment Successful! Your order has been placed.');
            } catch (err) {
              setError('Payment verification failed. Please contact support.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: formData.fullName,
            contact: formData.phone,
          },
          theme: {
            color: '#d97706',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setError('Payment cancelled. You can retry or choose Cash on Delivery.');
            },
          },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback simulation if Razorpay script is blocked
          setTimeout(async () => {
            await api.updateOrderToPaid(createdOrder._id, {
              razorpayPaymentId: `pay_sim_${Date.now()}`,
            });
            clearCart();
            setOrderSuccess({ ...createdOrder, isPaid: true });
            onShowToast('Simulated Payment Successful! Order placed.');
            setLoading(false);
          }, 1500);
        }
      } else {
        // 3. Cash on Delivery (COD) Flow
        clearCart();
        setOrderSuccess(createdOrder);
        onShowToast('Order placed successfully via Cash on Delivery!');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, padding: 32 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', color: '#8c8275' }}
        >
          <X size={20} />
        </button>

        {orderSuccess ? (
          /* Order Confirmation View */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={64} style={{ color: '#16a34a', marginBottom: 16 }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b18', marginBottom: 8 }}>
              Order Confirmed! 🎉
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#655d54', marginBottom: 20 }}>
              Thank you for choosing <strong>Mamta Pickles</strong>. Your delicious homemade pickles are being freshly packed with care!
            </p>

            <div
              style={{
                backgroundColor: '#faf7f2',
                border: '1px solid #e5e0d8',
                borderRadius: 12,
                padding: 20,
                textAlign: 'left',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                <span style={{ color: '#8c8275' }}>Order Reference:</span>
                <strong style={{ color: '#1e1b18' }}>#{orderSuccess._id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                <span style={{ color: '#8c8275' }}>Total Amount Paid:</span>
                <strong style={{ color: '#d97706' }}>₹{orderSuccess.totalAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#8c8275' }}>Payment Method:</span>
                <strong>{orderSuccess.paymentMethod} ({orderSuccess.isPaid ? 'Paid' : 'COD'})</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                onClose();
              }}
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b18', marginBottom: 4 }}>
              Delivery & Payment
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#655d54', marginBottom: 20 }}>
              Please enter your shipping address to complete your order.
            </p>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                  House / Flat / Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. 102, Shanti Kutir, CG Road"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Ahmedabad"
                    value={formData.city}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#655d54', display: 'block', marginBottom: 4 }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="380009"
                    value={formData.postalCode}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e0d8', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1b18', display: 'block', marginBottom: 8 }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay')}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: paymentMethod === 'Razorpay' ? '2px solid #d97706' : '1px solid #e5e0d8',
                      backgroundColor: paymentMethod === 'Razorpay' ? '#fef3c7' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left',
                    }}
                  >
                    <CreditCard size={20} style={{ color: '#d97706' }} />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e1b18' }}>Razorpay Online</div>
                      <div style={{ fontSize: '0.72rem', color: '#655d54' }}>UPI, Cards, NetBanking</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: paymentMethod === 'COD' ? '2px solid #d97706' : '1px solid #e5e0d8',
                      backgroundColor: paymentMethod === 'COD' ? '#fef3c7' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left',
                    }}
                  >
                    <Truck size={20} style={{ color: '#d97706' }} />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e1b18' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.72rem', color: '#655d54' }}>Pay upon jar delivery</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div style={{ backgroundColor: '#faf7f2', padding: 14, borderRadius: 10, border: '1px solid #e5e0d8', marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#655d54', marginBottom: 4 }}>
                  <span>Items Total ({cartItems.length} items)</span>
                  <span>₹{itemsPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#655d54', marginBottom: 4 }}>
                  <span>Shipping Fee</span>
                  <span>{shippingPrice === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingPrice}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#1e1b18', borderTop: '1px dashed #e5e0d8', paddingTop: 8, marginTop: 4 }}>
                  <span>Grand Total</span>
                  <span style={{ color: '#d97706' }}>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}
              >
                {loading ? 'Processing Order...' : `Pay ₹${totalAmount} via ${paymentMethod}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
