import PricingCard from '../ui/PricingCard';

const pricingPlans = [
  {
    name: 'Starter',
    subtitle: 'Para autónomos y pequeños negocios',
    setupRange: '650€ - 1.000€',
    monthlyRange: '€150 - 199',
    description: 'Ideal para autónomos y negocios locales pequeños que quieren probar automatización sin una gran inversión inicial.',
    features: [
      'Formulario web (sin chat ni detección WhatsApp entrante)',
      'IA para resumir y clasificar leads',
      'Google Sheets CRM',
      'Email al administrador',
      'Email + WhatsApp al cliente / Telegram',
      '1 flujo de seguimiento básico',
      'Soporte ligero + generación de facturas en la nube',
    ],
    ctaText: 'Empezar con Starter',
    isPopular: false,
  },
  {
    name: 'Pro Sales Automation',
    subtitle: 'Web + Bot conversacional',
    setupRange: '1.000€ - 2.000€',
    monthlyRange: '€199 - 399',
    description: 'Para pymes que reciben varios leads al mes. Incluye todo el Pack Starter más automatización avanzada.',
    features: [
      'Todo el Pack Starter incluido',
      'WhatsApp automático al cliente',
      'Aviso interno por Telegram/WhatsApp',
      'Seguimiento automático',
      'Estados del lead',
      'Detección básica de duplicados',
      'Dashboard simple',
      'Mejora de textos IA',
    ],
    ctaText: 'Empezar con Pro',
    isPopular: true,
  },
  {
    name: 'Professional + Bot IA',
    subtitle: 'Web + Bot conversacional',
    setupRange: '1.500€ - 3.500€',
    monthlyRange: '€250 - 500',
    description: 'Para empresas que quieren una web más potente con bot conversacional inteligente.',
    features: [
      'Web o landing optimizada',
      'Bot/componente conversacional',
      'Formulario inteligente + WhatsApp detecta mensaje',
      'IA para cualificar leads',
      'CRM/Sheets avanzado',
      'Emails automáticos',
      'WhatsApp automático',
      'Seguimiento completo',
      'Dashboard CRM',
    ],
    ctaText: 'Solicitar Professional',
    isPopular: false,
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Planes y precios
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6">
            Inversión clara.<br />
            Resultados medibles.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Sin contratos anuales forzados. Sin letra pequeña. Empieza, escala y cancela cuando quieras.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              {...plan}
              isDark={index === 1} // Middle card (Pro) is dark
            />
          ))}
        </div>
      </div>
    </section>
  );
}
