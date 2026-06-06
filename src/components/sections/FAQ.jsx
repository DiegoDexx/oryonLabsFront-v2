import { useState } from 'react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { StaggerContainer } from '../ui/StaggerContainer';
// import { useTranslation } from '../../hooks/useTranslation'; // TODO: Habilitar en Fase 2 final

// Plus/Minus icon component
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// FAQ items
const faqItems = [
  {
    question: '¿Qué es un agente de IA y cómo puede ayudar mi negocio?',
    answer: 'Un agente de IA es un sistema automatizado que realiza tareas específicas como responder preguntas, capturar leads o programar citas. Reduce costos, elimina errores humanos y trabaja 24/7 sin descanso.'
  },
  {
    question: '¿Cuánto tiempo lleva implementar una automatización?',
    answer: 'La mayoría de proyectos están operativos en 2-4 semanas. El tiempo exacto depende de la complejidad de la integración necesaria y de las herramientas que ya uses.'
  },
  {
    question: '¿Necesito conocimientos técnicos?',
    answer: 'No. Nosotros nos encargamos de toda la implementación técnica. Tú solo necesitas dedicar 1-2 horas a la configuración inicial para contarnos cómo funciona tu negocio.'
  },
  {
    question: '¿Qué pasa si ya tengo herramientas configuradas?',
    answer: 'Perfecto. Integramos tu CRM, email marketing y otras herramientas existentes. No es necesario cambiar todo lo que tienes funcionando.'
  },
  {
    question: '¿Cómo se mide el ROI de la automatización?',
    answer: 'Trackamos métricas clave como leads capturados, tiempo de respuesta, tareas automatizadas y costos operativos. Dashboard en tiempo real incluido.'
  },
  {
    question: '¿El soporte incluye actualizaciones?',
    answer: 'Sí. Todos los planes incluyen soporte técnico y actualizaciones de mantenimiento. Los planes Pro y superiores incluyen optimizaciones mensuales.'
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer: 'Absolutamente. No hay contratos de permanencia. Puedes cancelar cuando quieras sin penalización. Tu setup te pertenece.'
  },
  {
    question: '¿Trabajan con empresas de cualquier tamaño?',
    answer: 'Trabajamos con autónomos, startups, pymes y empresas medianas. Escalamos contigo según tus necesidades de crecimiento.'
  }
];

function FAQItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-5 sm:py-6 flex items-center justify-between text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`text-base sm:text-lg font-semibold pr-4 transition-colors ${isOpen ? 'text-cyan' : 'text-navy group-hover:text-cyan'}`}>
          {item.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-cyan text-white rotate-0' 
            : 'bg-gray-100 text-gray-500 group-hover:bg-cyan/10 group-hover:text-cyan'
        }`}>
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-5 sm:pb-6 text-gray-600 leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default
  // const { t } = useTranslation();

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-4 sm:mb-6">
            Preguntas frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Todo lo que necesitas saber
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Resolvemos tus dudas sobre automatización e inteligencia artificial.
          </p>
        </AnimatedSection>

        {/* FAQ List */}
        <AnimatedSection delay={100}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <StaggerContainer staggerDelay={50}>
              {faqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={200} className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿Tienes más preguntas?</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            Hablar con un experto
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
