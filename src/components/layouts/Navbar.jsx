import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SelectIdiom from '../ui/SelectIdiom';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

// Obtener rutas de navegación basadas en el idioma
const getNavLinks = (lang) => {
  const isEn = lang === 'en';
  return [
    { labelKey: 'services', href: `#${isEn ? 'services' : 'servicios'}` },
    { labelKey: 'pricing', href: `#${isEn ? 'pricing' : 'precios'}` },
    { labelKey: 'process', href: `#${isEn ? 'process' : 'proceso'}` },
    { labelKey: 'contact', href: `#${isEn ? 'contact' : 'contacto'}` },
  ];
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Extraer idioma del path
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const nav = t.nav;
  const navLinks = getNavLinks(lang);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No mostrar navbar en admin panel o login
  if (location.pathname.includes('adminpanel') || location.pathname.includes('login')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className={`font-bold text-lg ${isScrolled ? 'text-navy' : 'text-white'}`}>
              OryonLabs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-cyan ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {nav[link.labelKey]}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            <SelectIdiom isScrolled={isScrolled} />
            <a
              href={`/${lang}/login`}
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-cyan' : 'text-white/90 hover:text-white'
              }`}
            >
              {nav.cta_login}
            </a>
            <a
              href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
              className="bg-cyan hover:bg-cyan-medium text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2"
            >
              {nav.cta_pricing}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg mt-2 p-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.labelKey}
                  href={link.href}
                  className="text-gray-700 hover:text-cyan hover:bg-gray-50 px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {nav[link.labelKey]}
                </a>
              ))}
              <hr className="border-gray-100 my-2" />
              {/* Language Selector Mobile */}
              <SelectIdiom isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
              <hr className="border-gray-100 my-2" />
              <a
                href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
                className="bg-cyan hover:bg-cyan-medium text-white text-center font-medium px-5 py-3 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {nav.cta_pricing}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
