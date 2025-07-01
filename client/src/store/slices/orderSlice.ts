import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrder as createOrderAPI,
  getOrderById,
  updateOrderToPaid,
  getUserOrders as getUserOrdersAPI,
  cancelOrder as cancelOrderAPI,
  updateOrderStatus as updateOrderStatusAPI
} from '@/api/orders';
import { Order } from '@/types/order';

// Use Order type from types/order.ts
type OrderType = Order;

interface OrdersState {
  orders: OrderType[];
  order: OrderType | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  totalOrders: number;
  page?: number;
  pages?: number;
}

const initialState: OrdersState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  totalOrders: 0,
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const data = await createOrderAPI(orderData);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

// Get order details
export const getOrderDetails = createAsyncThunk(
  'orders/details',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getOrderById(id);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch order details';
      return rejectWithValue(message);
    }
  }
);

// Pay order
export const payOrder = createAsyncThunk(
  'orders/pay',
  async ({ id, paymentResult }: { id: string; paymentResult: any }, { rejectWithValue }) => {
    try {
      const data = await updateOrderToPaid(id, paymentResult);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Payment failed';
      return rejectWithValue(message);
    }
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  'orders/userOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const data = await getUserOrdersAPI(page, limit);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await cancelOrderAPI(id);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to cancel order';
      return rejectWithValue(message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, statusData }: { id: string; statusData: any }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatusAPI(id, statusData);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update order status';
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    clearOrderDetails: (state) => {
      state.order = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.order) {
          state.order = action.payload;
        }
        // Update order in orders list
        const index = state.orders.findIndex(
          (order: OrderType) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update current order if it's the same
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update order in orders list
        const index = state.orders.findIndex(
          (order: OrderType) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update current order if it's the same
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderErrors, resetOrderSuccess, clearOrderDetails, setOrders } = orderSlice.actions;

export default orderSlice.reducer;
