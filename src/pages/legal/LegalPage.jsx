import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaFileAlt } from 'react-icons/fa';
import { HelmetSEO, seoData } from '../../seo';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

export default function LegalPage({ pageKey }) {
  const location = useLocation();
  const lang = location.pathname.split('/')[1] === 'en' ? 'en' : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const legal = t.legal;
  const content = legal[pageKey];
  const seo = seoData[lang][pageKey];

  //scroll to top when the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <HelmetSEO {...seo} />
      <div className="bg-navy min-h-screen pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/${lang}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan text-sm transition-colors mb-10"
          >
            <FaArrowLeft className="w-3 h-3" />
            {legal.backLink}
          </Link>

          <div className="inline-flex items-center gap-2 bg-cyan/10 text-cyan text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-6">
            <FaFileAlt className="w-3.5 h-3.5" />
            {legal.badge}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {content.title}
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            {content.lastUpdated}
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-12">
            <p className="text-gray-300 leading-relaxed">
              {content.intro}
            </p>
          </div>

          <div className="space-y-10">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                  {section.title}
                </h2>
                <div className="w-10 h-1 bg-cyan rounded-full mb-4" />
                <p className="text-gray-400 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-white font-semibold text-lg mb-2">
              {content.contactTitle}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {content.contactText}
            </p>
            <a
              href={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
              className="inline-block bg-cyan hover:bg-cyan-medium text-white text-sm font-medium px-6 py-3 rounded-lg transition-all"
            >
              {content.contactButton}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
