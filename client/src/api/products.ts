import api from './axios';

// Types
import { ProductData, ProductFilter, ProductFormData, ProductsResponse } from '../types/product';

// Get all products with filters
export const fetchProducts = async (filters: ProductFilter) => {
  const { search, category, minPrice, maxPrice, brand, featured, sortBy, page = 1, limit = 12 } = filters;
  
  // Build query string
  let queryString = `?page=${page}&limit=${limit}`;
  if (search) queryString += `&search=${encodeURIComponent(search)}`;
  if (category) queryString += `&category=${category}`;
  if (minPrice !== undefined) queryString += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined) queryString += `&maxPrice=${maxPrice}`;
  if (brand && brand.length > 0) queryString += `&brand=${brand.join(',')}`;
  if (featured !== undefined) queryString += `&featured=${featured}`;
  if (sortBy) queryString += `&sortBy=${sortBy}`;
  
  const response = await api.get(`/api/products${queryString}`);
  return response.data as ProductsResponse;
};

// Get product details by ID
export const fetchProductDetails = async (id: string) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data as ProductData;
};

// Get featured products
export const fetchFeaturedProducts = async (limit: number = 4) => {
  const response = await api.get(`/api/products/featured?limit=${limit}`);
  return response.data.products as ProductData[];
};

// Create new product (admin)
export const createProduct = async (productData: ProductFormData, images?: File[]) => {
  const formData = new FormData();
  
  // Add product data
  Object.entries(productData).forEach(([key, value]) => {
    if (key === 'specifications' && value) {
      formData.append(key, JSON.stringify(value));
    } else if (key !== 'images') {
      formData.append(key, String(value));
    }
  });
  
  // Add images if available
  if (images && images.length > 0) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  const response = await api.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as ProductData;
};

// Update product (admin)
export const updateProduct = async (id: string, productData: Partial<ProductFormData>, images?: File[]) => {
  const formData = new FormData();
  
  // Add product data
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'specifications' && value) {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'images') {
        formData.append(key, String(value));
      }
    }
  });
  
  // Add images if available
  if (images && images.length > 0) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  const response = await api.put(`/api/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as ProductData;
};

// Delete product (admin)
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data as { success: boolean; message: string };
};

// Create product review
export const createProductReview = async (id: string, reviewData: { rating: number; comment: string }) => {
  const response = await api.post(`/api/products/${id}/reviews`, reviewData);
  return response.data as { success: boolean; product: ProductData };
};

// Get top rated products
export const fetchTopProducts = async (limit: number = 5) => {
  const response = await api.get(`/api/products/top?limit=${limit}`);
  return response.data.products as ProductData[];
};

// Get related products
export const fetchRelatedProducts = async (id: string, limit: number = 4) => {
  const response = await api.get(`/api/products/${id}/related?limit=${limit}`);
  return response.data.products as ProductData[];
};

// Upload product image
export const uploadProductImage = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await api.post('/api/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as { success: boolean; imageUrl: string };
};
