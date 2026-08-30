import React, { createContext, useContext, useState, useEffect } from 'react';
import { computePrices, nextQuantity } from '../utils/cartUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('mamta_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mamta_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedWeight = '250g', quantity = 1) => {
    setCartItems((prevItems) => {
      // Find weight option price if available
      const weightOpt = product.weightOptions?.find((w) => w.weight === selectedWeight);
      const itemPrice = weightOpt ? weightOpt.price : product.price;

      const itemKey = `${product._id || product.slug}_${selectedWeight}`;
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].qty += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            key: itemKey,
            product: product._id || product.slug,
            name: product.name,
            image: product.image,
            weight: selectedWeight,
            price: itemPrice,
            qty: quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemKey, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.key === itemKey) {
            const newQty = nextQuantity(item.qty, delta);
            return newQty ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== itemKey));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const { itemsPrice, shippingPrice, taxPrice, totalAmount, totalCount } = computePrices(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
