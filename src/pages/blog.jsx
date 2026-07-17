import { useLocation } from 'react-router-dom';
import BlogSection from '../components/sections/BlogSection';
import { HelmetSEO, seoData } from '../seo';

export default function BlogPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const seo = seoData[lang]?.blog;

  return (
    <div className="min-h-screen bg-white">
      {seo && <HelmetSEO {...seo} />}
      <BlogSection lang={lang} />
    </div>
  );
}
