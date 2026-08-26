import React from 'react';
import { ArrowRight, Sparkles, Sun, Droplet } from 'lucide-react';

export const HeroBanner = ({ onExploreClick }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
        borderRadius: 24,
        padding: '48px 40px',
        margin: '24px 0 40px 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(217, 119, 6, 0.08)',
        border: '1px solid #fcd34d',
      }}
    >
      <div style={{ maxWidth: 640, position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: 9999,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#b45309',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: 16,
          }}
        >
          <Sparkles size={14} /> Traditional Handmade Indian Pickles
        </div>

        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1e1b18',
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Grandma's Secret Recipe, <span style={{ color: '#d97706' }}>Sun-Aged to Perfection.</span>
        </h2>

        <p style={{ fontSize: '1.05rem', color: '#655d54', marginBottom: 28, lineHeight: 1.6 }}>
          100% natural homemade pickles crafted in small batches with cold-pressed mustard oil, organic jaggery, and hand-pounded spices.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 600, color: '#92400e' }}>
            <Sun size={18} style={{ color: '#d97706' }} /> Naturally Sun-Cured
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 600, color: '#92400e' }}>
            <Droplet size={18} style={{ color: '#d97706' }} /> Cold-Pressed Oil
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 600, color: '#92400e' }}>
            ✨ No Chemical Preservatives
          </div>
        </div>

        <button onClick={onExploreClick} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
          Explore Our Pickles <ArrowRight size={18} />
        </button>
      </div>

      {/* Decorative Image Graphic */}
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          backgroundImage: `url('https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '8px solid #ffffff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          opacity: 0.95,
        }}
      />
    </div>
  );
};
