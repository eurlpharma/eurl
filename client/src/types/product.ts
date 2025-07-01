// Product types for product management and display

import { UserData } from './user';

export interface Review {
  user: string; // User ID
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface ProductData {
  id?: string;
  user: string | UserData; // User ID or populated user data
  name: string;
  slug: string;
  images: string[];
  category: string | CategoryData; // Category ID or populated category data
  description: string;
  richDescription?: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  isFeatured: boolean;
  isVisible: boolean;
  brand?: string;
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  featured?: boolean;
  search?: string;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption = 
  | 'newest' 
  | 'price-low' 
  | 'price-high' 
  | 'rating' 
  | 'name-asc' 
  | 'name-desc';

export interface ProductsResponse {
  products: ProductData[];
  page: number;
  pages: number;
  count: number;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  richDescription?: string;
  price: number;
  countInStock: number;
  images: string[];
  brand?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  specifications?: Record<string, any>;
}

// Need to import CategoryData from category.ts
// Using a placeholder interface to avoid circular dependency
interface CategoryData {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface ProductCartType {
  id?: string;
  name: string;
  slug: string;
  images: string[];
  category: string | CategoryData; // Category ID or populated category data
  description: string;
  richDescription?: string;
  price: number;
  countInStock: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
  oldPrice?: number;
}