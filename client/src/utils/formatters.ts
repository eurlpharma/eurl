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