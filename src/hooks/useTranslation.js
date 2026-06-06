import { useState, useEffect, useCallback } from 'react';
import { getCurrentLocale, getDefaultLocale } from '../config/i18n.config';

// Cache de traducciones cargadas
const translationsCache = {};

/**
 * Hook useTranslation — FASE 2
 * 
 * Lee traducciones desde archivos JSON en /locales/
 * El idioma está fijo a 'es' en esta fase (sin detección automática)
 * 
 * Uso:
 * const { t } = useTranslation();
 * t('hero.title') // "Infraestructura de IA real para tu negocio"
 * t('hero.cta_primary') // "Ver planes y precios"
 * 
 * @param {string} namespace - Namespace de traducciones (default: 'common')
 * @returns {object} { t, locale, isLoading, error }
 */
export function useTranslation(namespace = 'common') {
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const locale = getCurrentLocale();
  const defaultLocale = getDefaultLocale();

  // Función para cargar traducciones
  const loadTranslations = useCallback(async () => {
    const cacheKey = `${locale}:${namespace}`;

    // Si ya está en caché, usarlo
    if (translationsCache[cacheKey]) {
      setTranslations(translationsCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cargar archivo de traducciones
      const translationsModule = await import(`../locales/${locale}/${namespace}.json`);
      const loadedTranslations = translationsModule.default || translationsModule;

      // Guardar en caché
      translationsCache[cacheKey] = loadedTranslations;
      setTranslations(loadedTranslations);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[i18n] Error loading translations for ${locale}/${namespace}:`, err);
      
      // Fallback al idioma por defecto si falla
      if (locale !== defaultLocale) {
        try {
          const defaultModule = await import(`../locales/${defaultLocale}/${namespace}.json`);
          const defaultTranslations = defaultModule.default || defaultModule;
          translationsCache[cacheKey] = defaultTranslations;
          setTranslations(defaultTranslations);
          return;
        } catch (fallbackErr) {
          // eslint-disable-next-line no-console
          console.error('[i18n] Fallback translations also failed:', fallbackErr);
        }
      }

      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [locale, namespace, defaultLocale]);

  // Cargar traducciones al montar
  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  /**
   * Función t() para obtener traducciones
   * 
   * @param {string} key - Clave de traducción (ej: 'hero.title')
   * @param {object} params - Parámetros para interpolación (futuro)
   * @returns {string} Texto traducido o la clave si no se encuentra
   */
  const t = useCallback((key, params = {}) => {
    // Navegar por el objeto de traducciones usando la notación de punto
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Si no se encuentra, devolver la clave (modo desarrollo)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] Missing translation: ${key}`);
        }
        return key;
      }
    }

    // Si es string, hacer interpolación básica
    if (typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    // Si es array u objeto, devolverlo tal cual
    return value;
  }, [translations]);

  return {
    t,
    locale,
    isLoading,
    error,
    translations
  };
}

export default useTranslation;
