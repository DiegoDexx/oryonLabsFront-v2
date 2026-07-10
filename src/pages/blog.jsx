import { useLocation } from 'react-router-dom';
import BlogSection from '../components/sections/BlogSection';
import es from '../locales/es.json';
import en from '../locales/en.json';

const translationsByLang = { es, en };

export default function BlogPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;

  return (
    <div className="min-h-screen bg-white">
      <BlogSection lang={lang} />
    </div>
  );
}
