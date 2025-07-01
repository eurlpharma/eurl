import api from './axios';

// Types
import { LoginData, RegisterData, UserData, UpdateProfileData } from '../types/user';

// Login user
export const loginUser = async (userData: LoginData) => {
  try {
    const response = await api.post('/api/users/login', userData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Register user
export const registerUser = async (userData: RegisterData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData: UpdateProfileData) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email: string) => {
  const response = await api.post('/api/users/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token: string, password: string) => {
  const response = await api.post(`/api/users/reset-password/${token}`, { password });
  return response.data;
};

// Verify reset token
export const verifyResetToken = async (token: string) => {
  const response = await api.get(`/api/users/reset-password/${token}`);
  return response.data;
};

// Get all users (admin)
export const getUsers = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/api/users?page=${page}&limit=${limit}`);
  return response.data;
};

// Delete user (admin)
export const deleteUser = async (id: string) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

// Get user by ID (admin)
export const getUserById = async (id: string) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// Update user (admin)
export const updateUser = async (id: string, userData: Partial<UserData>) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

// Update user status (admin)
export const updateUserStatus = async (id: string, statusData: { isActive: boolean }) => {
  const response = await api.put(`/api/users/${id}/status`, statusData);
  return response.data;
};

// إضافة مستخدم جديد (من لوحة التحكم)
export const addUserAdmin = async (userData: { name: string; email: string; password: string; role: string }) => {
  // نستخدم POST /api/users مباشرة (نفس registerUser لكن مع role)
  const response = await api.post('/api/users', userData);
  return response.data;
};
