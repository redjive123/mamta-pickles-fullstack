import React from 'react';
import { Heart, ShieldCheck, Truck, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = ({ onSelectCategory, onOpenOrders, onOpenInfo, onScrollToCatalog }) => {
  const { user, openAuthModal } = useAuth();

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) onSelectCategory(cat);
    if (onScrollToCatalog) onScrollToCatalog();
  };

  const handleTrackOrderClick = () => {
    if (user) {
      if (onOpenOrders) onOpenOrders();
    } else {
      if (openAuthModal) openAuthModal('login');
    }
  };

  const policyContent = {
    shipping: {
      title: 'Shipping & Packaging Policy',
      icon: 'shipping',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            <strong>Pan-India Express Delivery:</strong> All orders are dispatched within 24 hours of placement via premium logistics partners (BlueDart / Delhivery / FedEx).
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>Leak-Proof Glass Jar Packaging:</strong> Each jar is vacuum-sealed and encased in triple-layer bubble cushioning inside eco-friendly corrugated boxes to guarantee 100% spill-free arrival.
          </p>
          <p>
            <strong>Free Shipping:</strong> Automatically applied on all orders above ₹599 nationwide. Standard shipping fee of ₹49 applies for smaller orders.
          </p>
        </div>
      ),
    },
    bulk: {
      title: 'Bulk & Corporate Catering Orders',
      icon: 'bulk',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Looking for authentic traditional pickle gift hampers for weddings, corporate gifting, festivals, or restaurant bulk supply?
          </p>
          <p style={{ marginBottom: 12 }}>
            We offer custom jar sizes (100g mini gift jars up to 5kg commercial tubs), custom personalized labeling, and wholesale pricing discounts.
          </p>
          <p>
            <strong>Direct Wholesale Contact:</strong> Email bulk@mamtapickles.com or call +91 98765 43210 for immediate volume quotes.
          </p>
        </div>
      ),
    },
    quality: {
      title: 'Quality & Recipe Guarantee',
      icon: 'guarantee',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            <strong>100% Traditional Process:</strong> Made with cold-pressed Kachi Ghani mustard oil, organic unrefined jaggery, hand-picked raw fruits, and sun-dried spices.
          </p>
          <p>
            <strong>Zero Preservatives:</strong> We use no artificial colors, chemical preservatives, or synthetic acidifiers. Natural fermentation and spice curing keep our pickles fresh for up to 12 months.
          </p>
        </div>
      ),
    },
    contact: {
      title: 'Contact & Customer Support',
      icon: 'contact',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            <strong>Customer Helpline:</strong> +91 98765 43210 (Mon - Sat, 9:00 AM - 7:00 PM IST)
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>Email Support:</strong> care@mamtapickles.com
          </p>
          <p>
            <strong>Registered Office & Kitchen:</strong> Mamta Food Products Pvt Ltd, Plot 42, Heritage Spice Park, CG Road, Ahmedabad, Gujarat - 380009.
          </p>
        </div>
      ),
    },
  };

  return (
    <footer style={{ backgroundColor: '#1e1b18', color: '#d5cfc5', marginTop: 60, paddingTop: 40, paddingBottom: 24 }}>
      {/* Guarantees bar */}
      <div className="container" style={{ borderBottom: '1px solid #36312a', paddingBottom: 32, marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          <div
            onClick={() => onOpenInfo && onOpenInfo(policyContent.quality)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          >
            <Award size={28} style={{ color: '#d97706' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 2 }}>100% Traditional Recipe</h4>
              <p style={{ fontSize: '0.8rem', color: '#9e9488' }}>Handcrafted with authentic spices</p>
            </div>
          </div>

          <div
            onClick={() => onOpenInfo && onOpenInfo(policyContent.quality)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          >
            <ShieldCheck size={28} style={{ color: '#d97706' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 2 }}>Zero Preservatives</h4>
              <p style={{ fontSize: '0.8rem', color: '#9e9488' }}>Naturally sun-cured & healthy</p>
            </div>
          </div>

          <div
            onClick={() => onOpenInfo && onOpenInfo(policyContent.shipping)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          >
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
          <p style={{ fontSize: '0.85rem', color: '#9e9488', lineHeight: 1.6, marginBottom: 14 }}>
            Bringing the nostalgic flavors of traditional Indian kitchens straight to your dining table. Every jar is made with hand-picked raw fruits, cold-pressed oils, and sun-dried spices.
          </p>
          <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
            ISO 22000 Certified Foods
          </span>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Categories</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#9e9488', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <button
                onClick={() => handleCategoryClick('Mango')}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Mango Pickles (Aam Ka Achar)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Chili')}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Stuffed Chili Pickles (Hari & Lal Mirch)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Lemon')}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Lemon & Ajwain Pickles (Nimbu)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Garlic')}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Desi Garlic Pickles (Lahsun)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Specialty')}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Specialty Chutneys & Relishes
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Support</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#9e9488', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <button
                onClick={handleTrackOrderClick}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Track Order Status
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo && onOpenInfo(policyContent.shipping)}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Shipping & Packaging Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo && onOpenInfo(policyContent.bulk)}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Bulk & Corporate Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo && onOpenInfo(policyContent.contact)}
                style={{ background: 'none', color: '#d5cfc5', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <ChevronRight size={14} style={{ color: '#d97706' }} /> Contact Us & Support
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="container" style={{ borderTop: '1px solid #2b2723', paddingTop: 20, textAlign: 'center', fontSize: '0.8rem', color: '#7c7368' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Made with <Heart size={14} style={{ color: '#dc2626', fill: '#dc2626' }} /> for pickle lovers. © {new Date().getFullYear()} Mamta Pickles Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
