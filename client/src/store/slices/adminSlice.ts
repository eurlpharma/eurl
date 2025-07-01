import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/api/axios';
import { ProductData } from '../../types/product';
import { Order } from '../../types/order';

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  dailySales: { date: string; sales: number; revenue: number }[];
  monthlySales: { month: string; sales: number; revenue: number }[];
}

interface VisitorStats {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  dailyVisitors: { date: string; visitors: number; newVisitors: number }[];
  deviceStats: { device: string; count: number; percentage: number }[];
}

interface ProductStats {
  topSellingProducts: {
    _id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
  stockStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

interface AdminState {
  dashboardStats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalCategories: number;
    totalRevenue: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    percentageChange: {
      sales: number;
      orders: number;
    };
  } | null;
  salesStats: SalesStats | null;
  visitorStats: VisitorStats | null;
  productStats: ProductStats | null;
  recentProducts: ProductData[];
  recentOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  dashboardStats: null,
  salesStats: null,
  visitorStats: null,
  productStats: null,
  recentProducts: [],
  recentOrders: [],
  loading: false,
  error: null,
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Get sales stats
export const getSalesStats = createAsyncThunk(
  'admin/getSalesStats',
  async (period: '7days' | '30days' | '90days' | '12months' = '30days', { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/stats/sales?period=${period}`);
      
      // Check if the response has the expected structure
      if (response.data && response.data.salesStats) {
        return response.data.salesStats;
      } else if (response.data && (response.data.success !== false)) {
        // If the data is directly in the response without a salesStats wrapper
        return response.data;
      } else {
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch sales statistics';
      return rejectWithValue(message);
    }
  }
);

// Get visitor stats
export const getVisitorStats = createAsyncThunk(
  'admin/getVisitorStats',
  async (period: '7days' | '30days' | '90days' | '12months' = '30days', { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/stats/visitors?period=${period}`);
      
      // Check if the response has the expected structure
      if (response.data && response.data.visitorStats) {
        return response.data.visitorStats;
      } else if (response.data && (response.data.success !== false)) {
        // If the data is directly in the response without a visitorStats wrapper
        return response.data;
      } else {
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch visitor statistics';
      return rejectWithValue(message);
    }
  }
);

// Get product stats
export const getProductStats = createAsyncThunk(
  'admin/getProductStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/stats/products');
      
      // Check if the response has the expected structure
      if (response.data && response.data.productStats) {
        return response.data.productStats;
      } else if (response.data && (response.data.success !== false)) {
        // If the data is directly in the response without a productStats wrapper
        return response.data;
      } else {
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch product statistics';
      return rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminErrors: (state) => {
      state.error = null;
    },
    // Add new reducer to update dashboard stats after order status change
    updateDashboardAfterOrderChange: (state, action) => {
      if (state.dashboardStats) {
        // Update total orders if needed
        if (action.payload.isNewOrder) {
          state.dashboardStats.totalOrders += 1;
        }
        
        // Update total revenue if order is paid
        if (action.payload.isPaid && action.payload.totalPrice) {
          state.dashboardStats.totalRevenue = (state.dashboardStats.totalRevenue || 0) + action.payload.totalPrice;
        }
      }
    },
    // Add new reducer to update dashboard stats after product change
    updateDashboardAfterProductChange: (state, action) => {
      if (state.dashboardStats) {
        // Update total products if needed
        if (action.payload.isNewProduct) {
          state.dashboardStats.totalProducts += 1;
        } else if (action.payload.isDeleted) {
          state.dashboardStats.totalProducts -= 1;
        }
        
        // Update stock status
        if (action.payload.countInStock === 0) {
          state.dashboardStats.outOfStockProducts += 1;
          state.dashboardStats.lowStockProducts -= 1;
        } else if (action.payload.countInStock > 0 && action.payload.countInStock <= 5) {
          state.dashboardStats.lowStockProducts += 1;
          state.dashboardStats.outOfStockProducts -= 1;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard stats cases
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.stats;
        state.recentProducts = action.payload.recentProducts;
        state.recentOrders = action.payload.recentOrders;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get sales stats cases
      .addCase(getSalesStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesStats.fulfilled, (state, action) => {
        state.loading = false;
        state.salesStats = action.payload;
      })
      .addCase(getSalesStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get visitor stats cases
      .addCase(getVisitorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisitorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.visitorStats = action.payload;
      })
      .addCase(getVisitorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get product stats cases
      .addCase(getProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.productStats = action.payload;
      })
      .addCase(getProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearAdminErrors, 
  updateDashboardAfterOrderChange,
  updateDashboardAfterProductChange 
} = adminSlice.actions;

export default adminSlice.reducer;
