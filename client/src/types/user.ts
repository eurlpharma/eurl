// User types for authentication and profile management

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  phone?: string;
  address?: Partial<Address>;
  avatar?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
  success: boolean;
}

export type UserRole = 'user' | 'admin';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
