import { useLocation, Link } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  const lang = location.pathname.split('/')[1] === 'en' ? 'en' : 'es';

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-center px-4">
      <p className="text-cyan text-xs font-bold uppercase tracking-widest mb-4">404</p>
      <h1 className="text-5xl font-black text-white mb-4">
        {lang === 'en' ? 'Page not found' : 'Página no encontrada'}
      </h1>
      <p className="text-gray-400 mb-8">
        {lang === 'en'
          ? 'The page you are looking for does not exist.'
          : 'La página que buscas no existe.'}
      </p>
      <Link
        to={`/${lang}`}
        className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3 rounded-lg transition-all"
      >
        {lang === 'en' ? '← Back to home' : '← Volver al inicio'}
      </Link>
    </div>
  );
}