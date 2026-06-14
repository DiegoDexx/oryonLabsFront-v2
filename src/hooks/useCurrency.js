const LOCALE_CURRENCY = {
  'en-GB': '£',
  'en-AU': 'A$',
  'en-CA': 'C$',
  'en-US': '$',
};

export default function useCurrency() {
  // SOLO EN DEV — comenta esta línea en producción
  // const testLocale = import.meta.env.DEV ? 'en-US' : null;
  
  const locale = navigator.language || 'es-ES';
  
  if (locale === 'en-GB') return { symbol: '£', period: 'mo' };
  if (locale.startsWith('en')) return { symbol: '$', period: 'mo' };
  return { symbol: '€' };
}