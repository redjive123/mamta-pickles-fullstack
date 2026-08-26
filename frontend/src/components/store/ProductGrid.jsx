import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageX } from 'lucide-react';

export const ProductGrid = ({ products, loading, onQuickView, onShowToast }) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: 380,
              backgroundColor: '#e5e0d8',
              borderRadius: 16,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e5e0d8' }}>
        <PackageX size={48} style={{ color: '#d97706', marginBottom: 12 }} />
        <h3 style={{ fontSize: '1.2rem', color: '#1e1b18', marginBottom: 6 }}>No Pickles Found</h3>
        <p style={{ fontSize: '0.9rem', color: '#655d54' }}>
          Try clearing your search query or switching category filters.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
      {products.map((product) => (
        <ProductCard
          key={product._id || product.slug}
          product={product}
          onQuickView={onQuickView}
          onShowToast={onShowToast}
        />
      ))}
    </div>
  );
};
