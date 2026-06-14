import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const languages = [
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
];

export default function SelectIdiom({ isScrolled, isMobile = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extraer idioma actual del path
  const pathLang = location.pathname.split('/')[1];
  const currentLang = languages.find(l => l.code === pathLang) || languages[0];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    
    // Reemplazar el código de idioma en la URL
    if (pathParts.length > 1 && ['es', 'en'].includes(pathParts[1])) {
      pathParts[1] = langCode;
    } else {
      pathParts.splice(1, 0, langCode);
    }
    
    const newPath = pathParts.join('/') || `/${langCode}`;
    navigate(newPath);
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Estilos para móvil (dentro del menú hamburguesa)
  if (isMobile) {
    return (
      <div className="border-t border-gray-100 pt-4 mt-2">
        <p className="text-xs uppercase text-gray-400 font-semibold mb-3 px-4">Idioma / Language</p>
        <div className="flex gap-2 px-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentLang.code === lang.code
                  ? 'bg-cyan text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Estilos para desktop (navbar)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isScrolled
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-white/90 hover:bg-white/10'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="uppercase">{currentLang.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                currentLang.code === lang.code
                  ? 'bg-cyan/10 text-cyan font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={currentLang.code === lang.code}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLang.code === lang.code && (
                <svg className="w-4 h-4 ml-auto text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
