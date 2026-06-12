import { useLocation } from 'react-router-dom';
import PricingCard from '../ui/PricingCard';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

export default function Pricing() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const pricing = t.pricing;

  return (
    <section id={lang === 'en' ? 'pricing' : 'precios'} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {pricing.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-navy mb-6">
            {pricing.title}<br />
            <span className="text-cyan">{pricing.title_highlight}</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {pricing.description}
          </p>
        </div>

        {/* Pricing Cards - mapear desde JSON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-6xl mx-auto">
          {pricing.plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              subtitle={plan.subtitle}
              // Parsear precios del JSON
              setupRange={lang === 'es' ? '650€ - 3.500€' : '€650 - 3.500'}
              monthlyRange={plan.price_monthly}
              description={plan.description}
              features={plan.features}
              isPopular={plan.popular}
              ctaText={plan.cta}
              isDark={index === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
