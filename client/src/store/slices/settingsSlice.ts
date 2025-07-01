import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/api/axios';

// Types
interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  shippingPolicy: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsAndConditions: string;
  maintenanceMode: boolean;
  currency: string;
  taxRate: number;
  minimumOrderAmount: number;
  freeShippingThreshold: number;
  googleMapUrl?: string;
  siteLogo?: string;
}

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
  success: false
};

// API calls
export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get settings'
      );
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Settings, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings', settings);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update settings'
      );
    }
  }
);

// Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    clearSettingsSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get settings
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.success = true;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  }
});

export const { clearSettingsError, clearSettingsSuccess } = settingsSlice.actions;

export default settingsSlice.reducer; 