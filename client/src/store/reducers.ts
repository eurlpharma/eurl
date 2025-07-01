// هذا الملف لم يعد مستخدمًا - تم نقل الاستيرادات مباشرة إلى ملف index.ts
// تم إنشاء هذا الملف فقط للحفاظ على بنية المشروع

import { combineReducers } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  products: productReducer,
  categories: categoryReducer,
  auth: authReducer,
});
