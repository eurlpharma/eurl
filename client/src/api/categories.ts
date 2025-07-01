import api from './axios';

// Types
import { CategoryData, CategoryFilter, CategoryFormData, CategoriesResponse } from '../types/category';

// Get all categories
export const getAllCategories = async (filter?: CategoryFilter) => {
  let queryString = '';
  
  if (filter) {
    const params = new URLSearchParams();
    if (filter.parent !== undefined) params.append('parent', filter.parent || 'null');
    if (filter.active !== undefined) params.append('active', String(filter.active));
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    
    queryString = `?${params.toString()}`;
  }
  
  const response = await api.get(`/api/categories${queryString}`);
  return response.data as CategoriesResponse;
};

// Get category by ID
export const getCategoryById = async (id: string) => {
  const response = await api.get(`/api/categories/${id}`);
  return response.data as CategoryData;
};

// Create new category (admin)
export const createCategory = async (categoryData: CategoryFormData, image?: File) => {
  const formData = new FormData();
  
  // Add category data
  Object.entries(categoryData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'image') {
      formData.append(key, String(value));
    }
  });
  
  // Add image if available
  if (image) {
    formData.append('image', image);
  }
  
  const response = await api.post('/api/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as CategoryData;
};

// Update category (admin)
export const updateCategory = async (id: string, categoryData: Partial<CategoryFormData>, image?: File) => {
  const formData = new FormData();
  
  // Add category data
  Object.entries(categoryData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'image') {
      formData.append(key, String(value));
    }
  });
  
  // Add image if available
  if (image) {
    formData.append('image', image);
  }
  
  const response = await api.put(`/api/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as CategoryData;
};

// Delete category (admin)
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data as { success: boolean; message: string };
};

// Get products by category
export const getProductsByCategory = async (categoryId: string, page: number = 1, limit: number = 12) => {
  const response = await api.get(`/api/categories/${categoryId}/products?page=${page}&limit=${limit}`);
  return response.data;
};

// Get category tree (hierarchical structure)
export const getCategoryTree = async () => {
  const response = await api.get('/api/categories/tree');
  return response.data.categories as CategoryData[];
};
