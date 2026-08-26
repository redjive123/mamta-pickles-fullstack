import React from 'react';

const categories = ['All', 'Mango', 'Chili', 'Lemon', 'Garlic', 'Mixed', 'Specialty'];

export const CategoryFilter = ({ activeCategory, onSelectCategory, sort, onSelectSort }) => {
  return (
    <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 9999,
                fontSize: '0.88rem',
                fontWeight: 600,
                backgroundColor: isActive ? '#d97706' : '#ffffff',
                color: isActive ? '#ffffff' : '#655d54',
                border: isActive ? '1px solid #d97706' : '1px solid #e5e0d8',
                boxShadow: isActive ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat === 'All' ? '🌶️ All Pickles' : cat}
            </button>
          );
        })}
      </div>

      {/* Sorting Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.85rem', color: '#655d54', fontWeight: 600 }}>Sort By:</span>
        <select
          value={sort}
          onChange={(e) => onSelectSort(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #e5e0d8',
            backgroundColor: '#ffffff',
            fontSize: '0.88rem',
            color: '#1e1b18',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="featured">Featured Pickles</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};
