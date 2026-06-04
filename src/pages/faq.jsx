import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaCopy, FaCheck } from 'react-icons/fa';

const faqs = [
  {
    question: '¿Qué es un agente de IA y cómo puede ayudar a mi empresa?',
    answer: 'Un agente de IA es un asistente virtual inteligente que puede automatizar tareas repetitivas, responder consultas de clientes, calificar leads y realizar seguimientos automáticos. Se entrena con tu documentación específica para responder como un experto de tu negocio.',
  },
  {
    question: '¿Cuánto tiempo tarda implementar una automatización?',
    answer: 'La mayoría de nuestros proyectos están operativos en 2 a 4 semanas. El tiempo exacto depende de la complejidad: un chatbot básico puede estar listo en 1 semana, mientras que una integración completa CRM + WhatsApp + IA puede requerir 3-4 semanas.',
  },
  {
    question: '¿Necesito conocimientos técnicos para usar las automatizaciones?',
    answer: 'No. Diseñamos interfaces simples y te proporcionamos documentación clara. Además, incluimos capacitación y soporte continuo para que tu equipo pueda gestionar las automatizaciones sin depender de técnicos.',
  },
  {
    question: '¿Con qué herramientas se integran vuestros agentes de IA?',
    answer: 'Nos integramos con las principales plataformas: WhatsApp Business, Telegram, Slack, HubSpot, Salesforce, Make, n8n, Google Sheets, Notion, y cualquier API REST. Si usas una herramienta específica, la integramos.',
  },
  {
    question: '¿Cómo se entrena el agente de IA con mi información?',
    answer: 'Subimos tu documentación (PDFs, FAQs, scripts de venta, información de productos) a nuestra plataforma. El agente aprende de esta información y también puede conectarse a tu base de datos para respuestas en tiempo real.',
  },
  {
    question: '¿Puedo probar antes de contratar?',
    answer: 'Sí. Ofrecemos una demo gratuita de 30 minutos donde mostramos cómo funcionaría un agente de IA con tu caso de uso específico. También tenemos período de prueba de 14 días en todos nuestros planes.',
  },
  {
    question: '¿Cómo se calcula el precio?',
    answer: 'El precio depende de la complejidad del proyecto. Cobramos un setup inicial único (desde 650€) y una mensualidad por el mantenimiento y uso de la IA (desde 150€/mes). Sin sorpresas, sin letra pequeña.',
  },
  {
    question: '¿Qué pasa si quiero cancelar?',
    answer: 'Puedes cancelar cuando quieras con 30 días de antelación. No hay penalizaciones ni compromisos de permanencia. Tu infraestructura te pertenece y te damos acceso completo a los datos.',
  },
];

const FAQWebConsultora = () => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [copied, setCopied] = useState(false);

  const toggleAccordion = (index) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-cyan hover:text-cyan-dark transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Volver a la página principal</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-navy py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-300">
            Todo lo que necesitas saber sobre automatización con IA
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-navy pr-4">{faq.question}</span>
                <FaChevronDown
                  className={`w-5 h-5 text-cyan flex-shrink-0 transition-transform duration-300 ${
                    expandedAccordion === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  expandedAccordion === index ? 'pb-6 max-h-96' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">¿No encuentras tu pregunta?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => copyToClipboard('hola@oryonlabs.com')}
              className="flex items-center gap-2 bg-cyan hover:bg-cyan-medium text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              {copied ? (
                <>
                  <FaCheck className="w-4 h-4" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <FaCopy className="w-4 h-4" />
                  Copiar email
                </>
              )}
            </button>
            <a
              href="#contacto"
              className="text-cyan hover:text-cyan-dark font-medium transition-colors"
            >
              O enviar mensaje directo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQWebConsultora;
