import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

/**
 * Hook مخصص لاستخدام إعدادات التطبيق
 * يوفر وصول سهل لإعدادات الموقع وحالة التحميل
 */
export const useAppSettings = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppSettings يجب استخدامه داخل AppProvider');
  }
  
  return context;
};

export default useAppSettings; 