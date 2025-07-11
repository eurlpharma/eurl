import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from './useAppSettings';

export const usePageMeta = () => {
  const location = useLocation();
  const { desc: siteDescription } = useAppSettings();
  const { i18n } = useTranslation('pageTitles');

  useEffect(() => {
    const baseDescription = siteDescription || 'متجر المنتجات الصحية والصيدلانية';
    
    const getPageDescription = (pathname: string): string => {
      const path = pathname.toLowerCase();
      
      if (path === '/' || path === '') {
        return baseDescription;
      }
      
      if (path.includes('/products')) {
        if (path.includes('/products/') && !path.endsWith('/products')) {
          return 'تفاصيل شاملة عن المنتج الصحي مع المواصفات والمراجعات';
        }
        return 'تصفح مجموعة واسعة من المنتجات الصحية والصيدلانية عالية الجودة';
      }
      
      if (path.includes('/cart')) {
        return 'سلة التسوق - راجع منتجاتك المختارة وأكمل عملية الشراء';
      }
      
      if (path.includes('/checkout')) {
        return 'إتمام الطلب - أدخل بيانات الشحن والدفع لإكمال عملية الشراء';
      }
      
      if (path.includes('/about')) {
        return 'تعرف على متجرنا ورسالتنا في تقديم أفضل المنتجات الصحية للعملاء';
      }
      
      if (path.includes('/auth-login')) {
        return 'تسجيل الدخول إلى حسابك للوصول إلى جميع الخدمات';
      }
      if (path.includes('/auth-forgot-password')) {
        return 'إعادة تعيين كلمة المرور - أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين';
      }
      if (path.includes('/auth-reset-password')) {
        return 'إعادة تعيين كلمة المرور - أدخل كلمة المرور الجديدة';
      }
      
      if (path.includes('/orders/') && !path.includes('/admin')) {
        return 'تفاصيل الطلب - راجع معلومات طلبك وحالة التوصيل';
      }
      
      if (path.includes('/admin')) {
        const adminPath = path.replace('/admin', '').replace(/^\/+|\/+$/g, '');
        
        if (!adminPath) {
          return 'لوحة إدارة المتجر - إدارة المنتجات والطلبات والمستخدمين';
        }
        
        const adminDescriptions: { [key: string]: string } = {
          'analytics': 'التحليلات والإحصائيات - راجع أداء المتجر والمبيعات',
          'products': 'إدارة المنتجات - أضف أو عدل أو احذف منتجات المتجر',
          'categories': 'إدارة الفئات - نظم منتجاتك في فئات منظمة',
          'orders': 'إدارة الطلبات - تتبع وتدير طلبات العملاء',
          'users': 'إدارة المستخدمين - تدير حسابات المستخدمين والصلاحيات',
          'settings': 'إعدادات المتجر - عدل إعدادات الموقع والمتجر'
        };
        
        if (adminPath.includes('/')) {
          const [section, action] = adminPath.split('/');
          if (section === 'products') {
            if (action === 'add') {
              return 'إضافة منتج جديد - أدخل تفاصيل المنتج الجديد';
            }
            if (action === 'edit') {
              return 'تعديل المنتج - عدل تفاصيل المنتج المحدد';
            }
          }
          if (section === 'orders' && action !== 'print') {
            return 'تفاصيل الطلب - راجع وتدير تفاصيل الطلب المحدد';
          }
          if (section === 'orders' && action === 'print') {
            return 'طباعة الطلب - اطبع فاتورة الطلب للعميل';
          }
        }
        
        return adminDescriptions[adminPath] || 'لوحة إدارة المتجر';
      }
      
      if (path.includes('*')) {
        return 'الصفحة غير موجودة - عذراً، الصفحة التي تبحث عنها غير متوفرة';
      }
      
      return baseDescription;
    };

    const pageDescription = getPageDescription(location.pathname);
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = pageDescription;
      document.head.appendChild(newMetaDescription);
    }
        
  }, [location.pathname, siteDescription, i18n.language]);

  return null;
};

export default usePageMeta; 