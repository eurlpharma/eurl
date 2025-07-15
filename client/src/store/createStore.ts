import { configureStore } from '@reduxjs/toolkit';
import { Reducer, AnyAction } from 'redux';

type ReducersMapObject = { [key: string]: Reducer<any, AnyAction> };

export function createAppStore(reducers: ReducersMapObject) {
  return configureStore({
    reducer: reducers,
    devTools: true,
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
