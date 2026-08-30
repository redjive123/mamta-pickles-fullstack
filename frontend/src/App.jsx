import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/store/HeroBanner';
import { CategoryFilter } from './components/store/CategoryFilter';
import { ProductGrid } from './components/store/ProductGrid';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { OrderHistoryModal } from './components/store/OrderHistoryModal';
import { AdminDashboardModal } from './components/store/AdminDashboardModal';
import { AuthModal } from './components/auth/AuthModal';
import { InfoModal } from './components/common/InfoModal';
import { Toast } from './components/common/Toast';
import { api } from './services/api';

export const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({
          category: activeCategory,
          search,
          sort,
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [activeCategory, search, sort]);

  const handleScrollToGrid = () => {
    const gridEl = document.getElementById('pickle-catalog');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Store Content */}
      <main className="container" style={{ flex: 1 }}>
        <HeroBanner onExploreClick={handleScrollToGrid} />

        <div id="pickle-catalog">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            sort={sort}
            onSelectSort={setSort}
          />

          <ProductGrid
            products={products}
            loading={loading}
            onQuickView={(prod) => setSelectedProduct(prod)}
            onShowToast={showToast}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenInfo={(data) => setInfoModalData(data)}
        onScrollToCatalog={handleScrollToGrid}
      />

      {/* Modals & Overlays */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onShowToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onShowToast={showToast}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onShowToast={showToast}
      />

      <InfoModal
        modalData={infoModalData}
        onClose={() => setInfoModalData(null)}
      />

      <AuthModal onShowToast={showToast} />

      {/* Toast Popup */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
