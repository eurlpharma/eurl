# نظام وصف الصفحة الديناميكي (Dynamic Page Meta Description)

## نظرة عامة

نظام وصف الصفحة الديناميكي يقوم بتحديث وصف الصفحة (meta description) تلقائياً بناءً على:
- إعدادات الموقع من قاعدة البيانات
- نوع الصفحة الحالية
- محتوى الصفحة

## المكونات

### 1. Hook إدارة وصف الصفحة (`usePageMeta`)

**الموقع:** `src/hooks/usePageMeta.ts`

**الوظائف:**
- تحديث meta description تلقائياً عند تغيير الصفحة
- استخدام وصف الموقع الأساسي من الإعدادات
- إنشاء أوصاف مخصصة لكل نوع صفحة
- تحسين SEO

**الاستخدام:**
```tsx
import { usePageMeta } from '@/hooks/usePageMeta';

const MyComponent = () => {
  usePageMeta(); // يتم استدعاؤه تلقائياً في App.tsx
  return <div>...</div>;
};
```

### 2. المكون التجريبي (`PageMetaDebugger`)

**الموقع:** `src/components/debug/PageMetaDebugger.tsx`

**الوظائف:**
- عرض الوصف الحالي للصفحة
- مقارنة الوصف المتوقع مع الفعلي
- تحليل SEO (الطول، الكلمات المفتاحية)
- أمثلة على الأوصاف المختلفة

## أنواع الأوصاف

### الصفحة الرئيسية
```javascript
// يستخدم وصف الموقع الأساسي من الإعدادات
const baseDescription = siteDescription || 'متجر المنتجات الصحية والصيدلانية';
```

### صفحات المنتجات
```javascript
// قائمة المنتجات
'تصفح مجموعة واسعة من المنتجات الصحية والصيدلانية عالية الجودة'

// تفاصيل المنتج
'تفاصيل شاملة عن المنتج الصحي مع المواصفات والمراجعات'
```

### صفحات التسوق
```javascript
// سلة التسوق
'سلة التسوق - راجع منتجاتك المختارة وأكمل عملية الشراء'

// إتمام الطلب
'إتمام الطلب - أدخل بيانات الشحن والدفع لإكمال عملية الشراء'
```

### صفحات المصادقة
```javascript
// تسجيل الدخول
'تسجيل الدخول إلى حسابك للوصول إلى جميع الخدمات'

// نسيان كلمة المرور
'إعادة تعيين كلمة المرور - أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين'
```

### لوحة الإدارة
```javascript
// لوحة الإدارة الرئيسية
'لوحة إدارة المتجر - إدارة المنتجات والطلبات والمستخدمين'

// إدارة المنتجات
'إدارة المنتجات - أضف أو عدل أو احذف منتجات المتجر'

// إضافة منتج جديد
'إضافة منتج جديد - أدخل تفاصيل المنتج الجديد'
```

## التكامل مع النظام

### في App.tsx
```tsx
import { usePageMeta } from '@/hooks/usePageMeta';

function App() {
  // إدارة عنوان الصفحة الديناميكي
  usePageTitle();
  
  // إدارة وصف الصفحة الديناميكي
  usePageMeta();
  
  return (
    // ...
  );
}
```

### مع إعدادات التطبيق
```tsx
import { useAppSettings } from '@/hooks/useAppSettings';

const { desc: siteDescription } = useAppSettings();
// siteDescription يأتي من قاعدة البيانات
```

## تحسينات SEO

### طول الوصف
- **المثالي:** 150-160 حرف
- **الحد الأقصى:** 160 حرف
- **الحد الأدنى:** 50 حرف

### الكلمات المفتاحية
- تضمين كلمات مفتاحية ذات صلة
- تجنب التكرار المفرط
- استخدام لغة طبيعية

### التحديث التلقائي
- تحديث الوصف عند تغيير الصفحة
- استخدام إعدادات الموقع الأساسية
- تخصيص الوصف حسب نوع الصفحة

## الاستخدام المتقدم

### إضافة أوصاف مخصصة
```tsx
// في usePageMeta.ts
const getPageDescription = (pathname: string): string => {
  // إضافة منطق مخصص هنا
  if (pathname.includes('/custom-page')) {
    return 'وصف مخصص للصفحة الجديدة';
  }
  // ...
};
```

### دعم اللغات المتعددة
```tsx
// يمكن إضافة دعم للترجمة
const { t } = useTranslation('pageDescriptions');
return t('home.description');
```

## ملفات الترجمة المقترحة

### ar/pageDescriptions.json
```json
{
  "home": {
    "description": "متجر المنتجات الصحية والصيدلانية"
  },
  "products": {
    "description": "تصفح مجموعة واسعة من المنتجات الصحية والصيدلانية عالية الجودة"
  },
  "cart": {
    "description": "سلة التسوق - راجع منتجاتك المختارة وأكمل عملية الشراء"
  }
}
```

### en/pageDescriptions.json
```json
{
  "home": {
    "description": "Health and Pharmaceutical Products Store"
  },
  "products": {
    "description": "Browse a wide range of high-quality health and pharmaceutical products"
  },
  "cart": {
    "description": "Shopping Cart - Review your selected products and complete your purchase"
  }
}
```

### fr/pageDescriptions.json
```json
{
  "home": {
    "description": "Magasin de Produits de Santé et Pharmaceutiques"
  },
  "products": {
    "description": "Parcourez une large gamme de produits de santé et pharmaceutiques de haute qualité"
  },
  "cart": {
    "description": "Panier d'achat - Passez en revue vos produits sélectionnés et complétez votre achat"
  }
}
```

## الاختبار والتصحيح

### المكون التجريبي
```tsx
// إضافة إلى أي صفحة للاختبار
import PageMetaDebugger from '@/components/debug/PageMetaDebugger';

<PageMetaDebugger />
```

### معلومات التصحيح
- عرض الوصف الحالي
- مقارنة مع الوصف المتوقع
- تحليل طول الوصف
- فحص الكلمات المفتاحية

## إزالة المكونات التجريبية

بعد التأكد من عمل النظام:

1. حذف `PageMetaDebugger` من الصفحات
2. حذف ملف `PageMetaDebugger.tsx`
3. الاحتفاظ بـ `usePageMeta` hook

## ملاحظات مهمة

1. **الأداء:** النظام خفيف ولا يؤثر على الأداء
2. **SEO:** يحسن ترتيب الموقع في محركات البحث
3. **التحديث:** يتم تحديث الوصف تلقائياً عند تغيير الصفحة
4. **التخصيص:** يمكن تخصيص الأوصاف حسب الحاجة
5. **اللغة:** يدعم اللغات المتعددة (يمكن إضافة الترجمة)

## الدعم الفني

لأي استفسارات أو مشاكل:
- راجع console للرسائل التشخيصية
- استخدم المكون التجريبي للتحقق من الوصف
- تأكد من وجود إعدادات الموقع في قاعدة البيانات 