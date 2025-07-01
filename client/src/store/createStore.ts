// createStore.ts - ملف منفصل لإنشاء المتجر
import { configureStore } from '@reduxjs/toolkit';
import { Reducer, AnyAction } from 'redux';

// تعريف نوع للمخفضات
type ReducersMapObject = { [key: string]: Reducer<any, AnyAction> };

// دالة لإنشاء المتجر بالمخفضات
export function createAppStore(reducers: ReducersMapObject) {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['products/uploadProductImage/fulfilled'],
          ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
          ignoredPaths: ['products.uploadStatus'],
        },
      }),
  });
}
