import { useLocation, Link } from 'react-router-dom';
import es from '../locales/aboutus/es.json';
import en from '../locales/aboutus/en.json';
import { seoData } from '../seo/seoData';
import HelmetSEO from '../seo/HelmetSEO';
import TeamExpandGrid from '../components/ui/TeamExpandGrid';
import AnimatedSection from '../components/ui/AnimatedSection';
import StaggerContainer from '../components/ui/StaggerContainer';
import logo from '../assets/img/logo_blue_ox.webp';
import renePhoto from '../assets/img/team_img/rene.webp';
import diegoPhoto from '../assets/img/team_img/diego.webp';
import benjyPhoto from '../assets/img/team_img/benjy.webp';

const translationsByLang = { es, en };

// Team content provided by Diego as editable placeholder copy — review wording before publishing.
const TEAM = [
  { id: 'rene', photo: renePhoto, color: 'navy' },
  { id: 'diego', photo: diegoPhoto, color: 'cyan' },
  { id: 'benjy', photo: benjyPhoto, color: 'navy' },
];

export default function AboutUsPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const seo = seoData[lang]?.aboutus;

  const pricingAnchor = lang === 'en' ? 'pricing' : 'precios';
  const contactAnchor = lang === 'en' ? 'contact' : 'contacto';

  return (
    <div className="bg-white min-h-screen">
      {seo && (
        <HelmetSEO
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          url={seo.url}
          lang={lang}
          alternates={seo.alternates}
        />
      )}

      {/* ── Hero de misión ──────────────────────────────────── */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.06) 0%, transparent 70%)' }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-4 py-2 text-cyan-dark text-sm font-semibold mb-6">
              {t.hero.eyebrow}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-[1.08]">{t.hero.title}</h1>
            <p className="text-lg text-gray-300 leading-relaxed">{t.hero.text}</p>
          </AnimatedSection>
          <AnimatedSection delay={150} className="flex items-center justify-center">
            <img
              src={logo}
              alt="OryonX"
              loading="lazy"
              decoding="async"
              style={{
                height: '180px',
                width: 'auto',
                filter: 'brightness(1.15) drop-shadow(0 0 16px rgba(0,144,201,0.35))',
              }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-navy text-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,144,201,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-cyan-light text-sm font-semibold mb-6">
              {t.values.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{t.values.title}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">{t.values.subtitle}</p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={100}>
            {t.values.items.map((item, i) => (
              <div
                key={i}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/30"
              >
                <h3 className="text-white font-bold mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Conoce al equipo ────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t.team.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">{t.team.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{t.team.subtitle}</p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <TeamExpandGrid
              members={TEAM.map((member) => ({ ...member, ...t.team.members[member.id] })).filter((m) => m.name)}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Our journey ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
              {t.journey.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">{t.journey.title}</h2>
          </AnimatedSection>

          <AnimatedSection delay={100} className="relative pl-8 sm:pl-10">
            <div className="absolute left-0 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-cyan to-cyan/10" />
            <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan ring-4 ring-cyan-pale" />
            <div className="rounded-[28px] border border-gray-200 bg-slate-50 p-8 lg:p-10 shadow-sm">
              <span className="inline-block bg-navy text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
                {t.journey.badge}
              </span>
              <p className="text-gray-600 text-lg leading-relaxed">{t.journey.text}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-navy text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,144,201,0.1) 0%, transparent 70%)' }}
        />
        <AnimatedSection className="relative max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan font-semibold mb-3">{t.cta.eyebrow}</p>
          <h2 className="text-3xl font-extrabold mb-4">{t.cta.title}</h2>
          <p className="text-gray-300 mb-10 text-lg">{t.cta.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`/${lang}#${contactAnchor}`}
              className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg shadow-cyan/20"
            >
              {t.cta.cta_expert}
            </Link>
            <Link
              to={`/${lang}#${pricingAnchor}`}
              className="border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-lg transition-all"
            >
              {t.cta.cta_plans}
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
