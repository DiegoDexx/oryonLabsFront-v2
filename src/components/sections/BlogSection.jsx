import { Link } from 'react-router-dom';

const samplePosts = [
  {
    slug: 'ia-para-captacion-clientes',
    title: 'Cómo la IA puede ayudar a tu negocio y a captar clientes',
    excerpt: 'Casos prácticos y tácticas para automatizar la captación y el seguimiento de leads con IA.',
    date: '2026-06-01',
  },
  {
    slug: 'fin-de-la-administracion-manual',
    title: 'La administración manual de tareas básicas está condenada',
    excerpt: 'Por qué automatizar procesos administrativos es clave para crecimiento y ahorro de costes.',
    date: '2026-05-12',
  },
  {
    slug: 'apollo-b2b-y-colaboracion',
    title: 'Nuestra futura implementación de Apollo y colaboración B2B',
    excerpt: 'Cómo planeamos integrar Apollo para mejorar el rendimiento y las integraciones B2B.',
    date: '2026-04-20',
  },
  {
    slug: 'ecosistema-de-automatizacion',
    title: 'Implementamos un ecosistema que te ayuda',
    excerpt: 'Componentes y servicios que forman el ecosistema OryonX para automatizar ventas y atención.',
    date: '2026-03-08',
  }
];

export default function BlogSection({ lang = 'es' }) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-navy">{lang === 'en' ? 'Blog' : 'Blog'}</h2>
          <p className="text-gray-600 mt-3">{lang === 'en' ? 'Insights on AI, product updates and industry trends' : 'Artículos sobre IA, novedades y tendencias del sector'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {samplePosts.map((post) => (
            <article key={post.slug} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <img src={`https://source.unsplash.com/560x320/?technology,ai,${encodeURIComponent(post.slug)}`} alt={post.title} className="w-full h-40 object-cover rounded-md" />
              </div>
              <h3 className="font-bold text-lg text-navy mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{post.date}</span>
                <Link to={`/blog/${post.slug}`} className="text-cyan font-semibold">{lang === 'en' ? 'Read article' : 'Leer artículo'}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
