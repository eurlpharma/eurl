import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from './useAppSettings';

/**
 * Hook لإدارة عنوان الصفحة الديناميكي مع دعم الترجمة متعددة اللغات
 * يحافظ على اسم الموقع الأساسي ويضيف اسم الصفحة الحالية باللغة المحددة
 */
export const usePageTitle = () => {
  const location = useLocation();
  const { title: siteTitle } = useAppSettings();
  const { t, i18n } = useTranslation('pageTitles');

  useEffect(() => {
    const baseTitle = siteTitle || 'RS Pharm';
    
    // تحديد مفتاح الترجمة بناءً على المسار
    const getPageTitleKey = (pathname: string): string => {
      const path = pathname.toLowerCase();
      
      // الصفحة الرئيسية
      if (path === '/' || path === '') {
        return 'home';
      }
      
      // صفحات المنتجات
      if (path.includes('/products')) {
        if (path.includes('/products/') && !path.endsWith('/products')) {
          return 'productDetails';
        }
        return 'products';
      }
      
      // صفحة السلة
      if (path.includes('/cart')) {
        return 'cart';
      }
      
      // صفحة الدفع
      if (path.includes('/checkout')) {
        return 'checkout';
      }
      
      // صفحة من نحن
      if (path.includes('/about')) {
        return 'about';
      }
      
      // صفحات المصادقة
      if (path.includes('/auth-login')) {
        return 'login';
      }
      if (path.includes('/auth-forgot-password')) {
        return 'forgotPassword';
      }
      if (path.includes('/auth-reset-password')) {
        return 'resetPassword';
      }
      
      // صفحات الطلبات
      if (path.includes('/orders/') && !path.includes('/admin')) {
        return 'orderDetails';
      }
      
      // لوحة الإدارة
      if (path.includes('/admin')) {
        const adminPath = path.replace('/admin', '').replace(/^\/+|\/+$/g, '');
        
        if (!adminPath) {
          return 'admin';
        }
        
        // تحديد صفحة الإدارة الفرعية
        const adminPages: { [key: string]: string } = {
          'analytics': 'analytics',
          'products': 'adminProducts',
          'categories': 'adminCategories',
          'orders': 'adminOrders',
          'users': 'adminUsers',
          'settings': 'settings'
        };
        
        // إذا كان هناك معرف (مثل edit/:id)
        if (adminPath.includes('/')) {
          const [section, action] = adminPath.split('/');
          if (section === 'products') {
            if (action === 'add') {
              return 'addProduct';
            }
            if (action === 'edit') {
              return 'editProduct';
            }
          }
          if (section === 'orders' && action !== 'print') {
            return 'orderDetails';
          }
          if (section === 'orders' && action === 'print') {
            return 'printOrder';
          }
        }
        
        return adminPages[adminPath] || 'admin';
      }
      
      // الصفحة غير موجودة
      if (path.includes('*')) {
        return 'pageNotFound';
      }
      
      return 'page';
    };

    const pageTitleKey = getPageTitleKey(location.pathname);
    const pageName = t(pageTitleKey);
    const fullTitle = pageName ? `${baseTitle} - ${pageName}` : baseTitle;
    
    // تحديث عنوان الصفحة
    document.title = fullTitle;
    
    console.log(`📄 تم تحديث عنوان الصفحة: "${fullTitle}" (${i18n.language})`);
    
  }, [location.pathname, siteTitle, t, i18n.language]);

  return null;
};

export default usePageTitle; 