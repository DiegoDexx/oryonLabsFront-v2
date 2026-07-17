import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import homeEs from '../../locales/home/es.json';
import homeEn from '../../locales/home/en.json';

// home/{es,en}.json is already eagerly bundled via Navbar/Footer — safe to import directly.
const home = { es: homeEs, en: homeEn };

// Every other page's locale is loaded on demand so Breadcrumb doesn't drag the
// (much larger) page content into the eagerly-loaded Layout bundle — the page
// itself already lazy-loads the same file, this just reuses it without duplicating it.
// `variant` defaults to 'dark' since every current hero is navy — flip a single
// entry to 'light' the day a page ships with a light-colored hero.
const ROUTES = {
  servicios: {
    es: () => import('../../locales/services/es.json'),
    en: () => import('../../locales/services/en.json'),
    label: (data, slug) => data.nav_titles?.[slug],
    variant: 'dark',
  },
  aboutus: {
    es: () => import('../../locales/aboutus/es.json'),
    en: () => import('../../locales/aboutus/en.json'),
    label: (data) => data.breadcrumb_label,
    variant: 'dark',
  },
  contacto: {
    es: () => import('../../locales/contact/es.json'),
    en: () => import('../../locales/contact/en.json'),
    label: (data) => data.hero.eyebrow,
    variant: 'dark',
  },
  faq: {
    es: () => import('../../locales/faq/es.json'),
    en: () => import('../../locales/faq/en.json'),
    label: (data) => data.badge,
    variant: 'dark',
  },
  blog: {
    es: () => import('../../locales/blog/es.json'),
    en: () => import('../../locales/blog/en.json'),
    label: (data) => data.breadcrumb_label,
    variant: 'dark',
  },
  terms: {
    es: () => import('../../locales/terms/es.json'),
    en: () => import('../../locales/terms/en.json'),
    label: (data) => data.title,
    variant: 'dark',
  },
  privacy: {
    es: () => import('../../locales/privacy/es.json'),
    en: () => import('../../locales/privacy/en.json'),
    label: (data) => data.title,
    variant: 'dark',
  },
  'data-deletion': {
    es: () => import('../../locales/data-deletion/es.json'),
    en: () => import('../../locales/data-deletion/en.json'),
    label: (data) => data.title,
    variant: 'dark',
  },
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const lang = ['es', 'en'].includes(segments[0]) ? segments[0] : 'es';
  const section = segments[1];
  const slug = segments[2];
  const isHome = segments.length <= 1;

  const [pageLabel, setPageLabel] = useState(null);

  useEffect(() => {
    setPageLabel(null);
    const route = ROUTES[section];
    if (!route) return;
    let cancelled = false;
    route[lang]().then((mod) => {
      if (!cancelled) setPageLabel(route.label(mod.default, slug));
    });
    return () => {
      cancelled = true;
    };
  }, [section, lang, slug]);

  if (isHome || !pageLabel) return null;

  const isDark = (ROUTES[section]?.variant ?? 'dark') !== 'light';
  const homeLabel = home[lang].breadcrumb_home;

  return (
    <div className={`relative z-10 pt-20 sm:pt-24 pb-3 ${isDark ? 'bg-navy' : 'bg-white'}`}>
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              to={`/${lang}`}
              className={isDark ? 'text-white/50 hover:text-white transition-colors' : 'text-gray-400 hover:text-navy transition-colors'}
            >
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden="true" className={isDark ? 'text-white/30' : 'text-gray-300'}>
            &gt;
          </li>
          <li aria-current="page" className={isDark ? 'text-white' : 'text-navy'}>
            {pageLabel}
          </li>
        </ol>
      </nav>
    </div>
  );
}
