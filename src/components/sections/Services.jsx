import { FaComments, FaNetworkWired, FaPlug, FaRobot, FaChartLine, FaCode } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ServiceCard from '../ui/ServiceCard';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

// Iconos para cada servicio
const serviceIcons = [
  <FaComments className="w-6 h-6" />,
  <FaNetworkWired className="w-6 h-6" />,
  <FaRobot className="w-6 h-6" />,
  <FaPlug className="w-6 h-6" />,
  <FaChartLine className="w-6 h-6" />,
  <FaCode className="w-6 h-6" />,
];

// Colores para cada servicio
const serviceColors = ['cyan', 'purple', 'green', 'orange', 'blue', 'indigo'];

export default function Services() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const services = t.services;

  return (
    <section id={lang === 'en' ? 'services' : 'servicios'} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {services.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-navy mb-6">
            {services.title}<br />
            <span className="text-cyan">{services.title_highlight}</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {services.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {services.cards.map((service, index) => (
            <ServiceCard
              key={index}
              icon={serviceIcons[index]}
              badge={service.badge}
              title={service.title}
              description={service.description}
              color={serviceColors[index]}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-6 mt-12">
          <a
            href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
            className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-4 rounded-lg transition-all flex items-center gap-2"
          >
            {services.cta_primary}
          </a>
          <a
            href={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
            className="text-cyan hover:text-cyan-dark font-semibold flex items-center gap-2 transition-colors"
          >
            {services.cta_secondary}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
