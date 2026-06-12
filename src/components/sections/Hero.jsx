import { useState, useEffect } from 'react';
import { FaCircle, FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

export default function Hero() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const hero = t.hero;

  const [showScrollHint, setShowScrollHint] = useState(true);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 80) setShowScrollHint(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative bg-navy min-h-screen pt-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,144,201,0.15),transparent_40%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDuration: '0.7s', animationDelay: '3.2s', animationFillMode: 'both' }}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 animate-fade-in"
              style={{ animationDelay: '3.6s', animationFillMode: 'both' }}
            >
              <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
              <span className="text-cyan-light text-sm font-medium">
                {hero.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                {lang === 'es' ? 'Infraestructura de ' : 'Real AI infrastructure '}
                <span className="text-cyan-light">{hero.title_highlight}</span>
                {lang === 'es' ? ' para tu negocio' : ' for your business'}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                {hero.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
                className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan/25"
              >
                {hero.cta_primary}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
                className="bg-white hover:bg-gray-50 text-navy font-semibold px-6 py-3.5 rounded-lg transition-all"
              >
                {hero.cta_secondary}
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-4 h-4 text-cyan" />
                <span>{hero.trust_indicator_1}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-4 h-4 text-cyan" />
                <span>{hero.trust_indicator_2}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-4 h-4 text-cyan" />
                <span>{hero.trust_indicator_3}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Panel */}
          <div className="relative animate-slide-in-right" style={{ animationDuration: '0.8s', animationDelay: '3.4s', animationFillMode: 'both' }}>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />

            {/* Panel */}
            <div className="relative bg-navy-light/80 backdrop-blur rounded-2xl border border-white/10 p-6 shadow-2xl">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaCircle className="w-3 h-3 text-red-500" />
                  <FaCircle className="w-3 h-3 text-yellow-500" />
                  <FaCircle className="w-3 h-3 text-green-500" />
                  <span className="ml-2 text-gray-400 text-sm">{hero.panel_title}</span>
                </div>
                <div className="bg-cyan/20 text-cyan-light text-xs font-semibold px-3 py-1 rounded-full">
                  {hero.panel_badge}
                </div>
              </div>

              {/* Automation Items */}
              <div className="space-y-3 mb-6">
                {hero.automation_items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-gray-200 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-400 text-xs">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{hero.metrics.leads.value}</p>
                  <p className="text-xs text-gray-400">{hero.metrics.leads.label}</p>
                  <p className="text-xs text-green-400">{hero.metrics.leads.sublabel}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{hero.metrics.response.value}{hero.metrics.response.unit}</p>
                  <p className="text-xs text-gray-400">{hero.metrics.response.label}</p>
                  <p className="text-xs text-green-400">{hero.metrics.response.sublabel}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{hero.metrics.savings.currency}{hero.metrics.savings.value}{hero.metrics.savings.unit}</p>
                  <p className="text-xs text-gray-400">{hero.metrics.savings.label}</p>
                  <p className="text-xs text-green-400">{hero.metrics.savings.sublabel}</p>
                </div>
              </div>

              {/* Time Saved Badge */}
              <div className="absolute -bottom-4 -left-4 bg-navy-light border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{hero.time_saved.title}</p>
                  <p className="text-gray-400 text-xs">{hero.time_saved.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm mb-8">
            {t.trust_bar.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {t.trust_bar.logos.map((logo, index) => (
              <span
                key={index}
                className="text-gray-500 font-semibold text-sm tracking-wider hover:text-gray-300 transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {showScrollHint && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none">
          <svg
            className="w-6 h-6 animate-bounce"
            style={{ color: 'rgba(56,189,248,0.6)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </section>
  );
}
