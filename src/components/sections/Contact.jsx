import { FaEnvelope, FaPhone, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import ProjectRequestForm from '../forms.jsx';

const benefits = [
  'Respuesta en menos de 24h',
  'Demo de tu automatización gratis',
  'Sin compromiso de permanencia',
];

export default function Contact() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Panel - Dark */}
          <div className="bg-navy p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-cyan/20 text-cyan-light text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Consulta gratuita
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Automatiza tu negocio.
                <span className="text-cyan"> Empieza hoy.</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Cuéntanos tu reto. En 24h te proponemos una solución concreta y un presupuesto sin letra pequeña.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center">
                      <FaCheckCircle className="w-4 h-4 text-cyan" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 pt-8 border-t border-white/10">
              <a href="mailto:hola@oryonlabs.com" className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <FaEnvelope className="w-4 h-4 text-cyan" />
                <span>hola@oryonlabs.com</span>
              </a>
              <a href="tel:+34900123456" className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <FaPhone className="w-4 h-4 text-cyan" />
                <span>+34 900 123 456</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <FaWhatsapp className="w-4 h-4 text-cyan" />
                <span>WhatsApp disponible</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="bg-white p-8 lg:p-12">
            <ProjectRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
}
