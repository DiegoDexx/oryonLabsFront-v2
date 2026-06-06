/**
 * SEO Configuration — FASE 2 / Preparación FASE 3
 * 
 * Configuración estática de meta tags para todas las páginas.
 * En FASE 3 se implementará con React Helmet y Vike SSR.
 * 
 * Estructura:
 * - Meta tags básicos (title, description)
 * - Open Graph tags
 * - Twitter Card tags
 * - Configuración por idioma (es/en)
 */

export const siteConfig = {
  name: 'Oryon Labs',
  shortName: 'Oryon',
  url: 'https://oryonlabs.com',
  logo: '/logo-oryon.png',
  defaultLocale: 'es',
  author: 'Oryon Labs Team'
};

export const seoConfig = {
  // Spanish (Español) - Idioma por defecto
  es: {
    home: {
      title: 'Oryon Labs | Automatización IA para PyMEs',
      description: 'Automatizamos la captación de leads y atención al cliente con IA. Chatbots inteligentes, flujos de trabajo automatizados. Resultados medibles en 30 días.',
      keywords: 'automatización IA, chatbots PyMEs, automatización leads, IA empresas, agentes inteligentes, n8n, Make',
      ogImage: '/og-home-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/'
    },
    servicios: {
      title: 'Servicios de Automatización IA | Oryon Labs',
      description: 'Captación de leads 24/7, agentes IA de soporte, flujos de trabajo automatizados. Infraestructura de IA a medida para tu negocio.',
      keywords: 'chatbots IA, automatización procesos, agentes soporte, integración sistemas',
      ogImage: '/og-services-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/servicios'
    },
    precios: {
      title: 'Precios y Planes | Oryon Labs',
      description: 'Planes de automatización IA desde 199€/mes. Sin contratos anuales. Setup incluido. Escalabilidad garantizada.',
      keywords: 'precios automatización IA, planes chatbot, coste agentes IA',
      ogImage: '/og-pricing-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/precios'
    },
    proceso: {
      title: 'Nuestro Proceso | Oryon Labs',
      description: '4 pasos para transformar tu negocio: Diagnóstico, Diseño, Implementación y Resultados. Proceso probado en 30 días.',
      keywords: 'proceso automatización, implementación IA, transformación digital',
      ogImage: '/og-process-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/proceso'
    },
    contacto: {
      title: 'Contacto | Oryon Labs',
      description: '¿Listo para automatizar tu negocio? Habla con un experto. Respondemos en menos de 24 horas.',
      keywords: 'contacto automatización, consultoría IA',
      ogImage: '/og-contact-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/contacto'
    },
    faq: {
      title: 'Preguntas Frecuentes | Oryon Labs',
      description: 'Todo sobre automatización e IA para empresas. Resolvemos tus dudas sobre agentes inteligentes, implementación y ROI.',
      keywords: 'FAQ automatización, preguntas IA empresas',
      ogImage: '/og-faq-es.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/faq'
    }
  },

  // English (Inglés)
  en: {
    home: {
      title: 'Oryon Labs | AI Automation for SMBs',
      description: 'We automate lead capture and customer service with AI. Intelligent chatbots, automated workflows. Measurable results in 30 days.',
      keywords: 'AI automation, SMB chatbots, lead automation, business AI, intelligent agents, n8n, Make',
      ogImage: '/og-home-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en'
    },
    services: {
      title: 'AI Automation Services | Oryon Labs',
      description: '24/7 lead capture, AI support agents, automated workflows. Custom AI infrastructure for your business.',
      keywords: 'AI chatbots, process automation, support agents, system integration',
      ogImage: '/og-services-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en/services'
    },
    pricing: {
      title: 'Pricing & Plans | Oryon Labs',
      description: 'AI automation plans from €199/month. No annual contracts. Setup included. Guaranteed scalability.',
      keywords: 'AI automation pricing, chatbot plans, AI agent costs',
      ogImage: '/og-pricing-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en/pricing'
    },
    process: {
      title: 'Our Process | Oryon Labs',
      description: '4 steps to transform your business: Diagnosis, Design, Implementation, and Results. Proven 30-day process.',
      keywords: 'automation process, AI implementation, digital transformation',
      ogImage: '/og-process-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en/process'
    },
    contact: {
      title: 'Contact | Oryon Labs',
      description: 'Ready to automate your business? Talk to an expert. We respond in less than 24 hours.',
      keywords: 'automation contact, AI consulting',
      ogImage: '/og-contact-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en/contact'
    },
    faq: {
      title: 'FAQ | Oryon Labs',
      description: 'Everything about business automation and AI. We answer your questions about intelligent agents, implementation, and ROI.',
      keywords: 'automation FAQ, business AI questions',
      ogImage: '/og-faq-en.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: '/en/faq'
    }
  }
};

/**
 * Genera meta tags completos para una página específica
 * 
 * FASE 3: Esta función se usará con React Helmet para inyectar tags en SSR
 * 
 * @param {string} pageKey - Clave de la página (ej: 'home', 'services')
 * @param {string} locale - Código de idioma ('es' | 'en')
 * @returns {object} Objeto con todos los meta tags
 */
export function generateMetaTags(pageKey, locale = 'es') {
  const config = seoConfig[locale]?.[pageKey] || seoConfig.es.home;
  const site = siteConfig;

  return {
    // Meta tags básicos
    title: config.title,
    description: config.description,
    keywords: config.keywords,

    // Open Graph
    'og:title': config.title,
    'og:description': config.description,
    'og:image': `${site.url}${config.ogImage}`,
    'og:url': `${site.url}${config.canonical}`,
    'og:type': config.ogType,
    'og:locale': locale === 'es' ? 'es_ES' : 'en_US',
    'og:site_name': site.name,

    // Twitter Card
    'twitter:card': config.twitterCard,
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': `${site.url}${config.ogImage}`,

    // Canonical
    canonical: `${site.url}${config.canonical}`
  };
}

/**
 * Genera un objeto con meta tags por defecto
 * Útil para páginas no definidas explícitamente
 * 
 * @param {string} locale - Código de idioma
 * @returns {object} Meta tags por defecto
 */
export function getDefaultMetaTags(locale = 'es') {
  const config = seoConfig[locale]?.home || seoConfig.es.home;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage: config.ogImage,
    twitterCard: config.twitterCard
  };
}

export default {
  siteConfig,
  seoConfig,
  generateMetaTags,
  getDefaultMetaTags
};

/**
 * NOTAS PARA FASE 3 (Vike + React Helmet):
 * 
 * 1. Instalar dependencias:
 *    npm install vike react-helmet-async
 * 
 * 2. Migrar estructura de carpetas a:
 *    pages/
 *    ├── +Layout.jsx
 *    ├── index/
 *    │   ├── +Page.jsx
 *    │   └── +config.js (export { seoConfig.es.home })
 *    ├── servicios/
 *    │   ├── +Page.jsx
 *    │   └── +config.js
 *    └── ...
 * 
 * 3. En +Layout.jsx usar HelmetProvider y Helmet:
 *    import { Helmet } from 'react-helmet-async';
 *    // Inyectar meta tags desde generateMetaTags()
 * 
 * 4. Configurar Vike para SSR completo con rutas multiidioma:
 *    - / (redirect a /es)
 *    - /es/* (español)
 *    - /en/* (inglés)
 */
