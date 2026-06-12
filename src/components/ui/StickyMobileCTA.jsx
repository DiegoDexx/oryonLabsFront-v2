import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

export default function StickyMobileCTA() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = (translationsByLang[lang] || translationsByLang.es).nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (scrolled) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    } else {
      setMounted(false);
    }
  }, [scrolled]);

  if (!scrolled) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[45] transition-transform duration-300"
      style={{
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        background: 'rgba(6, 15, 39, 0.97)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="px-4 py-3">
        <a
          href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
          className="block w-full text-center text-white font-semibold text-sm py-3.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0090C9, #0284C7)' }}
        >
          {t.cta_pricing}
        </a>
      </div>
    </div>
  );
}
