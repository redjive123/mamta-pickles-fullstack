import React, { useState } from 'react';
import { Star, Plus, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onQuickView, onShowToast }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product?.weightOptions && product.weightOptions.length > 0
      ? product.weightOptions[0].weight
      : '250g'
  );

  if (!product) return null;

  const currentOption = product.weightOptions?.find((w) => w.weight === selectedWeight);
  const currentPrice = currentOption ? currentOption.price : (product.price || 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    onShowToast(`Added "${product.name}" (${selectedWeight}) to cart!`);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #e5e0d8',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#f9f6f0' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {product.isBestSeller && <span className="badge badge-bestseller">⭐ Best Seller</span>}
          {product.isOrganic && <span className="badge badge-organic">🌿 100% Homemade</span>}
        </div>

        {/* Spice indicator */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            borderRadius: 9999,
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#dc2626',
          }}
        >
          <Flame size={12} /> {product.spiceLevel}
        </div>
      </div>

      {/* Product Details */}
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Star size={14} style={{ color: '#d97706', fill: '#d97706' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b18' }}>{product.rating}</span>
          <span style={{ fontSize: '0.78rem', color: '#8c8275' }}>({product.numReviews || 12} reviews)</span>
        </div>

        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#1e1b18',
            marginBottom: 8,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: '0.82rem',
            color: '#655d54',
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Weight Selector */}
        {product.weightOptions && product.weightOptions.length > 0 && (
          <div style={{ marginBottom: 16 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '0.75rem', color: '#8c8275', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Select Jar Size:
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedWeight(opt.weight)}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: selectedWeight === opt.weight ? '1.5px solid #d97706' : '1px solid #e5e0d8',
                    backgroundColor: selectedWeight === opt.weight ? '#fef3c7' : '#ffffff',
                    color: selectedWeight === opt.weight ? '#b45309' : '#655d54',
                  }}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8c8275', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b18' }}>
              ₹{currentPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
