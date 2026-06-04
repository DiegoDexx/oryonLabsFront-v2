import { FaComments, FaNetworkWired, FaPlug, FaRobot, FaChartLine, FaCode } from 'react-icons/fa';
import ServiceCard from '../ui/ServiceCard';

const services = [
  {
    icon: <FaComments className="w-6 h-6" />,
    badge: 'Lead Generation',
    title: 'Captación de Leads 24/7',
    description: 'Chatbots inteligentes que capturan, califican y nutren leads automáticamente mientras duermes. Integración directa con tu CRM.',
    color: 'cyan',
  },
  {
    icon: <FaNetworkWired className="w-6 h-6" />,
    badge: 'Workflow',
    title: 'Flujos de Trabajo con IA',
    description: 'Automatiza tareas repetitivas: seguimientos, asignaciones, notificaciones y procesos internos. Construidos con n8n y Make.',
    color: 'purple',
  },
  {
    icon: <FaRobot className="w-6 h-6" />,
    badge: 'Atención al Cliente',
    title: 'Agentes IA de Soporte',
    description: 'Asistentes GPT entrenados con tu documentación que resuelven el 80% de las consultas sin intervención humana.',
    color: 'green',
  },
  {
    icon: <FaPlug className="w-6 h-6" />,
    badge: 'Integraciones',
    title: 'Conexión Total de Herramientas',
    description: 'Conectamos tu CRM, WhatsApp Business, email, calendarios y herramientas de negocio en un ecosistema unificado.',
    color: 'orange',
  },
  {
    icon: <FaChartLine className="w-6 h-6" />,
    badge: 'Reporting',
    title: 'Dashboards Automáticos',
    description: 'KPIs actualizados en tiempo real. Reportes automáticos de ventas, leads y operaciones entregados en tu email.',
    color: 'blue',
  },
  {
    icon: <FaCode className="w-6 h-6" />,
    badge: 'Custom AI',
    title: 'Agentes IA a Medida',
    description: 'Asistentes de IA completamente personalizados para tu sector y procesos. Desde cotizadores hasta asesores virtuales.',
    color: 'indigo',
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Qué construimos
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6">
            IA que trabaja.<br />
            <span className="text-cyan">Tú que creces.</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            No vendemos herramientas. Construimos infraestructura de IA real que se integra en tus procesos y genera resultados medibles desde el primer mes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-6 mt-12">
          <a
            href="#precios"
            className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-4 rounded-lg transition-all flex items-center gap-2"
          >
            Ver todos los servicios
          </a>
          <a
            href="#contacto"
            className="text-cyan hover:text-cyan-dark font-semibold flex items-center gap-2 transition-colors"
          >
            ¿Caso especial? Hablemos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
