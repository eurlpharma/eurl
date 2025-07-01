import api from './axios';

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get('/api/admin/dashboard');
  return response.data;
};

// Get sales statistics
export const getSalesStats = async (period: string = 'week') => {
  const response = await api.get(`/api/admin/stats/sales?period=${period}`);
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await api.get('/api/admin/stats/users');
  return response.data;
};

// Get product statistics
export const getProductStats = async () => {
  const response = await api.get('/api/admin/stats/products');
  return response.data;
};

// Get recent orders
export const getRecentOrders = async (limit: number = 5) => {
  const response = await api.get(`/api/admin/orders/recent?limit=${limit}`);
  return response.data;
};

// Get top selling products
export const getTopSellingProducts = async (limit: number = 5) => {
  const response = await api.get(`/api/admin/products/top-selling?limit=${limit}`);
  return response.data;
};

// Get low stock products
export const getLowStockProducts = async (threshold: number = 10, limit: number = 10) => {
  const response = await api.get(`/api/admin/products/low-stock?threshold=${threshold}&limit=${limit}`);
  return response.data;
};

// Get system settings
export const getSystemSettings = async () => {
  const response = await api.get('/api/admin/settings');
  return response.data;
};

// Update system settings
export const updateSystemSettings = async (settings: any) => {
  const response = await api.put('/api/admin/settings', settings);
  return response.data;
};
