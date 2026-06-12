import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };
const SHOWN_KEY = 'oryon_exit_shown';

export default function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = (translationsByLang[lang] || translationsByLang.es).exit;

  useEffect(() => {
    if (sessionStorage.getItem(SHOWN_KEY)) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        setVisible(true);
        sessionStorage.setItem(SHOWN_KEY, '1');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-[70] animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div
        className="flex items-center gap-4 px-6 py-4 shadow-2xl rounded-b-2xl"
        style={{ background: '#060F27', border: '1px solid rgba(0,144,201,0.3)', borderTop: 'none' }}
      >
        <p className="text-white text-sm font-medium whitespace-nowrap">{t.text}</p>
        <button
          onClick={openChat}
          className="bg-cyan hover:bg-cyan-medium text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex-shrink-0"
        >
          {t.cta}
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-white transition-colors ml-1"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
