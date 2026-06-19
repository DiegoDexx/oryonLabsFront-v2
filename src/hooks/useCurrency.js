const LOCALE_MAP = [
  { match: (l) => l === 'en-GB',              symbol: '£',  period: 'mo' },
  { match: (l) => l === 'en-AU',              symbol: 'A$', period: 'mo' },
  { match: (l) => l === 'en-CA',              symbol: 'C$', period: 'mo' },
  { match: (l) => l.startsWith('en'),         symbol: '$',  period: 'mo' },
];

export default function useCurrency() {
  const locale = navigator.language || 'es-ES';
  const match = LOCALE_MAP.find(entry => entry.match(locale));
  if (match) return { symbol: match.symbol, period: match.period };
  return { symbol: '€', period: 'mes' };
}
