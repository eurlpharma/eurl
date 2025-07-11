import instance from './axios';

export interface AppSettings {
  title?: string;
  desc?: string;
  logo?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    map?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  policies?: {
    shipping?: string;
    return?: string;
    privacy?: string;
    terms?: string;
  };
  store?: {
    maintenance?: boolean;
    currency?: "DZ" | "DZD" | "EUR" | "$" | "USD";
    minOrder?: number;
    freeShipThreshold?: number;
    taxRate?: number;
  };
}

/**
 * تنظيف وتوحيد البيانات المستلمة من الخادم
 * @param rawData البيانات الخام من الخادم
 * @returns AppSettings البيانات المنظفة
 */
const normalizeSettings = (rawData: any): AppSettings => {
  console.log('🔄 تنظيف البيانات المستلمة:', rawData);
  
  const settings: AppSettings = {};
  
  // إزالة الحقول غير المرغوبة
  const { success, updated, ...cleanData } = rawData;
  
  // معالجة اسم الموقع
  settings.title = cleanData.siteName || cleanData.site_name || cleanData.title;
  
  // معالجة وصف الموقع
  settings.desc = cleanData.siteDescription || cleanData.site_description || cleanData.desc;
  
  // معالجة الشعار
  settings.logo = cleanData.siteLogo || cleanData.logo;
  
  // معالجة معلومات الاتصال
  settings.contact = {
    email: cleanData.contactEmail || cleanData.contact_email || cleanData.email,
    phone: cleanData.contactPhone || cleanData.contact_phone || cleanData.phone,
    address: cleanData.address,
    map: cleanData.googleMapUrl || cleanData.map
  };
  
  // معالجة وسائل التواصل الاجتماعي
  if (cleanData.socialMedia) {
    try {
      const socialData = typeof cleanData.socialMedia === 'string' 
        ? JSON.parse(cleanData.socialMedia) 
        : cleanData.socialMedia;
      
      settings.social = {
        facebook: socialData.facebook,
        twitter: socialData.twitter,
        instagram: socialData.instagram
      };
    } catch (error) {
      console.warn('⚠️ خطأ في تحليل بيانات وسائل التواصل الاجتماعي:', error);
    }
  }
  
  // معالجة السياسات
  settings.policies = {
    shipping: cleanData.shippingPolicy || cleanData.shipping,
    return: cleanData.returnPolicy || cleanData.return,
    privacy: cleanData.privacyPolicy || cleanData.privacy,
    terms: cleanData.termsAndConditions || cleanData.terms
  };
  
  // معالجة إعدادات المتجر
  settings.store = {
    maintenance: cleanData.maintenanceMode === 'true' || cleanData.maintenance === true,
    currency: cleanData.currency,
    minOrder: Number(cleanData.minimumOrderAmount) || Number(cleanData.minOrder) || 0,
    freeShipThreshold: Number(cleanData.freeShippingThreshold) || Number(cleanData.freeShipThreshold) || 0,
    taxRate: Number(cleanData.taxRate) || 0
  };
  
  // إزالة القيم الفارغة
  Object.keys(settings).forEach(key => {
    if (settings[key as keyof AppSettings] === undefined || settings[key as keyof AppSettings] === null) {
      delete settings[key as keyof AppSettings];
    }
  });
  
  // تنظيف الكائنات الفرعية
  if (settings.contact) {
    Object.keys(settings.contact).forEach(key => {
      if (!settings.contact![key as keyof typeof settings.contact] || 
          settings.contact![key as keyof typeof settings.contact] === '') {
        delete settings.contact![key as keyof typeof settings.contact];
      }
    });
    if (Object.keys(settings.contact).length === 0) {
      delete settings.contact;
    }
  }
  
  if (settings.social) {
    Object.keys(settings.social).forEach(key => {
      if (!settings.social![key as keyof typeof settings.social] || 
          settings.social![key as keyof typeof settings.social] === '') {
        delete settings.social![key as keyof typeof settings.social];
      }
    });
    if (Object.keys(settings.social).length === 0) {
      delete settings.social;
    }
  }
  
  if (settings.policies) {
    Object.keys(settings.policies).forEach(key => {
      if (!settings.policies![key as keyof typeof settings.policies] || 
          settings.policies![key as keyof typeof settings.policies] === '') {
        delete settings.policies![key as keyof typeof settings.policies];
      }
    });
    if (Object.keys(settings.policies).length === 0) {
      delete settings.policies;
    }
  }
  
  if (settings.store) {
    Object.keys(settings.store).forEach(key => {
      if (settings.store![key as keyof typeof settings.store] === undefined || 
          settings.store![key as keyof typeof settings.store] === null) {
        delete settings.store![key as keyof typeof settings.store];
      }
    });
    if (Object.keys(settings.store).length === 0) {
      delete settings.store;
    }
  }
  
  console.log('✅ البيانات المنظفة:', settings);
  return settings;
};

/**
 * جلب إعدادات الموقع من الخادم
 * @returns Promise<AppSettings>
 */
export const fetchAppSettings = async (): Promise<AppSettings> => {
  try {
    const response = await instance.get('/api/settings');
    console.log('🔧 تم جلب إعدادات الموقع بنجاح:', response.data);
    
    // تنظيف وتوحيد البيانات
    const normalizedSettings = normalizeSettings(response.data);
    
    return normalizedSettings;
  } catch (error) {
    console.error('❌ خطأ في جلب إعدادات الموقع:', error);
    throw error;
  }
};

/**
 * تحديث إعدادات الموقع (للمدير فقط)
 * @param settings الإعدادات الجديدة
 * @returns Promise<any>
 */
export const updateAppSettings = async (settings: Partial<AppSettings>): Promise<any> => {
  try {
    const response = await instance.put('/api/settings', settings);
    console.log('✅ تم تحديث إعدادات الموقع بنجاح:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في تحديث إعدادات الموقع:', error);
    throw error;
  }
}; 