import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || `https://eurl-server.onrender.com`;


const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      const isOrderCreation = error.config.url.includes('/api/orders') && error.config.method === 'post';
      const isOrderPrint = error.config.url.includes('/api/orders/') && error.config.url.includes('/print');
      if (!isOrderCreation && !isOrderPrint) {
        store.dispatch(logout());
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
