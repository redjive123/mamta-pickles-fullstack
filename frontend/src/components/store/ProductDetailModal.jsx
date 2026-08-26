import React, { useState, useEffect } from 'react';
import { X, Star, Flame, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductDetailModal = ({ product, onClose, onShowToast }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product?.weightOptions && product.weightOptions.length > 0
      ? product.weightOptions[0].weight
      : '250g'
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product?.weightOptions && product.weightOptions.length > 0) {
      setSelectedWeight(product.weightOptions[0].weight);
    } else {
      setSelectedWeight('250g');
    }
    setQty(1);
  }, [product]);

  if (!product) return null;

  const currentOption = product.weightOptions?.find((w) => w.weight === selectedWeight);
  const currentPrice = currentOption ? currentOption.price : (product.price || 0);

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, qty);
    onShowToast(`Added ${qty} jar(s) of "${product.name}" (${selectedWeight}) to cart!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 740, padding: 0 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Product Image */}
          <div style={{ backgroundColor: '#f9f6f0', position: 'relative', minHeight: 320 }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details Section */}
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-bestseller">{product.category} Pickle</span>
              <span className="badge badge-spicy"><Flame size={12} /> {product.spiceLevel}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b18', marginBottom: 8, lineHeight: 1.2 }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Star size={16} style={{ color: '#d97706', fill: '#d97706' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: '#8c8275' }}>({product.numReviews || 12} Verified Customer Reviews)</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#655d54', marginBottom: 20, lineHeight: 1.5 }}>
              {product.description}
            </p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#8c8275', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Traditional Ingredients:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#f3ece1',
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 9999,
                        color: '#655d54',
                        fontWeight: 600,
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weight Selection */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#8c8275', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                  Choose Jar Weight:
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: selectedWeight === opt.weight ? '2px solid #d97706' : '1px solid #e5e0d8',
                        backgroundColor: selectedWeight === opt.weight ? '#fef3c7' : '#ffffff',
                        color: selectedWeight === opt.weight ? '#b45309' : '#655d54',
                      }}
                    >
                      <div>{opt.weight}</div>
                      <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>₹{opt.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#655d54' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e0d8', borderRadius: 8 }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ padding: '6px 12px', background: 'none', color: '#1e1b18' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.95rem' }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{ padding: '6px 12px', background: 'none', color: '#1e1b18' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Price & Add Button */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid #e5e0d8', paddingTop: 16 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#8c8275', display: 'block' }}>Total Price</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b18' }}>
                  ₹{currentPrice * qty}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px 20px', fontSize: '0.95rem' }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
