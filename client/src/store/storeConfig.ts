// storeConfig.ts - ملف تكوين المتجر المنفصل
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';

// تكوين المتجر الأساسي
export const store = configureStore({
  reducer: {
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['products/uploadProductImage/fulfilled'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['products.uploadStatus'],
      },
    }),
});

// تعريف أنواع TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// تصدير المتجر
export default store;
