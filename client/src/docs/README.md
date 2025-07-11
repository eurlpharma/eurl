# توثيق مشروع Healthy - متجر المنتجات الصحية

## نظرة عامة

مشروع Healthy هو تطبيق ويب متكامل لمتجر المنتجات الصحية والصيدلانية مبني بـ React و Node.js مع دعم اللغات المتعددة (العربية، الإنجليزية، الفرنسية).

## الميزات الرئيسية

### 1. نظام إعدادات التطبيق الديناميكي
- جلب إعدادات الموقع من قاعدة البيانات
- إدارة اسم الموقع، الوصف، معلومات الاتصال
- إعدادات وسائل التواصل الاجتماعي والسياسات
- تحديث ديناميكي للإعدادات

### 2. نظام عناوين الصفحات الديناميكي
- عناوين صفحات ديناميكية مع اسم الموقع
- دعم اللغات المتعددة (العربية، الإنجليزية، الفرنسية)
- تحديث تلقائي عند تغيير الصفحة
- تحسين SEO

### 3. نظام وصف الصفحات الديناميكي ⭐ **جديد**
- أوصاف صفحات ديناميكية من إعدادات التطبيق
- أوصاف مخصصة لكل نوع صفحة
- تحسين SEO مع طول مثالي (150-160 حرف)
- تحديث تلقائي عند تغيير الصفحة

### 4. نظام المصادقة
- تسجيل الدخول والخروج
- إدارة الجلسات
- حماية المسارات

### 5. دعم اللغات المتعددة
- العربية (الافتراضية)
- الإنجليزية
- الفرنسية
- تبديل سلس بين اللغات

## الملفات الرئيسية

### Hooks
- `src/hooks/useAppSettings.ts` - إدارة إعدادات التطبيق
- `src/hooks/usePageTitle.ts` - إدارة عناوين الصفحات
- `src/hooks/usePageMeta.ts` - إدارة أوصاف الصفحات ⭐ **جديد**

### Context
- `src/context/AppContext.tsx` - سياق التطبيق الرئيسي

### المكونات التجريبية
- `src/components/debug/AppSettingsDebugger.tsx` - عرض إعدادات التطبيق
- `src/components/debug/PageTitleDebugger.tsx` - عرض عناوين الصفحات
- `src/components/debug/PageMetaDebugger.tsx` - عرض أوصاف الصفحات ⭐ **جديد**

### ملفات الترجمة
- `public/locales/ar/pageTitles.json` - عناوين الصفحات بالعربية
- `public/locales/en/pageTitles.json` - عناوين الصفحات بالإنجليزية
- `public/locales/fr/pageTitles.json` - عناوين الصفحات بالفرنسية

## الاستخدام

### 1. إعدادات التطبيق
```tsx
import { useAppSettings } from '@/hooks/useAppSettings';

const { name, desc, email, phone } = useAppSettings();
```

### 2. عناوين الصفحات
```tsx
import { usePageTitle } from '@/hooks/usePageTitle';

// يتم استدعاؤه تلقائياً في App.tsx
usePageTitle();
```

### 3. أوصاف الصفحات ⭐ **جديد**
```tsx
import { usePageMeta } from '@/hooks/usePageMeta';

// يتم استدعاؤه تلقائياً في App.tsx
usePageMeta();
```

### 4. تبديل اللغة
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('en'); // تغيير إلى الإنجليزية
```

## التكامل في App.tsx

```tsx
import { usePageTitle } from '@/hooks/usePageTitle';
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

## المكونات التجريبية

### إضافة للاختبار
```tsx
import PageTitleDebugger from '@/components/debug/PageTitleDebugger';
import PageMetaDebugger from '@/components/debug/PageMetaDebugger';

// في أي صفحة
<PageTitleDebugger />
<PageMetaDebugger />
```

### إزالة بعد التأكد من العمل
1. حذف المكونات التجريبية من الصفحات
2. حذف ملفات المكونات التجريبية
3. الاحتفاظ بـ hooks الرئيسية

## تحسينات SEO

### عناوين الصفحات
- تنسيق: `اسم الموقع - اسم الصفحة`
- مثال: `RS Pharm - الصفحة الرئيسية`

### أوصاف الصفحات ⭐ **جديد**
- طول مثالي: 150-160 حرف
- كلمات مفتاحية ذات صلة
- وصف مخصص لكل صفحة
- تحديث تلقائي

## ملفات التوثيق

- `docs/AppSettings.md` - نظام إعدادات التطبيق
- `docs/PageTitleSystem.md` - نظام عناوين الصفحات
- `docs/PageMetaSystem.md` - نظام أوصاف الصفحات ⭐ **جديد**

## التطوير المستقبلي

### دعم اللغات المتعددة للأوصاف
- إنشاء ملفات ترجمة للأوصاف
- `pageDescriptions.json` لكل لغة
- دمج مع نظام الترجمة الحالي

### تحسينات SEO إضافية
- إدارة meta keywords
- إدارة Open Graph tags
- إدارة Twitter Cards

### إدارة المحتوى الديناميكي
- إدارة المحتوى من لوحة الإدارة
- تحرير الأوصاف والعناوين
- معاينة مباشرة للتغييرات

## الدعم الفني

لأي استفسارات أو مشاكل:
- راجع console للرسائل التشخيصية
- استخدم المكونات التجريبية للتحقق
- تأكد من وجود إعدادات الموقع في قاعدة البيانات
- راجع ملفات التوثيق التفصيلية 