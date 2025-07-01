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

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      console.log('[addToCart] API response:', response.data);
      // التحقق من هيكل الاستجابة واستخراج المنتج بشكل صحيح
      const productData = response.data.success && response.data.product 
        ? response.data.product 
        : response.data;
      console.log('[addToCart] productData:', productData);
      if (!productData || !productData.id) {
        console.log('[addToCart] Invalid product data received from server');
        return rejectWithValue('Invalid product data received from server');
      }
      if (productData.countInStock < quantity) {
        console.log('[addToCart] Not enough stock available');
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
      console.log('[addToCart] item to add:', item);
      return item;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to add item to cart';
      console.log('[addToCart] Error:', message, error);
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
      const item = action.payload;
      const existingItem = state.items.find((x) => x.id === item.id);
      
      if (existingItem) {
        state.items = state.items.map((x) =>
          x.id === existingItem.id ? item : x
        );
      } else {
        state.items.push(item);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    // Update cart item quantity
    updateCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((x) => x.id === id);
      
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((x) => x.id !== action.payload);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('[addToCart.fulfilled] action.payload:', action.payload);
        const item = action.payload;
        if (!item || typeof item !== 'object' || !item.id) {
          state.error = 'Invalid item data';
          console.log('[addToCart.fulfilled] Invalid item data:', item);
          return;
        }
        const existingItem = state.items.find((x) => x.id === item.id);
        if (existingItem) {
          state.items = state.items.map((x) =>
            x.id === existingItem.id ? {
              ...x,
              quantity: x.quantity + item.quantity
            } : x
          );
        } else {
          state.items.push(item);
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
} = cartSlice.actions;

export default cartSlice.reducer;
