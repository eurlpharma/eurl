import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/api/axios';

const API_URL = '/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  richDescription?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price: number;
  category: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: string;
}

interface ProductsState {
  products: Product[];
  product: Product | null;
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  uploadStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  currentProduct: Product | null;
}

interface GetProductsParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface CreateProductTextPayload {
  name: string;
  description: string;
  richDescription?: string;
  brand?: string;
  price: number;
  category: string; // Category ID
  countInStock: number;
  isFeatured?: boolean;
}

const initialState: ProductsState = {
  products: [],
  product: null,
  featuredProducts: [],
  loading: false,
  error: null,
  totalProducts: 0,
  uploadStatus: {
    loading: false,
    error: null,
    success: false,
  },
  currentProduct: null,
};

// Get all products with filters, pagination and sorting
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params: GetProductsParams = {}, { rejectWithValue }) => {
    try {
      const { keyword = '', page = 1, limit = 10, sortBy = 'createdAt', category = '', minPrice, maxPrice } = params;
      
      let url = `/api/products?page=${page}&limit=${limit}`;
      
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (category) url += `&category=${category}`;
      if (minPrice !== undefined && minPrice > 0) url += `&minPrice=${minPrice}`;
      if (maxPrice !== undefined && maxPrice > 0) url += `&maxPrice=${maxPrice}`;
      if (sortBy !== 'createdAt') url += `&sortBy=${sortBy}`;
      
      const response = await axios.get(url);
      
      return {
        products: response.data.products,
        totalProducts: response.data.totalProducts,
        maxPrice: response.data.maxPrice
      };
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (count: number = 8, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/featured?count=${count}`);
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch featured products';
      return rejectWithValue(message);
    }
  }
);

// Get product details
export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      
      // Check if the response has the expected structure
      if (response.data && response.data.success && response.data.product) {
        // Return the product object directly
        return response.data.product;
      } else if (response.data) {
        // For backward compatibility, check if response.data itself is the product
        return response.data;
      } else {
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch product details';
      return rejectWithValue(message);
    }
  }
);

// Create new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

// Create new product with text data only
export const createProductTextData = createAsyncThunk(
  'products/createProductTextData',
  async (productTextData: CreateProductTextPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/products', productTextData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      // Delete the product from the database
      await axios.delete(`/api/products/${id}`);
      
      // Delete the product's image folder
      try {
        await axios.delete(`/api/upload/product/${id}`);
      } catch (folderError) {
        return null;
      }
      
      return id;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to delete product';
      return rejectWithValue(message);
    }
  }
);

// Upload product image
// Upload a single product image
export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async ({ productId, image }: { productId?: string; image: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      
      // If productId is provided, add it to the request
      if (productId) {
        formData.append('productId', productId);
      }
      
      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to upload image';
      return rejectWithValue(message);
    }
  }
);

// Upload multiple product images
export const uploadProductImages = createAsyncThunk(
  'products/uploadProductImages',
  async (images: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post('/api/upload/product-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to upload product images';
      return rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductDetails: (state) => {
      state.product = null;
      state.currentProduct = null;
      state.error = null; 
    },
    clearProductErrors: (state) => {
      state.error = null;
      state.uploadStatus.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products cases
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.products) {
          state.products = action.payload.products;
          state.totalProducts = action.payload.totalProducts;
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get featured products cases
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = action.payload.success;
        state.featuredProducts = action.payload.products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get product details cases
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.product) {
          const updatedProduct = action.payload.product;
          const index = state.products.findIndex(
            (product) => product.id === updatedProduct.id
          );
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
          state.product = updatedProduct;
          const featuredIndex = state.featuredProducts.findIndex(
            (product) => product.id === updatedProduct.id
          );
          if (featuredIndex !== -1) {
            state.featuredProducts[featuredIndex] = updatedProduct;
          }
          state.currentProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(createProductTextData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductTextData.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        // Optionally add to products list if needed, or handle in component
        // state.products.unshift(action.payload);
        state.currentProduct = action.payload; // Set current product for immediate use (e.g., getting ID for image upload)
      })
      .addCase(createProductTextData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload product image cases
      .addCase(uploadProductImage.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.error = null;
        state.uploadStatus.success = false;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload as string;
      })
      // Upload multiple images cases
      .addCase(uploadProductImages.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.error = null;
        state.uploadStatus.success = false;
      })
      .addCase(uploadProductImages.fulfilled, (state) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload as string;
      });
  },
});

export const { resetProductDetails, clearProductErrors } = productSlice.actions;

export default productSlice.reducer;
