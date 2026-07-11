import { useLocation } from 'react-router-dom';
import BlogSection from '../components/sections/BlogSection';

export default function BlogPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';

  return (
    <div className="min-h-screen bg-white">
      <BlogSection lang={lang} />
    </div>
  );
}
