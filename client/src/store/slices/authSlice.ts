import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, updateUserProfile, forgotPassword, resetPassword, verifyResetToken } from '@/api/users';
import api from '@/api/axios';

// تعريف المخفض مباشرة لتجنب الاعتمادات الدائرية

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// التحقق من وجود التوكن في localStorage عند بدء التشغيل
const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token, // تعيين isAuthenticated إلى true إذا كان التوكن موجودًا
  loading: false,
  error: null,
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('authSlice: login called with credentials:', credentials);
      const data = await loginUser(credentials);
      console.log('authSlice: loginUser response:', data);
      
      // Check if response has the expected structure
      if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        console.log('authSlice: login successful, user:', data.user);
        
        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('tokenUpdated', { 
          detail: { token: data.token } 
        }));
        
        // Return the user and token directly to match the AuthResponse interface
        return {
          user: data.user,
          token: data.token
        } as AuthResponse;
      } else {
        console.log('authSlice: invalid response structure:', data);
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Login failed';
      console.log('authSlice: login error:', message);
      return rejectWithValue(message);
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        
        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('tokenUpdated', { 
          detail: { token: data.token } 
        }));
        
        return data as AuthResponse;
      } else {
        return rejectWithValue('Invalid response structure from server');
      }
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const data = await updateUserProfile(userData);
      return data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Profile update failed';
      return rejectWithValue(message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put('/api/users/password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Password change failed';
      return rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await forgotPassword(email);
      return data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Forgot password request failed';
      return rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await resetPassword(token, password);
      return data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

// Verify reset token
export const verifyResetTokenRequest = createAsyncThunk(
  'auth/verifyResetToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await verifyResetToken(token);
      return data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Invalid or expired token';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Change password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// تصدير الأفعال بشكل منفصل
export const { loginSuccess, logout, clearError } = authSlice.actions;

// تصدير المخفض مباشرة
export default authSlice.reducer;
