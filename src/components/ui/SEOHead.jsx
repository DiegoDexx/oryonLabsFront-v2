import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://oryonlabs.com';

const SEO = {
  es: {
    title: 'Oryon Labs | Agencia de IA en Alicante — Automatización para PyMEs',
    description: 'Agencia de inteligencia artificial en Alicante. Automatizamos la captación de leads, atención al cliente y flujos de trabajo de tu empresa con IA a medida. Sin conocimientos técnicos.',
    keywords: 'agencia de IA en Alicante, automatización con inteligencia artificial, chatbot para empresas, automatización de procesos, creación de páginas web con IA, agencia automatización España',
    canonical: `${BASE_URL}/es`,
    ogTitle: 'Oryon Labs | Agencia de IA en Alicante',
    ogDescription: 'Automatizamos tu negocio con IA a medida. Captación de leads, atención al cliente y flujos automáticos.',
    ogImage: `${BASE_URL}/og-image-es.png`,
    lang: 'es',
  },
  en: {
    title: 'Oryon Labs | AI Agency in Manchester & Spain — Automation for SMBs',
    description: 'AI automation agency based in Spain and the UK. We automate lead capture, customer support and business workflows with custom AI. No technical knowledge required.',
    keywords: 'AI agency, AI agency in Manchester, AI agency UK, automation agency, business automation, chatbot for business, workflow automation, web development with AI',
    canonical: `${BASE_URL}/en`,
    ogTitle: 'Oryon Labs | AI Agency in Manchester & Spain',
    ogDescription: 'We automate your business with custom AI. Lead capture, customer support and automated workflows.',
    ogImage: `${BASE_URL}/og-image-en.png`,
    lang: 'en',
  },
};

const SCHEMA_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Oryon Labs',
  url: BASE_URL,
  logo: 'https://i.ibb.co/TMQHCkCZ/logo-blue2.png',
  description: 'AI automation agency for SMBs. Lead capture, customer support and workflow automation.',
  address: { '@type': 'PostalAddress', addressLocality: 'Alicante', addressCountry: 'ES' },
  areaServed: ['ES', 'GB'],
  serviceType: ['AI Automation', 'Chatbot Development', 'Workflow Automation', 'Web Development'],
  contactPoint: { '@type': 'ContactPoint', email: 'hello@oryonlabs.com', contactType: 'customer service' },
});

function setMeta(selector, content, attrName = 'content') {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    // Parse selector to set the identifying attribute
    const match = selector.match(/\[([^\]]+)\]/);
    if (match) {
      const [attrKey, attrVal] = match[1].split('=').map(s => s.replace(/"/g, ''));
      el.setAttribute(attrKey, attrVal);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attrName, content);
}

function setLink(rel, href, extra = {}) {
  let el = document.querySelector(`link[rel="${rel}"]:not([hreflang])`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
}

function setHreflang(hreflang, href) {
  let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEOHead() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const seo = SEO[lang];

  useEffect(() => {
    document.title = seo.title;
    document.documentElement.lang = seo.lang;

    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[name="robots"]', 'index, follow');
    setMeta('meta[name="theme-color"]', '#060F27');

    setLink('canonical', seo.canonical);
    setHreflang('es', `${BASE_URL}/es`);
    setHreflang('en', `${BASE_URL}/en`);
    setHreflang('x-default', `${BASE_URL}/en`);

    setMeta('meta[property="og:type"]', 'website', 'content');
    setMeta('meta[property="og:url"]', seo.canonical, 'content');
    setMeta('meta[property="og:title"]', seo.ogTitle, 'content');
    setMeta('meta[property="og:description"]', seo.ogDescription, 'content');
    setMeta('meta[property="og:image"]', seo.ogImage, 'content');
    setMeta('meta[property="og:site_name"]', 'Oryon Labs', 'content');

    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', seo.ogTitle);
    setMeta('meta[name="twitter:description"]', seo.ogDescription);
    setMeta('meta[name="twitter:image"]', seo.ogImage);

    let schemaEl = document.getElementById('schema-jsonld');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'schema-jsonld';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = SCHEMA_LD;
  }, [lang, seo]);

  return null;
}
