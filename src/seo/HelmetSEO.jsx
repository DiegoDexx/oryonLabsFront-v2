import { useHead } from '@unhead/react';

const localeMap = {
  es: 'es_ES',
  en: 'en_US',
};

export default function HelmetSEO({
  title,
  description,
  keywords,
  url,
  image,
  lang = 'es',
  alternates = {},
}) {
  useHead({
    title,
    htmlAttrs: { lang },
    meta: [
      { name: 'description',         content: description },
      { name: 'keywords',            content: keywords },
      { name: 'robots',              content: 'index, follow' },
      { name: 'theme-color',         content: '#060F27' },
      { property: 'og:title',        content: title },
      { property: 'og:description',  content: description },
      { property: 'og:image',        content: image },
      { property: 'og:url',          content: url },
      { property: 'og:type',         content: 'website' },
      { property: 'og:site_name',    content: 'OryonX' },
      { property: 'og:locale',       content: localeMap[lang] || 'es_ES' },
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image',       content: image },
    ],
    link: [
      { rel: 'canonical', href: url },
      ...Object.entries(alternates).map(([lng, href]) => ({
        rel: 'alternate',
        hreflang: lng,
        href,
      })),
    ],
  });

  return null;
}
