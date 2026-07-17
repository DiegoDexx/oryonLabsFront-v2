import { useLocation } from 'react-router-dom';
import homeEs from '../locales/home/es.json';
import homeEn from '../locales/home/en.json';

// The two numbers live here once, sourced from the same locale files the
// rest of the site already uses for footer.contact — nothing hardcoded
// per-component.
const PHONE_BY_LANG = {
  es: homeEs.footer.contact.phone,
  en: homeEn.footer.contact.phone,
};

function detectLangFromNavigator() {
  // This app renders client-only (Vite + react-router, no SSR), so
  // `navigator` is always safe to read here. If SSR is ever introduced,
  // this call needs to move behind a mount-only effect instead.
  if (typeof navigator === 'undefined') return null;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of candidates || []) {
    if (l?.toLowerCase().startsWith('es')) return 'es';
    if (l?.toLowerCase().startsWith('en')) return 'en';
  }
  return null;
}

/**
 * Resolves which contact phone number to show, in priority order:
 * 1. Explicit /es or /en in the current route.
 * 2. The browser's language (navigator.language / navigator.languages).
 * 3. +44 (UK), the priority market, as the final fallback.
 */
export default function useContactPhone() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const routeLang = ['es', 'en'].includes(pathLang) ? pathLang : null;
  const lang = routeLang || detectLangFromNavigator() || 'en';

  return { lang, phone: PHONE_BY_LANG[lang] };
}
