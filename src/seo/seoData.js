const BASE_URL   = 'https://oryonlabs.com';
const OG_IMAGE_ES = `${BASE_URL}/og-image-es.png`;
const OG_IMAGE_EN = `${BASE_URL}/og-image-en.png`;

const ALTERNATES = {
  es:          `${BASE_URL}/es`,
  en:          `${BASE_URL}/en`,
  'x-default': `${BASE_URL}/en`,
};

export const seoData = {
  es: {
    home: {
      title:       'Oryon Labs | Agencia de IA en Alicante — Automatización para PyMEs',
      description: 'Agencia de inteligencia artificial en Alicante. Automatizamos la captación de leads, atención al cliente y flujos de trabajo de tu empresa con IA a medida. Sin conocimientos técnicos.',
      keywords:    'agencia de IA en Alicante, automatización con inteligencia artificial, chatbot para empresas, automatización de procesos, creación de páginas web con IA',
      url:         `${BASE_URL}/es`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  ALTERNATES,
    },
    faq: {
      title:       'Preguntas Frecuentes | Oryon Labs',
      description: 'Todo sobre automatización e IA para empresas. Resolvemos tus dudas sobre agentes inteligentes, implementación y ROI.',
      keywords:    'FAQ automatización, preguntas IA empresas, dudas chatbot',
      url:         `${BASE_URL}/es/faq`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  { es: `${BASE_URL}/es/faq`, en: `${BASE_URL}/en/faq`, 'x-default': `${BASE_URL}/en/faq` },
    },
    servicios: {
      title:       'Servicios de Automatización IA | Oryon Labs',
      description: 'Captación de leads 24/7, agentes IA de soporte, flujos de trabajo automatizados. Infraestructura de IA a medida para tu negocio.',
      keywords:    'chatbots IA, automatización procesos, agentes soporte, integración sistemas',
      url:         `${BASE_URL}/es/servicios`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  { es: `${BASE_URL}/es/servicios`, en: `${BASE_URL}/en/services`, 'x-default': `${BASE_URL}/en/services` },
    },
    precios: {
      title:       'Precios y Planes | Oryon Labs',
      description: 'Planes de automatización IA desde 199€/mes. Sin contratos anuales. Setup incluido. Escalabilidad garantizada.',
      keywords:    'precios automatización IA, planes chatbot, coste agentes IA',
      url:         `${BASE_URL}/es/precios`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  { es: `${BASE_URL}/es/precios`, en: `${BASE_URL}/en/pricing`, 'x-default': `${BASE_URL}/en/pricing` },
    },
    terms: {
      title:       'Términos de Servicio | Oryon Labs',
      description: 'Condiciones de uso y contratación de los servicios de automatización con IA de Oryon Labs.',
      keywords:    'términos de servicio, condiciones de uso, legal Oryon Labs',
      url:         `${BASE_URL}/es/terms`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  { es: `${BASE_URL}/es/terms`, en: `${BASE_URL}/en/terms`, 'x-default': `${BASE_URL}/en/terms` },
    },
    privacy: {
      title:       'Política de Privacidad | Oryon Labs',
      description: 'Cómo recopilamos, usamos y protegemos tus datos personales conforme al RGPD.',
      keywords:    'política de privacidad, protección de datos, RGPD, Oryon Labs',
      url:         `${BASE_URL}/es/privacy`,
      image:       OG_IMAGE_ES,
      lang:        'es',
      alternates:  { es: `${BASE_URL}/es/privacy`, en: `${BASE_URL}/en/privacy`, 'x-default': `${BASE_URL}/en/privacy` },
    },
  },

  en: {
    home: {
      title:       'Oryon Labs | AI Agency in Spain & UK — Automation for SMBs',
      description: 'AI automation agency based in Spain and the UK. We automate lead capture, customer support and business workflows with custom AI. No technical knowledge required.',
      keywords:    'AI agency, AI agency UK, automation agency, business automation, chatbot for business, workflow automation',
      url:         `${BASE_URL}/en`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  ALTERNATES,
    },
    faq: {
      title:       'FAQ | Oryon Labs',
      description: 'Everything about business automation and AI. We answer your questions about intelligent agents, implementation, and ROI.',
      keywords:    'automation FAQ, business AI questions, chatbot FAQ',
      url:         `${BASE_URL}/en/faq`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  { es: `${BASE_URL}/es/faq`, en: `${BASE_URL}/en/faq`, 'x-default': `${BASE_URL}/en/faq` },
    },
    services: {
      title:       'AI Automation Services | Oryon Labs',
      description: '24/7 lead capture, AI support agents, automated workflows. Custom AI infrastructure for your business.',
      keywords:    'AI chatbots, process automation, support agents, system integration',
      url:         `${BASE_URL}/en/services`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  { es: `${BASE_URL}/es/servicios`, en: `${BASE_URL}/en/services`, 'x-default': `${BASE_URL}/en/services` },
    },
    pricing: {
      title:       'Pricing & Plans | Oryon Labs',
      description: 'AI automation plans from €199/month. No annual contracts. Setup included. Guaranteed scalability.',
      keywords:    'AI automation pricing, chatbot plans, AI agent costs',
      url:         `${BASE_URL}/en/pricing`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  { es: `${BASE_URL}/es/precios`, en: `${BASE_URL}/en/pricing`, 'x-default': `${BASE_URL}/en/pricing` },
    },
    terms: {
      title:       'Terms of Service | Oryon Labs',
      description: 'Terms and conditions governing the use and purchase of Oryon Labs AI automation services.',
      keywords:    'terms of service, terms and conditions, Oryon Labs legal',
      url:         `${BASE_URL}/en/terms`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  { es: `${BASE_URL}/es/terms`, en: `${BASE_URL}/en/terms`, 'x-default': `${BASE_URL}/en/terms` },
    },
    privacy: {
      title:       'Privacy Policy | Oryon Labs',
      description: 'How Oryon Labs collects, uses, and protects your personal data under GDPR and UK GDPR.',
      keywords:    'privacy policy, data protection, GDPR, Oryon Labs',
      url:         `${BASE_URL}/en/privacy`,
      image:       OG_IMAGE_EN,
      lang:        'en',
      alternates:  { es: `${BASE_URL}/es/privacy`, en: `${BASE_URL}/en/privacy`, 'x-default': `${BASE_URL}/en/privacy` },
    },
  },
};

export const SCHEMA_LD = {
  '@context': 'https://schema.org',
  '@type':    'ProfessionalService',
  name:        'Oryon Labs',
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
    email:         'hello@oryonlabs.com',
    contactType:   'customer service',
  },
};
