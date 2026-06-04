import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="font-bold text-lg">OryonLabs</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Automatizamos la captación de leads, la atención al cliente y los flujos de trabajo de tu empresa.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan flex items-center justify-center transition-all"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan flex items-center justify-center transition-all"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/oryonlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cyan hover:bg-cyan-medium flex items-center justify-center transition-all"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-6">Servicios</h3>
            <ul className="space-y-4">
              <li><a href="#servicios" className="text-gray-400 hover:text-cyan text-sm transition-colors">Chatbots IA</a></li>
              <li><a href="#servicios" className="text-gray-400 hover:text-cyan text-sm transition-colors">Automatización de procesos</a></li>
              <li><a href="#servicios" className="text-gray-400 hover:text-cyan text-sm transition-colors">Integración de sistemas</a></li>
              <li><a href="#servicios" className="text-gray-400 hover:text-cyan text-sm transition-colors">Agentes IA personalizados</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-6">Empresa</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyan text-sm transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan text-sm transition-colors">Casos de uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan text-sm transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="w-4 h-4 text-cyan" />
                <a href="mailto:hola@oryonlabs.com" className="hover:text-cyan transition-colors">
                  hola@oryonlabs.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhone className="w-4 h-4 text-cyan" />
                <a href="tel:+34900123456" className="hover:text-cyan transition-colors">
                  +34 900 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaWhatsapp className="w-4 h-4 text-cyan" />
                <span>WhatsApp disponible</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} OryonLabs. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-cyan text-sm transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan text-sm transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
