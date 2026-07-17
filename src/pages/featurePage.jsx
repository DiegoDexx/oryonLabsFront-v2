import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FeaturePageLayout from '../components/sections/FeaturePageLayout';
import HelmetSEO from '../seo/HelmetSEO';
import { seoData } from '../seo/seoData';
import es from '../locales/services/es.json';
import en from '../locales/services/en.json';
import { SERVICE_ORDER } from '../config/services';

const translationsByLang = { es, en };

export default function FeaturePage() {
  const { lang, slug } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const resolvedLang = ['es', 'en'].includes(lang) ? lang : 'es';
  const fp = translationsByLang[resolvedLang] || translationsByLang.es;
  const seo = seoData[resolvedLang]?.[slug];

  if (!SERVICE_ORDER.includes(slug) || !fp?.pages?.[slug]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy">
        <div className="text-center">
          <p className="text-5xl font-extrabold mb-4">404</p>
          <p className="text-gray-500">Página no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {seo && <HelmetSEO {...seo} />}
      <FeaturePageLayout
        pageData={fp.pages[slug]}
        fp={fp}
        lang={resolvedLang}
      />
    </>
  );
}
