import { useLocation } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import ProjectRequestForm from '../forms.jsx';
import useContactPhone from '../../hooks/useContactPhone';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

// Benefits en español (hardcoded en el componente original, los mantengo igual)
const benefitsEs = [
  'Respuesta en menos de 24h',
  'Demo de tu automatización gratis',
  'Sin compromiso de permanencia',
];

const benefitsEn = [
  'Response in less than 24h',
  'Free automation demo',
  'No commitment required',
];

export default function Contact() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const contact = t.contact;
  const benefits = lang === 'en' ? benefitsEn : benefitsEs;
  const { phone } = useContactPhone();

  return (
    <section id={lang === 'en' ? 'contact' : 'contacto'} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Panel - Dark */}
          <div className="bg-navy p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-cyan/20 text-cyan-light text-sm font-semibold px-4 py-2 rounded-full mb-6">
                {contact.badge}
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                {lang === 'es' ? 'Automatiza tu negocio.' : 'Automate your business.'}
                <span className="text-cyan"> {lang === 'es' ? 'Empieza hoy.' : 'Start today.'}</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {lang === 'es' 
                  ? 'Cuéntanos tu reto. En 24h te proponemos una solución concreta y un presupuesto sin letra pequeña.'
                  : 'Tell us about your challenge. In 24h we will propose a concrete solution and a clear budget.'
                }
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
              <a href={`mailto:${t.footer.contact.email}`} className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <FaEnvelope className="w-4 h-4 text-cyan" />
                <span>{t.footer.contact.email}</span>
              </a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <FaPhone className="w-4 h-4 text-cyan" />
                <span>{phone}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <FaWhatsapp className="w-4 h-4 text-cyan" />
                <span>{t.footer.contact.whatsapp}</span>
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
