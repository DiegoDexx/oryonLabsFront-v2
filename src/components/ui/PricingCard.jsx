import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaStar, FaMicrophone, FaInfoCircle } from 'react-icons/fa';

export default function PricingCard({
  name,
  subtitle,
  setupRange,
  monthlyRange,
  monthlyPrefix = '',
  perMonth = '/mes',
  setupLabel = 'Setup inicial',
  monthlyLabel = 'Mensualidad',
  keyFeatures = [],
  voiceFeature = null,
  isPopular = false,
  ctaText = 'Empezar',
  isDark = false,
  lang = 'es',
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const renderFeatureItem = (feature, index) => {
    const text = typeof feature === 'string' ? feature : feature.text;
    const link = typeof feature === 'object' && feature.link
      ? `/${lang}/servicios/${feature.link}`
      : null;

    if (link) {
      return (
        <li key={index} className="flex items-start gap-3">
          <FaCheck className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan' : 'text-cyan'}`} />
          <Link
            to={link}
            className={`text-sm underline underline-offset-2 decoration-dotted hover:opacity-80 transition-opacity ${
              isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-cyan'
            }`}
          >
            {text}
          </Link>
        </li>
      );
    }

    return (
      <li key={index} className="flex items-start gap-3">
        <FaCheck className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan' : 'text-cyan'}`} />
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{text}</span>
      </li>
    );
  };

  const voiceFeatureSlug = voiceFeature?.link ? `/${lang}/servicios/${voiceFeature.link}` : null;

  const contactAnchor = lang === 'en' ? '#contact' : '#contacto';

  return (
    <div
      className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
        isDark
          ? 'bg-navy text-white shadow-2xl'
          : 'bg-white border border-gray-200 text-navy hover:border-cyan/50 hover:shadow-xl'
      } ${
        /* Pro sits in the middle of 3 cards — a permanent lift (not just on
           hover) makes sure it reads as "the recommended one" regardless of
           serial position (Efecto de Posición Serial). */
        isPopular ? 'md:-translate-y-2 ring-1 ring-cyan/40' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
          <FaStar className="w-3 h-3" />
          {lang === 'en' ? 'Most popular' : 'Más popular'}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-navy'}`}>{name}</h3>
        {subtitle && (
          <p className={`text-xs mt-1 leading-snug ${isDark ? 'text-gray-400' : 'text-cyan'}`}>{subtitle}</p>
        )}
      </div>

      {/* Pricing — grouped as its own block (Ley de Proximidad), with more
          room below before the CTA so the two don't blur together. */}
      <div className={`mb-7 space-y-3 pb-5 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div>
          <p className={`text-xs uppercase tracking-wider mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {setupLabel}
          </p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}>{setupRange}</p>
        </div>
        <div>
          <p className={`text-xs uppercase tracking-wider mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {monthlyLabel}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}>
            {monthlyPrefix && (
              <span className="text-base font-normal mr-1">{monthlyPrefix}</span>
            )}
            {monthlyRange}
            <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {perMonth}
            </span>
          </p>
        </div>
      </div>

      {/* CTA — a single primary action per card (Ley de Hick). The former
          second button ("Solicitar análisis gratuito") is now a lighter-weight
          text link so it doesn't compete with the primary choice. */}
      <a
        href={contactAnchor}
        className={`w-full inline-flex items-center justify-center py-3 rounded-lg font-semibold transition-all ${
          isPopular || isDark
            ? 'bg-cyan hover:bg-cyan-medium text-white'
            : 'bg-navy hover:opacity-90 text-white'
        }`}
      >
        {ctaText}
      </a>
      <a
        href={contactAnchor}
        className={`w-full text-center text-xs font-medium mt-2.5 mb-6 hover:underline ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-cyan'
        }`}
      >
        {lang === 'en' ? 'Or request a free analysis' : 'O solicita un análisis gratuito'}
      </a>

      {/* Key features */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-100'} pt-5 flex-1`}>
        <ul className="space-y-2.5">
          {keyFeatures.map((feat, i) => renderFeatureItem(feat, i))}
        </ul>

        {/* Voice feature badge */}
        {voiceFeature && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5 ${
              isDark ? 'bg-orange-950/40 border border-orange-800/30' : 'bg-orange-50 border border-orange-100'
            }`}
          >
            <FaMicrophone className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-orange-300' : 'text-orange-500'}`} />
            {voiceFeatureSlug ? (
              <Link
                to={voiceFeatureSlug}
                className={`text-sm flex-1 underline underline-offset-2 decoration-dotted hover:opacity-80 transition-opacity ${
                  isDark ? 'text-orange-200' : 'text-orange-700'
                }`}
              >
                {voiceFeature.text}
              </Link>
            ) : (
              <span className={`text-sm flex-1 ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
                {voiceFeature.text}
              </span>
            )}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setTooltipOpen(v => !v)}
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                className={`p-0.5 rounded transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Más información sobre minutos de voz"
              >
                <FaInfoCircle className="w-3.5 h-3.5" />
              </button>
              {tooltipOpen && (
                <div
                  className={`absolute right-0 bottom-full mb-2 w-64 rounded-lg p-3 text-xs shadow-xl z-20 ${
                    isDark ? 'bg-white text-gray-800' : 'bg-navy text-white'
                  }`}
                >
                  {voiceFeature.tooltip}
                  <div
                    className={`absolute right-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent ${
                      isDark ? 'border-t-white' : 'border-t-navy'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
