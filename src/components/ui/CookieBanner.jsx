import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };
const CONSENT_KEY = 'oryon_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = (translationsByLang[lang] || translationsByLang.es).cookies;

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY)) return;
    // Espera a que la pantalla de carga desaparezca (~3.1s) antes de mostrar el banner
    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setTimeout(() => setShow(true), 20));
    }, 4900);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setShow(false);
    setTimeout(() => setVisible(false), 600); // Espera a que la animación de salida termine antes de ocultar el banner
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-500 ease-out"
      style={{
        background: '#0d1526',
        borderTop: '1px solid #1E293B',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#9CA3AF' }}>
          {t.text}{' '}
          <a
            href={`/${lang}#politica-cookies`}
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: '#38BDF8' }}
          >
            {t.link}
          </a>
          .
        </p>
        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          <button
            onClick={() => handleConsent('accepted')}
            className="flex-1 sm:flex-none text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #0090C9, #0284C7)',
              padding: '8px 20px',
            }}
          >
            {t.accept}
          </button>
          <button
            onClick={() => handleConsent('declined')}
            className="flex-1 sm:flex-none text-sm font-medium rounded-lg transition-colors hover:bg-white/5"
            style={{
              color: '#9CA3AF',
              border: '1px solid #374151',
              padding: '8px 20px',
              background: 'transparent',
            }}
          >
            {t.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
