import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/api/axios';
import { Product } from './productSlice';

export interface CartItem {
  id: string;
  product: string | Product;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  shippingAddress: ShippingAddress | null;
  paymentMethod: string | null;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  wilaya: string;
  daira: string;
  address?: string;
  deliveryType?: 'home' | 'office';
}

// حماية عند قراءة cartItems من LocalStorage
let cartItems: any[] = [];
try {
  cartItems = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems') || '[]')
    : [];
  if (!Array.isArray(cartItems)) cartItems = [];
} catch {
  localStorage.removeItem('cartItems');
  cartItems = [];
}

const initialState: CartState = {
  items: cartItems,
  loading: false,
  error: null,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress') || '{}')
    : null,
  paymentMethod: localStorage.getItem('paymentMethod') || null,
};

const getCartItemsFromStorage = () => {
  try {
    const items = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') || '[]')
      : [];
    return Array.isArray(items) ? items : [];
  } catch {
    localStorage.removeItem('cartItems');
    return [];
  }
};

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      const productData = response.data.success && response.data.product 
        ? response.data.product 
        : response.data;
      if (!productData || !productData.id) {
        return rejectWithValue('Invalid product data received from server');
      }
      if (productData.countInStock < quantity) {
        return rejectWithValue('Not enough stock available');
      }
      const item: CartItem = {
        id: productData.id,
        product: productData.id,
        name: productData.name,
        image: productData.images && productData.images.length > 0 
          ? productData.images[0] 
          : productData.image,
        price: productData.price,
        quantity,
      };
      return item;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to add item to cart';
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add or update item in cart (local)
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      if (!Array.isArray(state.items)) {
        state.items = getCartItemsFromStorage();
      }
      const item = action.payload;
      const items = Array.isArray(state.items) ? state.items : [];
      const existingItem = items.find((x) => x.id === item.id);
      
      if (existingItem) {
        state.items = items.map((x) =>
          x.id === existingItem.id ? item : x
        );
      } else {
        state.items = [...items, item];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    // Update cart item quantity
    updateCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (!Array.isArray(state.items)) {
        state.items = getCartItemsFromStorage();
      }
      const { id, quantity } = action.payload;
      const items = Array.isArray(state.items) ? state.items : [];
      const item = items.find((x) => x.id === id);
      
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(items));
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      if (!Array.isArray(state.items)) {
        state.items = getCartItemsFromStorage();
      }
      const items = Array.isArray(state.items) ? state.items : [];
      state.items = items.filter((x) => x.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
    
    // Save shipping address
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    
    // Save payment method
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    
    // Clear shipping and payment info
    clearShippingAndPayment: (state) => {
      state.shippingAddress = null;
      state.paymentMethod = null;
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
    
    // Reset cart from storage
    resetFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = getCartItemsFromStorage();
        }
        state.loading = false;
        state.error = null;

        const item = action.payload;
        if (!item || typeof item !== 'object' || !item.id) {
          state.error = 'Invalid item data';
          return;
        }
        const items = Array.isArray(state.items) ? state.items : [];
        const existingItem = items.find((x) => x.id === item.id);
        if (existingItem) {
          state.items = items.map((x) =>
            x.id === existingItem.id ? {
              ...x,
              quantity: x.quantity + item.quantity
            } : x
          );
        } else {
          state.items = [...items, item];
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addCartItem,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  clearShippingAndPayment,
  resetFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
