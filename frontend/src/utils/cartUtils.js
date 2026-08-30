export const FREE_SHIPPING_THRESHOLD = 599;
export const SHIPPING_PRICE = 49;
export const GST_RATE = 0.05;

export const computePrices = (cartItems = []) => {
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > FREE_SHIPPING_THRESHOLD || itemsPrice === 0 ? 0 : SHIPPING_PRICE;
  const taxPrice = Math.round(itemsPrice * GST_RATE);
  const totalAmount = itemsPrice + shippingPrice + taxPrice;
  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return { itemsPrice, shippingPrice, taxPrice, totalAmount, totalCount };
};

// Returns quantity after applying delta, or null when it would drop below 1.
export const nextQuantity = (qty, delta) => {
  const newQty = qty + delta;
  return newQty > 0 ? newQty : null;
};