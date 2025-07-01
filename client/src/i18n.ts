import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en', // Default language is English
    supportedLngs: ['en', 'fr', 'ar'],
    debug: false, // تعطيل وضع التصحيح لمنع رسائل المفاتيح المفقودة
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
    saveMissing: false,
    missingKeyHandler: () => {}, // تجاهل المفاتيح المفقودة
    returnNull: false, // استخدام المفتاح بدلاً من null عند عدم وجود ترجمة
    returnEmptyString: false, // استخدام المفتاح بدلاً من سلسلة فارغة عند عدم وجود ترجمة
  });

export default i18n;
