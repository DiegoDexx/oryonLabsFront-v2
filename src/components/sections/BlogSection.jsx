import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import es from '../../locales/blog/es.json';
import en from '../../locales/blog/en.json';

import imgLeads from '../../assets/img/illustrations_features/AI_for_24-7Services (locksmiths, breakdown).webp';
import imgAdmin from '../../assets/img/illustrations_features/StressedAssistanDoingManuelThings.webp';
import imgB2B from '../../assets/img/illustrations_features/AI_CRM1_BusinessMarketing.webp';
import imgEcosystem from '../../assets/img/illustrations_features/AI_SaaS_Generic_Illustration1.webp';

const translationsByLang = { es, en };

const blogPosts = [
  { slug: 'ia-para-captacion-clientes', image: imgLeads },
  { slug: 'fin-de-la-administracion-manual', image: imgAdmin },
  { slug: 'apollo-b2b-y-colaboracion', image: imgB2B },
  { slug: 'ecosistema-de-automatizacion', image: imgEcosystem },
];

export default function BlogSection({ lang = 'es' }) {
  const [activePost, setActivePost] = useState(null);
  const t = translationsByLang[lang] || translationsByLang.es;

  const buttonContact = t.buttons.contact;
  const buttonPlans = t.buttons.plans;

  useEffect(() => {
    if (!activePost) return;
    const handleKey = (e) => { if (e.key === 'Escape') setActivePost(null); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [activePost]);

  return (
    <section className="bg-white">
    
      <section className="relative min-h-screen bg-navy text-white flex items-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#001D3A] via-cyan/30 to-transparent" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-4 py-2 text-cyan-dark text-sm font-semibold mb-6">{t.hero.eyebrow}</span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-[1.08]">{t.hero.title}</h1>
            <p className="text-lg text-cyan-100 max-w-lg leading-relaxed mb-10">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a href="#blog-list" className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg shadow-cyan/20">{t.hero.cta_list}</a>
              <Link to={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`} className="border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-lg transition-all">{buttonContact}</Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center" style={{ opacity: 1 }}>
            <div className="w-full max-w-sm max-h-96 flex items-center justify-center drop-shadow-2xl">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl w-full">
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-cyan/20 via-slate-900 to-transparent p-6">
                  <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_34%)]" />
                  <div className="relative space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.32em] text-cyan font-semibold">{t.panel.metric_label}</p>
                        <p className="text-3xl font-bold text-white">{t.panel.metric_value}</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan">{t.panel.metric_tag}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="blog-list" className="max-w-7xl mx-auto px-5 pt-8 sm:px-6 lg:px-8 pt-6 pb-24">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">{t.list.title}</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">{t.list.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((p) => {
            const post = t.posts[p.slug] || {};
            return (
              <article key={p.slug} className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={p.image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-navy">{t.card.badge}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-3">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase text-gray-400">{post.date}</span>
                    <button type="button" onClick={() => setActivePost({ ...p, ...post })} className="inline-flex items-center gap-2 text-cyan font-semibold transition hover:text-cyan-dark">{t.card.read_more}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-20 rounded-[32px] border border-gray-200 bg-navy px-8 py-12 text-white overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan font-semibold mb-3">{t.cta.eyebrow}</p>
              <h2 className="text-3xl font-extrabold mb-4">{t.cta.title}</h2>
              <p className="max-w-xl text-cyan-100 leading-relaxed">{t.cta.subtitle}</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
                className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-4 text-sm font-semibold text-navy transition hover:bg-cyan-medium"
              >
                {buttonContact}
              </Link>
              <Link
                to={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyan"
              >
                {buttonPlans}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActivePost(null)} />
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden max-h-[90vh] lg:h-[85vh] lg:max-h-[680px]"
            style={{ animation: 'modalIn 0.15s ease-out' }}
          >
            <button
              type="button"
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-600 shadow-md transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="lg:w-2/5 flex-shrink-0 h-56 sm:h-72 lg:h-full">
              <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
            </div>

            <div className="lg:w-3/5 flex-1 min-h-0 lg:overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">{activePost.date}</p>
              <h2 className="text-2xl font-bold text-navy mb-5 leading-tight">{activePost.title}</h2>
              <div className="space-y-4">
                {(activePost.content || []).map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-6">
                <Link
                  to={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
                  className="inline-flex items-center justify-center rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan-medium"
                  onClick={() => setActivePost(null)}
                >
                  {buttonContact}
                </Link>
                <Link
                  to={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
                  className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-cyan hover:text-cyan"
                  onClick={() => setActivePost(null)}
                >
                  {buttonPlans}
                </Link>
              </div>
            </div>
          </div>
          <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
        </div>
      )}
    </section>
  );
}
