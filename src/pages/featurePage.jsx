import { useParams } from 'react-router-dom';
import FeaturePageLayout from '../components/sections/FeaturePageLayout';
import HelmetSEO from '../seo/HelmetSEO';
import { seoData } from '../seo/seoData';
import es from '../locales/es.json';
import en from '../locales/en.json';

const translationsByLang = { es, en };

const VALID_SLUGS = ['asistente-24-7', 'crm', 'desarrollo-web', 'integraciones', 'custom-ai'];

export default function FeaturePage() {
  const { lang, slug } = useParams();
  const resolvedLang = ['es', 'en'].includes(lang) ? lang : 'es';
  const t = translationsByLang[resolvedLang] || translationsByLang.es;
  const fp = t.feature_pages;
  const seo = seoData[resolvedLang]?.[slug];

  if (!VALID_SLUGS.includes(slug) || !fp?.pages?.[slug]) {
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
      {seo && (
        <HelmetSEO
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          url={seo.url}
          lang={resolvedLang}
          alternates={seo.alternates}
        />
      )}
      <FeaturePageLayout
        pageData={fp.pages[slug]}
        fp={fp}
        lang={resolvedLang}
      />
    </>
  );
}
