import api from './axios';

// Types
import { Order, PaymentResult, CreateOrderData, UpdateOrderStatusData, OrderFilter, OrdersResponse, OrderStatus } from '../types/order';

// Create new order
export const createOrder = async (orderData: CreateOrderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data as Order;
};

// Get order by ID
export const getOrderById = async (id: string) => {
  try {
    const response = await api.get(`/api/orders/${id}`);
    return response.data.order as Order;
  } catch (error: any) {
    throw error;
  }
};

// Update order to paid
export const updateOrderToPaid = async (id: string, paymentResult: PaymentResult) => {
  const response = await api.put(`/api/orders/${id}/pay`, paymentResult);
  return response.data as Order;
};

// Update order to delivered
export const updateOrderToDelivered = async (id: string) => {
  const response = await api.put(`/api/orders/${id}/deliver`);
  return response.data as Order;
};

// Update order to unpaid (revert paid)
export const updateOrderToUnpaid = async (id: string) => {
  const response = await api.put(`/api/orders/${id}/unpay`);
  return response.data.order as Order;
};

// Get logged in user orders
export const getUserOrders = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/api/orders/myorders?page=${page}&limit=${limit}`);
  return response.data as OrdersResponse;
};

// Get all orders (admin)
export const getAllOrders = async (filter?: OrderFilter) => {
  const { status, isPaid, isDelivered, customer, dateFrom, dateTo, search, sortBy, sortOrder, page = 1, limit = 10 } = filter || {};
  
  // Build query string
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  
  if (status) params.append('status', status);
  if (isPaid !== undefined) params.append('isPaid', String(isPaid));
  if (isDelivered !== undefined) params.append('isDelivered', String(isDelivered));
  if (customer) params.append('customer', customer);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);
  
  const response = await api.get(`/api/orders?${params.toString()}`);
  return response.data as OrdersResponse;
};

// Cancel order
export const cancelOrder = async (id: string) => {
  const response = await api.put(`/api/orders/${id}/cancel`);
  return response.data as Order;
};

// Get order statistics (admin)
export const getOrderStats = async () => {
  const response = await api.get('/api/orders/stats');
  return response.data as {
    totalOrders: number;
    totalSales: number;
    totalPaidOrders: number;
    totalUnpaidOrders: number;
    ordersByStatus: Record<OrderStatus, number>;
    dailySales: Array<{ date: string; sales: number; orders: number }>;
  };
};

// Update order status (admin)
export const updateOrderStatus = async (id: string, statusData: UpdateOrderStatusData) => {
  const response = await api.put(`/api/orders/${id}/status`, statusData);
  return response.data as Order;
};

// Generate invoice for order (PDF)
export const generateOrderInvoice = async (id: string) => {
  const response = await api.get(`/api/orders/${id}/invoice`, {
    responseType: 'blob'
  });
  return response.data as Blob;
};

// Delete order (admin)
export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/api/orders/${id}`);
  return response.data as { success: boolean; message: string };
};

// Get order by ID for printing
export const getOrderForPrint = async (id: string, signal?: AbortSignal) => {
  try {
    const response = await api.get(`/api/orders/${id}/print`, { signal });
    return response.data.order as Order;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw error;
  }
};
