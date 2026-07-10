import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PricingCard from '../ui/PricingCard';
import ComparisonTable from '../ui/ComparisonTable';
import { AnimatedSection } from '../ui/AnimatedSection';
import useCurrency from '../../hooks/useCurrency';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

function MicroFAQ({ faq }) {
  const [open, setOpen] = useState(null);
  if (!faq) return null;
  return (
    <div className="py-16 px-4 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-extrabold text-navy text-center mb-8">{faq.title}</h3>
        <div className="space-y-3">
          {faq.items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-navy hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-sm pr-4">{item.question}</span>
                {open === i
                  ? <FaChevronUp className="w-4 h-4 flex-shrink-0 text-cyan" />
                  : <FaChevronDown className="w-4 h-4 flex-shrink-0 text-cyan" />}
              </button>
              {open === i && (
                <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-100 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomCaseBar({ customCase, lang }) {
  if (!customCase) return null;
  const anchor = lang === 'en' ? '#contact' : '#contacto';
  return (
    <div className="bg-navy py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
        <div>
          <h3 className="text-xl font-bold mb-1">{customCase.title}</h3>
          <p className="text-gray-300 text-sm max-w-md">{customCase.subtitle}</p>
        </div>
        <a
          href={anchor}
          className="flex-shrink-0 bg-cyan hover:bg-cyan-medium text-white font-semibold px-7 py-3 rounded-lg transition-all whitespace-nowrap"
        >
          {customCase.cta}
        </a>
      </div>
    </div>
  );
}

export default function Pricing() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const pricing = t.pricing;
  const symbol = useCurrency().symbol;

  const comparisonAnchor =
    pricing.comparison?.anchor_id || (lang === 'en' ? 'comparison' : 'comparativa');

  const scrollToComparison = (e) => {
    e.preventDefault();
    const el = document.getElementById(comparisonAnchor);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id={lang === 'en' ? 'pricing' : 'precios'} className="bg-navy">
      {/* Header + compact cards */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block bg-cyan/10 text-cyan-light text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-cyan/20">
              {pricing.badge}
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {pricing.title}
              <br />
              <span className="text-cyan">{pricing.title_highlight}</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">{pricing.description}</p>
          </AnimatedSection>

          <AnimatedSection delay={120} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10">
            {pricing.plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                subtitle={plan.subtitle}
                setupRange={
                  plan.setup_range
                    ? plan.setup_range.replace(/€/g, symbol)
                    : `${symbol}650 – ${symbol}3.500`
                }
                monthlyRange={`${symbol}${plan.price_monthly}`}
                monthlyPrefix={plan.price_prefix || ''}
                perMonth={pricing.per_month}
                setupLabel={pricing.setup_label}
                monthlyLabel={pricing.monthly_label}
                keyFeatures={plan.key_features || []}
                voiceFeature={plan.voice_feature || null}
                voiceNote={plan.voice_note || null}
                isPopular={plan.popular}
                ctaText={plan.cta}
                isDark={index === 1}
                lang={lang}
              />
            ))}
          </AnimatedSection>

          <div className="text-center">
            <a
              href={`#${comparisonAnchor}`}
              onClick={scrollToComparison}
              className="inline-flex items-center gap-1.5 text-cyan hover:text-cyan-dark font-semibold text-sm transition-colors group"
            >
              <span>
                {pricing.comparison?.link_text ||
                  (lang === 'en' ? 'See full comparison ↓' : 'Ver comparativa completa ↓')}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Full comparison table */}
      <ComparisonTable comparison={pricing.comparison} lang={lang} />

      {/* Custom case bar */}
      <CustomCaseBar customCase={pricing.custom_case} lang={lang} />

      {/* Micro FAQ */}
      <MicroFAQ faq={pricing.micro_faq} />
    </section>
  );
}
