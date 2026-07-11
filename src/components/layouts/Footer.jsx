import { Link, useLocation } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import completeLogo from '../../assets/img/logo_blue_ox.webp';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

export default function Footer() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const footer = t.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link to={`/${lang}`}>
                <img
                  src={completeLogo}
                  alt="OryonX"
                  loading="lazy"
                  decoding="async"
                  style={{
                    height: '52px',
                    width: 'auto',
                    filter: 'brightness(1.15) drop-shadow(0 0 8px rgba(0,144,201,0.4))',
                  }}
                />
              </Link>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {footer.description}
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
                href="https://instagram.com/oryonx"
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
            <h3 className="font-semibold text-white mb-6">{footer.columns.services.title}</h3>
            <ul className="space-y-4">
              {footer.columns.services.links.map((link, index) => (
                <li key={index}>
                  <a href={`/${lang}#${lang === 'en' ? 'services' : 'servicios'}`} className="text-gray-400 hover:text-cyan text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-6">{footer.columns.company.title}</h3>
            <ul className="space-y-4">
              {footer.columns.company.links.map((link, index) => {
                const paths = [`/${lang}/aboutus`, `/${lang}/servicios`, `/${lang}/faq`, `/${lang}/blog`];
                const to = paths[index] || '#';
                return (
                  <li key={index}>
                    <Link to={to} className="text-gray-400 hover:text-cyan text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-6">{footer.columns.legal.title === 'Legal' || footer.columns.legal.title === 'Legal' ? 'Contacto' : 'Contact'}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="w-4 h-4 text-cyan" />
                <a href={`mailto:${footer.contact.email}`} className="hover:text-cyan transition-colors">
                  {footer.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhone className="w-4 h-4 text-cyan" />
                <a href={`tel:${footer.contact.phone.replace(/\s/g, '')}`} className="hover:text-cyan transition-colors">
                  {footer.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaWhatsapp className="w-4 h-4 text-cyan" />
                <span>{footer.contact.whatsapp}</span>
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
              {footer.copyright.replace('{year}', currentYear)}
            </p>
            <div className="flex gap-6">
              {footer.columns.legal.links.map((link, index) => {
                const hrefs = [`/${lang}/privacy`, `/${lang}/terms`, '#', `/${lang}/data-deletion`];
                return (
                  <Link key={index} to={hrefs[index] ?? '#'} className="text-gray-500 hover:text-cyan text-sm transition-colors">
                    {link}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
