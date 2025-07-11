import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from './useAppSettings';


export const usePageTitle = () => {
  const location = useLocation();
  const { title: siteTitle } = useAppSettings();
  const { t, i18n } = useTranslation('pageTitles');

  useEffect(() => {
    const baseTitle = siteTitle || 'RS Pharm';
    
    const getPageTitleKey = (pathname: string): string => {
      const path = pathname.toLowerCase();
      
      if (path === '/' || path === '') {
        return 'home';
      }
      
      if (path.includes('/products')) {
        if (path.includes('/products/') && !path.endsWith('/products')) {
          return 'productDetails';
        }
        return 'products';
      }
      
      if (path.includes('/cart')) {
        return 'cart';
      }
      
      if (path.includes('/checkout')) {
        return 'checkout';
      }
      
      if (path.includes('/about')) {
        return 'about';
      }
      
      if (path.includes('/auth-login')) {
        return 'login';
      }
      if (path.includes('/auth-forgot-password')) {
        return 'forgotPassword';
      }
      if (path.includes('/auth-reset-password')) {
        return 'resetPassword';
      }
      
      if (path.includes('/orders/') && !path.includes('/admin')) {
        return 'orderDetails';
      }
      
      if (path.includes('/admin')) {
        const adminPath = path.replace('/admin', '').replace(/^\/+|\/+$/g, '');
        
        if (!adminPath) {
          return 'admin';
        }
        
        const adminPages: { [key: string]: string } = {
          'analytics': 'analytics',
          'products': 'adminProducts',
          'categories': 'adminCategories',
          'orders': 'adminOrders',
          'users': 'adminUsers',
          'settings': 'settings'
        };
        
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
      
      if (path.includes('*')) {
        return 'pageNotFound';
      }
      
      return 'page';
    };

    const pageTitleKey = getPageTitleKey(location.pathname);
    const pageName = t(pageTitleKey);
    const fullTitle = pageName ? `${baseTitle} - ${pageName}` : baseTitle;
    
    document.title = fullTitle;
    
  }, [location.pathname, siteTitle, t, i18n.language]);

  return null;
};

export default usePageTitle; 