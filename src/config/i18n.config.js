// FASE 2 — Configuración de internacionalización
// CRÍTICO: NO activar sistema de cambio de idioma todavía.
// El multiidioma real se implementará en Fase 3 con Vike SSR.
// Los textos deben estar preparados en /locales/ pero no se hace detección de idioma.

export const i18nConfig = {
  // Idioma activo fijo para Fase 2
  // En Fase 3 se migrará a detección por ruta /es/ o /en/
  defaultLocale: 'es',
  currentLocale: 'es', // Constante — no cambiar en esta fase

  // Locales disponibles para Fase 3
  availableLocales: ['es', 'en'],

  // Namespace por defecto
  defaultNamespace: 'common',

  // Configuración de rutas para Fase 3 (preparación)
  routeConfig: {
    es: {
      home: '/',
      services: '/servicios',
      pricing: '/precios',
      contact: '/contacto',
      process: '/proceso',
      faq: '/faq'
    },
    en: {
      home: '/en',
      services: '/en/services',
      pricing: '/en/pricing',
      contact: '/en/contact',
      process: '/en/process',
      faq: '/en/faq'
    }
  }
};

/**
 * Función para cambiar de idioma (deshabilitada en Fase 2)
 * Se habilitará en Fase 3 con migración a Vike SSR
 * 
 * @param {string} locale - Código de idioma ('es' | 'en')
 * @returns {void}
 */
export function setLocale(locale) {
  // eslint-disable-next-line no-console
  console.warn(
    `[i18n] Cambio de idioma a "${locale}" ignorado. ` +
    'El sistema multiidioma se activará en Fase 3 con Vike SSR.'
  );
  // En Fase 2: no hace nada
  // En Fase 3: redirigirá a ruta /${locale}/...
}

/**
 * Obtiene el locale actual (siempre 'es' en Fase 2)
 * @returns {string}
 */
export function getCurrentLocale() {
  return i18nConfig.currentLocale;
}

/**
 * Obtiene el locale por defecto
 * @returns {string}
 */
export function getDefaultLocale() {
  return i18nConfig.defaultLocale;
}

export default i18nConfig;
