import api from './axios';


// Get cart items
export const getCartItems = async () => {
  const response = await api.get('/api/users/cart');
  return response.data;
};

// Add item to cart
export const addToCart = async (productId: string, quantity: number) => {
  const response = await api.post('/api/users/cart', { productId, quantity });
  return response.data;
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  const response = await api.put(`/api/users/cart/${itemId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (itemId: string) => {
  const response = await api.delete(`/api/users/cart/${itemId}`);
  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await api.delete('/api/users/cart');
  return response.data;
};

// Apply coupon to cart
export const applyCoupon = async (couponCode: string) => {
  const response = await api.post('/api/users/cart/coupon', { couponCode });
  return response.data;
};

// Get cart summary
export const getCartSummary = async () => {
  const response = await api.get('/api/users/cart/summary');
  return response.data;
};
