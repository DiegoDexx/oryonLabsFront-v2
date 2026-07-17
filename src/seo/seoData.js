import seoTextEs from '../locales/seo/es.json';
import seoTextEn from '../locales/seo/en.json';

const BASE_URL    = 'https://oryonx.ai';
const OG_IMAGE_ES = `${BASE_URL}/og-image-es.png`;
const OG_IMAGE_EN = `${BASE_URL}/og-image-en.png`;

const seoText = { es: seoTextEs, en: seoTextEn };

// Relative path (no leading slash) per page key, per language. Only the
// legacy "servicios"/"precios" (es) vs "services"/"pricing" (en) pair
// diverges in name between languages — everything else shares the slug.
const PATHS = {
  'asistente-24-7': { es: 'servicios/asistente-24-7', en: 'servicios/asistente-24-7' },
  crm:              { es: 'servicios/crm',            en: 'servicios/crm' },
  'desarrollo-web': { es: 'servicios/desarrollo-web', en: 'servicios/desarrollo-web' },
  integraciones:    { es: 'servicios/integraciones',  en: 'servicios/integraciones' },
  'custom-ai':      { es: 'servicios/custom-ai',      en: 'servicios/custom-ai' },
  faq:              { es: 'faq',                      en: 'faq' },
  blog:             { es: 'blog',                     en: 'blog' },
  terms:            { es: 'terms',                    en: 'terms' },
  privacy:          { es: 'privacy',                  en: 'privacy' },
  'data-deletion':  { es: 'data-deletion',             en: 'data-deletion' },
  aboutus:          { es: 'aboutus',                   en: 'aboutus' },
  contacto:         { es: 'contacto',                  en: 'contacto' },
};

// Text-only key per language differs here ("servicios"/"precios" in
// es.json vs "services"/"pricing" in en.json) — kept as separate entries
// below rather than forced into PATHS, since the lookup key itself changes.
const LEGACY_ENTRIES = [
  { esKey: 'servicios', esPath: 'servicios', enKey: 'services', enPath: 'services' },
  { esKey: 'precios',   esPath: 'precios',   enKey: 'pricing',  enPath: 'pricing' },
];

function alternatesFor(pathEs, pathEn) {
  return {
    es:          `${BASE_URL}/es/${pathEs}`,
    en:          `${BASE_URL}/en/${pathEn}`,
    'x-default': `${BASE_URL}/en/${pathEn}`,
  };
}

function buildEntry(lang, textKey, path, altPathEs, altPathEn) {
  const text = seoText[lang][textKey];
  if (!text) return null;
  return {
    ...text,
    url:        `${BASE_URL}/${lang}/${path}`,
    image:      lang === 'es' ? OG_IMAGE_ES : OG_IMAGE_EN,
    lang,
    alternates: alternatesFor(altPathEs, altPathEn),
  };
}

function buildLangData(lang) {
  const out = {};
  for (const [key, paths] of Object.entries(PATHS)) {
    const entry = buildEntry(lang, key, paths[lang], paths.es, paths.en);
    if (entry) out[key] = entry;
  }
  for (const { esKey, esPath, enKey, enPath } of LEGACY_ENTRIES) {
    const key = lang === 'es' ? esKey : enKey;
    const path = lang === 'es' ? esPath : enPath;
    const entry = buildEntry(lang, key, path, esPath, enPath);
    if (entry) out[key] = entry;
  }
  return out;
}

const HOME_ALTERNATES = { es: `${BASE_URL}/es`, en: `${BASE_URL}/en`, 'x-default': `${BASE_URL}/en` };

function buildHome(lang) {
  return {
    ...seoText[lang].home,
    url:        `${BASE_URL}/${lang}`,
    image:      lang === 'es' ? OG_IMAGE_ES : OG_IMAGE_EN,
    lang,
    alternates: HOME_ALTERNATES,
  };
}

export const seoData = {
  es: { ...buildLangData('es'), home: buildHome('es') },
  en: { ...buildLangData('en'), home: buildHome('en') },
};

export const SCHEMA_LD = {
  '@context': 'https://schema.org',
  '@type':    'ProfessionalService',
  name:        'OryonX',
  url:         BASE_URL,
  logo:        'https://i.ibb.co/TMQHCkCZ/logo-blue2.png',
  description: 'AI automation agency for SMBs. Lead capture, customer support and workflow automation.',
  address: {
    '@type':          'PostalAddress',
    addressLocality:  'Alicante',
    addressCountry:   'ES',
  },
  areaServed:  ['ES', 'GB'],
  serviceType: ['AI Automation', 'Chatbot Development', 'Workflow Automation', 'Web Development'],
  contactPoint: {
    '@type':       'ContactPoint',
    email:         'support@oryonx.ai',
    contactType:   'customer service',
  },
};
