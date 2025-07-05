import i18n from '../i18n';

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPrice = (price: number) => {
  const lang = i18n.language || 'en';
  let symbol = 'DA';
  if (lang.startsWith('ar')) symbol = 'دج';
  else if (lang.startsWith('fr') || lang.startsWith('en')) symbol = 'DA';
  return `${price.toLocaleString(lang)} ${symbol}`;
};

/**
 * Get localized category name based on current language
 * @param category - Category object with multilingual names
 * @param currentLanguage - Current language code (ar, en, fr)
 * @returns Localized category name
 */
export const getLocalizedCategoryName = (category: any, currentLanguage: string): string => {
  if (!category) return '';
  
  // Return the appropriate name based on language
  switch (currentLanguage) {
    case 'ar':
      return category.nameAr || '';
    case 'en':
      return category.nameEn || '';
    case 'fr':
      return category.nameFr || '';
    default:
      return category.nameAr || category.nameEn || category.nameFr || '';
  }
}; 