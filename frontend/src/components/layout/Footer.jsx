import React from 'react';
import { Heart, ShieldCheck, Truck, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1e1b18', color: '#d5cfc5', marginTop: 60, paddingTop: 40, paddingBottom: 24 }}>
      {/* Guarantees bar */}
      <div className="container" style={{ borderBottom: '1px solid #36312a', paddingBottom: 32, marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Award size={28} style={{ color: '#d97706' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 2 }}>100% Traditional Recipe</h4>
              <p style={{ fontSize: '0.8rem', color: '#9e9488' }}>Handcrafted with authentic spices</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ShieldCheck size={28} style={{ color: '#d97706' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 2 }}>Zero Preservatives</h4>
              <p style={{ fontSize: '0.8rem', color: '#9e9488' }}>Naturally sun-cured & healthy</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Truck size={28} style={{ color: '#d97706' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 2 }}>Safe Pan-India Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: '#9e9488' }}>Leak-proof glass jar packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: 12 }}>Mamta Pickles</h3>
          <p style={{ fontSize: '0.85rem', color: '#9e9488', lineHeight: 1.6 }}>
            Bringing the nostalgic flavors of traditional Indian kitchens straight to your dining table. Every jar is made with hand-picked raw fruits, cold-pressed oils, and sun-dried spices.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Flavors</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#9e9488', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Gujarati Rajapuri Mango Pickle</li>
            <li>Sweet & Tangy Mango Chhundo</li>
            <li>Bharwa Red & Green Chili Pickle</li>
            <li>Sun-Dried Lemon Ajwain Pickle</li>
            <li>Garlic & Ginger Specialty Chutney</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Service</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#9e9488', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Track Your Order</li>
            <li>Shipping & Packaging Policy</li>
            <li>Bulk & Wedding Orders</li>
            <li>Contact Us: care@mamtapickles.com</li>
            <li>Helpline: +91 98765 43210</li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="container" style={{ borderTop: '1px solid #2b2723', paddingTop: 20, textAlign: 'center', fontSize: '0.8rem', color: '#7c7368' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Made with <Heart size={14} style={{ color: '#dc2626', fill: '#dc2626' }} /> for pickle lovers everywhere. © {new Date().getFullYear()} Mamta Pickles Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
