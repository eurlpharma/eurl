import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  notification: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  drawer: {
    open: boolean;
  };
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  modal: {
    [key: string]: boolean;
  };
  filters: {
    productFilters: {
      category: string;
      minPrice: number | null;
      maxPrice: number | null;
      sortBy: string;
    };
  };
}

const initialState: UIState = {
  notification: {
    open: false,
    message: '',
    type: 'info',
  },
  drawer: {
    open: false,
  },
  loading: {
    global: false,
  },
  modal: {},
  filters: {
    productFilters: {
      category: '',
      minPrice: null,
      maxPrice: null,
      sortBy: 'createdAt',
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notification actions
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    
    // Drawer actions
    openDrawer: (state) => {
      state.drawer.open = true;
    },
    closeDrawer: (state) => {
      state.drawer.open = false;
    },
    
    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<string>) => {
      state.modal[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modal[action.payload] = false;
    },
    
    // Filter actions
    setProductFilters: (
      state,
      action: PayloadAction<{
        category?: string;
        minPrice?: number | null;
        maxPrice?: number | null;
        sortBy?: string;
      }>
    ) => {
      if (!state.filters) state.filters = {} as any;
      if (!state.filters.productFilters) {
        state.filters.productFilters = {
          category: '',
          minPrice: null,
          maxPrice: null,
          sortBy: 'createdAt',
        };
      }
      state.filters.productFilters = {
        ...state.filters.productFilters,
        ...action.payload,
      };
    },
    resetProductFilters: (state) => {
      if (!state.filters) state.filters = {} as any;
      state.filters.productFilters = {
        category: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'createdAt',
      };
    },
  },
});

export const {
  showNotification,
  hideNotification,
  openDrawer,
  closeDrawer,
  setLoading,
  setGlobalLoading,
  openModal,
  closeModal,
  setProductFilters,
  resetProductFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
