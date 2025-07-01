// Order types for order management and display

import type { UserData } from './user';

export interface GuestData {
  name: string;
  email?: string;
  phone: string;
}

export interface OrderItem {
  _id: string;
  id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  qty?: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryType?: string;
  dairaName?: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface GuestInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  _id: string;
  id?: string;
  user?: UserData | string;
  guestInfo?: GuestData;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  itemsPrice: number;
  shippingPrice: number;
  discount: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  isPaid?: boolean;
  isDelivered?: boolean;
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

export interface CreateOrderData {
  orderItems: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  discount: number;
  totalPrice: number;
  guestData?: GuestData;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  notes?: string;
}

// Helper function to calculate order summary
export const calculateOrderSummary = (orderItems: OrderItem[]) => {
  const itemsPrice = Number(orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
