import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Define API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

// Create axios instance with custom config
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow sending cookies with requests
});

// Request interceptor for adding token to header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData requests
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      // تجاهل أخطاء المصادقة في مسار إنشاء الطلب للزوار ومسارات الطباعة
      const isOrderCreation = error.config.url.includes('/api/orders') && error.config.method === 'post';
      const isOrderPrint = error.config.url.includes('/api/orders/') && error.config.url.includes('/print');
      if (!isOrderCreation && !isOrderPrint) {
        // Token expired or invalid, logging out
        store.dispatch(logout());
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
