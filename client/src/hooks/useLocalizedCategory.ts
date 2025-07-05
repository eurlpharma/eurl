import { useTranslation } from 'react-i18next';
import { getLocalizedCategoryName } from '../utils/formatters';

/**
 * Hook to get localized category name
 * @param category - Category object with multilingual names
 * @returns Localized category name
 */
export const useLocalizedCategory = (category: any) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  return getLocalizedCategoryName(category, currentLanguage);
};

/**
 * Hook to get localized category names for multiple categories
 * @param categories - Array of category objects
 * @returns Array of categories with localized names
 */
export const useLocalizedCategories = (categories: any[]) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  return categories.map(category => ({
    ...category,
    localizedName: getLocalizedCategoryName(category, currentLanguage)
  }));
}; 