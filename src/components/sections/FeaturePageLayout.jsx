import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useInView } from '../../hooks/useInView';
import { SERVICE_ORDER } from '../../config/services';
import {
  ChatbotHeroVisual,
  IntegrationsHeroVisual,
  CustomAIHeroVisual,
  CRMHeroVisual,
} from './HeroVisuals';
// BlogSection is now a standalone page; keep component in repo for reuse

/* ── Count-up hook ─────────────────────────────────────────── */
function useCountUp(figureStr, duration = 1800, active = false) {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    const match = figureStr.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) { setDisplay(figureStr); return; }
    const [, pre, numStr, suf] = match;
    const target = parseFloat(numStr);

    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${pre}${Math.round(eased * target)}${suf}`);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, figureStr, duration]);

  return display;
}

/* ── FadeIn wrapper — reusable scroll-triggered entrance ────── */
function FadeIn({ children, delay = 0, y = 24, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '650ms',
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Professional hero illustrations ──────────────────────── */
const WebIll = () => (
  <svg viewBox="0 0 320 230" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="web-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0F1F4A" />
        <stop offset="100%" stopColor="#080F28" />
      </linearGradient>
      <linearGradient id="web-hero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0090C9" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {/* Browser frame */}
    <rect x="4" y="4" width="312" height="222" rx="12" fill="url(#web-bg)" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    {/* Chrome bar */}
    <rect x="4" y="4" width="312" height="34" rx="12" fill="white" fillOpacity="0.05" />
    <rect x="4" y="28" width="312" height="10" fill="white" fillOpacity="0.04" />
    {/* Traffic lights */}
    <circle cx="22" cy="21" r="5" fill="#FF5F57" fillOpacity="0.75" />
    <circle cx="37" cy="21" r="5" fill="#FFBD2E" fillOpacity="0.75" />
    <circle cx="52" cy="21" r="5" fill="#28CA41" fillOpacity="0.75" />
    {/* Address bar */}
    <rect x="70" y="13" width="180" height="16" rx="8" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
    <circle cx="82" cy="21" r="3.5" fill="white" fillOpacity="0.2" />
    <rect x="90" y="18" width="100" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
    {/* Nav bar inside site */}
    <rect x="4" y="38" width="312" height="30" fill="#060F27" />
    <rect x="16" y="48" width="40" height="10" rx="5" fill="#0090C9" fillOpacity="0.8" />
    <rect x="200" y="49" width="28" height="8" rx="4" fill="white" fillOpacity="0.12" />
    <rect x="234" y="49" width="28" height="8" rx="4" fill="white" fillOpacity="0.12" />
    <rect x="268" y="46" width="36" height="14" rx="7" fill="#0090C9" fillOpacity="0.7" />
    {/* Hero section */}
    <rect x="4" y="68" width="312" height="80" fill="url(#web-hero)" />
    <rect x="16" y="78" width="120" height="14" rx="5" fill="white" fillOpacity="0.55" />
    <rect x="16" y="97" width="160" height="10" rx="5" fill="white" fillOpacity="0.3" />
    <rect x="16" y="112" width="130" height="9" rx="4.5" fill="white" fillOpacity="0.2" />
    <rect x="16" y="130" width="80" height="26" rx="13" fill="#0090C9" fillOpacity="0.85" />
    <rect x="104" y="130" width="80" height="26" rx="13" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
    {/* Content grid */}
    <rect x="14" y="162" width="88" height="56" rx="8" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="22" y="170" width="50" height="22" rx="6" fill="#0090C9" fillOpacity="0.15" />
    <rect x="22" y="198" width="60" height="6" rx="3" fill="white" fillOpacity="0.2" />
    <rect x="22" y="208" width="42" height="5" rx="2.5" fill="white" fillOpacity="0.12" />

    <rect x="116" y="162" width="88" height="56" rx="8" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="124" y="170" width="50" height="22" rx="6" fill="#F97316" fillOpacity="0.12" />
    <rect x="124" y="198" width="55" height="6" rx="3" fill="white" fillOpacity="0.2" />
    <rect x="124" y="208" width="40" height="5" rx="2.5" fill="white" fillOpacity="0.12" />

    <rect x="218" y="162" width="88" height="56" rx="8" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="226" y="170" width="50" height="22" rx="6" fill="#22C55E" fillOpacity="0.12" />
    <rect x="226" y="198" width="62" height="6" rx="3" fill="white" fillOpacity="0.2" />
    <rect x="226" y="208" width="44" height="5" rx="2.5" fill="white" fillOpacity="0.12" />

    {/* Chat widget */}
    <rect x="264" y="148" width="44" height="44" rx="22" fill="#0090C9" fillOpacity="0.9" />
    <path d="M282 163 C277 163 273 166.5 273 170.8 C273 172.3 273.5 173.7 274.5 174.8 L273 178 L276.4 176.8 C277.6 177.4 278.9 177.7 282.2 177.7 C287.1 177.7 291 174.2 291 170 C291 165.8 287.3 163 282 163Z" fill="white" fillOpacity="0.9" />
  </svg>
);


function HeroIllustration({ slug, lang }) {
  const map = {
    'asistente-24-7': <ChatbotHeroVisual lang={lang} />,
    crm: <CRMHeroVisual lang={lang} />,
    'desarrollo-web': <WebIll />,
    integraciones: <IntegrationsHeroVisual lang={lang} />,
    'custom-ai': <CustomAIHeroVisual lang={lang} />,
  };
  return map[slug] || <ChatbotHeroVisual lang={lang} />;
}

/* ── Managed-service panel mockups ────────────────────────────
   Brand positioning is "done-for-you", not a self-serve tool, so
   the "Qué incluye" and "Para quién es" blocks reuse the same
   dark dashboard-mockup language as CRMHeroVisual (see
   HeroVisuals.jsx) instead of generic checkmark lists / stock
   illustrations. This also removes the dependency on the old
   illustration set, which was inconsistent in style across cards
   and had at least one image with English text baked into the
   artwork ("REPAIR MASTER") on an otherwise Spanish-language site. */
const PANEL_ACCENTS = ['#0090C9', '#22C55E', '#F97316', '#A855F7'];

function IncludesPanel({ items, lang }) {
  return (
    <div className="rounded-[24px] bg-navy p-5 shadow-xl shadow-navy/10 border border-white/5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          {lang === 'en' ? 'Managed for you' : 'Gestionado por nosotros'}
        </span>
        <span className="text-[11px] font-semibold text-white/40">
          {items.length} {lang === 'en' ? 'active' : 'activas'}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const accent = PANEL_ACCENTS[i % PANEL_ACCENTS.length];
          return (
            <div
              key={i}
              className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-white/5 bg-white/[0.04] py-2.5 pl-3.5 pr-3"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
              <p className="text-[13px] leading-5 text-white/85">{item}</p>
              <span
                className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide"
                style={{ color: accent }}
              >
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
                {lang === 'en' ? 'Active' : 'Activo'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SECTOR_LABEL_STOPWORDS = new Set([
  'con', 'de', 'del', 'la', 'el', 'los', 'las', 'y', 'o', 'que', 'ya', 'les',
  'para', 'sin', 'su', 'tu', 'a', 'en', 'un', 'una', 'and', 'with', 'for', 'the', 'of', 'an',
]);

function sectorInitials(sector) {
  const words = sector.replace(/[()]/g, '').split(/\s+/).filter(Boolean);
  const significant = words.filter((w) => w.length > 2 && !SECTOR_LABEL_STOPWORDS.has(w.toLowerCase()));
  const source = significant.length ? significant : words;
  // Sectors on the same page often share an opening phrase ("Negocios que
  // quieren…"), so pairing the first + last significant word keeps the
  // initials distinct instead of always landing on the shared prefix.
  const pick = source.length > 1 ? [source[0], source[source.length - 1]] : source;
  return pick.map((w) => w[0]).join('').toUpperCase();
}

function AudiencePanel({ sector, result, index, lang }) {
  const accent = PANEL_ACCENTS[index % PANEL_ACCENTS.length];
  const bars = [4, 7, 5, 9, 6, 10];
  return (
    <div className="relative h-52 overflow-hidden bg-navy p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {sectorInitials(sector)}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70 font-semibold">
              {lang === 'en' ? 'Target' : 'Audiencia'}
            </p>
            <p className="mt-1 text-lg font-bold leading-tight text-white truncate">{sector}</p>
          </div>
        </div>
        <span className="flex flex-shrink-0 items-center gap-1 text-[9px] font-bold uppercase text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          {lang === 'en' ? 'Live' : 'En vivo'}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-[3px] h-8">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-sm"
              style={{ height: `${h * 2.2}px`, backgroundColor: accent, opacity: 0.55 }}
            />
          ))}
        </div>
        <p className="text-right text-xs font-bold leading-snug text-white/90 max-w-[55%]">{result}</p>
      </div>
    </div>
  );
}

/* ── "Para quién es" segmentation criterion ───────────────────
   INCONSISTENCY (flagged, not resolved here — needs a content
   decision, not a code fix): asistente-24-7 groups audiences by
   business vertical (trades, clinics, locksmiths/breakdown),
   while crm / desarrollo-web / integraciones / custom-ai group
   them by pain point / symptom (app fatigue, manual processes,
   wanting a competitive edge...). These are two different
   segmentation logics living side by side in the same site.
   `pageData.for_who_segmentation` (see locales/services/*.json)
   makes the criterion swappable per page via config instead of
   hardcoding it, so whichever segmentation the business settles
   on can be applied without touching this component again. */
const SEGMENTATION_LABELS = {
  vertical: { en: 'Segmented by industry', es: 'Segmentado por sector' },
  symptom: { en: 'Segmented by need', es: 'Segmentado por necesidad' },
};

/* ── Staggered how-it-works section ───────────────────────── */
function HowItWorksSection({ steps, label }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-10">
            {label}
          </span>
        </FadeIn>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-cyan/30 hover:shadow-lg"
              style={{
                transitionProperty: 'opacity, transform, box-shadow, border-color',
                transitionDuration: '600ms',
                transitionDelay: `${i * 140}ms`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(28px)',
              }}
            >
              <span className="text-5xl font-extrabold text-cyan/15 mb-5 block leading-none select-none">
                {step.step}
              </span>
              <h3 className="text-lg font-bold text-navy mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ item ──────────────────────────────────────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left text-navy hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm pr-4">{question}</span>
        {open
          ? <FaChevronUp className="w-4 h-4 flex-shrink-0 text-cyan" />
          : <FaChevronDown className="w-4 h-4 flex-shrink-0 text-cyan" />}
      </button>
      {open && (
        <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-100 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ── Stat block with count-up ──────────────────────────────── */
function StatBlock({ stat, label }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const count = useCountUp(stat.figure, 1800, inView);

  return (
    <section ref={ref} className="py-20 px-4 bg-navy text-white overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <span className="inline-block bg-cyan/10 text-cyan text-xs font-bold px-5 py-2 rounded-full mb-10 uppercase tracking-widest border border-cyan/15">
            {label}
          </span>
        </FadeIn>
        <p
          className="text-8xl lg:text-9xl font-extrabold text-cyan mb-6 leading-none tabular-nums"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 900ms 150ms, transform 900ms 150ms',
          }}
        >
          {count}
        </p>
        <p
          className="text-xl text-gray-200 mb-4 leading-relaxed max-w-xl mx-auto"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 700ms 400ms',
          }}
        >
          {stat.text}
        </p>
        <p
          className="text-xs text-gray-500"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 700ms 600ms' }}
        >
          — {stat.source}
        </p>
      </div>
    </section>
  );
}

/* ── Main layout ───────────────────────────────────────────── */
export default function FeaturePageLayout({ pageData, fp, lang }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!pageData) return null;

  const basePath = `/${lang}`;
  const pricingAnchor = lang === 'en' ? 'pricing' : 'precios';
  const contactAnchor = lang === 'en' ? 'contact' : 'contacto';

  const currentIndex = SERVICE_ORDER.indexOf(pageData.slug);
  const prevSlug = SERVICE_ORDER[(currentIndex - 1 + SERVICE_ORDER.length) % SERVICE_ORDER.length];
  const nextSlug = SERVICE_ORDER[(currentIndex + 1) % SERVICE_ORDER.length];
  const prevTitle = fp.nav_titles?.[prevSlug];
  const nextTitle = fp.nav_titles?.[nextSlug];

  const heroStyle = (delay, y = 20) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : `translateY(${y}px)`,
    transition: `opacity 700ms ${delay}ms, transform 700ms ${delay}ms`,
  });

  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-navy text-white flex items-center overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.12) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.06) 0%, transparent 70%)' }} />
          {/* Subtle grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <Link
              to={`${basePath}#${pricingAnchor}`}
              className="inline-flex items-center gap-2 text-cyan/60 text-sm mb-4 hover:text-cyan transition-colors"
              style={heroStyle(0, 10)}
            >
              ← {fp.back_to_pricing}
            </Link>
            {prevTitle && nextTitle && (
              <div
                className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-10"
                style={heroStyle(60, 10)}
              >
                <Link
                  to={`${basePath}/servicios/${prevSlug}`}
                  className="inline-flex items-center gap-1.5 text-cyan/50 text-xs sm:text-sm font-medium hover:text-cyan transition-colors"
                >
                  <span aria-hidden="true">←</span> {prevTitle}
                </Link>
                <Link
                  to={`${basePath}/servicios/${nextSlug}`}
                  className="inline-flex items-center gap-1.5 text-cyan/50 text-xs sm:text-sm font-medium hover:text-cyan transition-colors"
                >
                  {nextTitle} <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-[1.08]"
              style={heroStyle(100)}
            >
              {pageData.hero_title}
            </h1>
            <p
              className="text-lg text-gray-300 max-w-lg leading-relaxed mb-10"
              style={heroStyle(240)}
            >
              {pageData.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4" style={heroStyle(380, 14)}>
              <Link
                to={`${basePath}#${pricingAnchor}`}
                className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg shadow-cyan/20"
              >
                {pageData.cta_plans_text}
              </Link>
              <Link
                to={`${basePath}#${contactAnchor}`}
                className="border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-lg transition-all"
              >
                {fp.cta_expert}
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div
            className="hidden lg:flex items-center justify-center"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1100ms 500ms' }}
          >
            <div className="w-full max-w-sm max-h-96 flex items-center justify-center drop-shadow-2xl">
              <HeroIllustration slug={pageData.slug} lang={lang} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: mounted ? 0.45 : 0, transition: 'opacity 700ms 950ms' }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ─────────────────────────────────── */}
      <HowItWorksSection id={lang === 'en' ? 'how-it-works' : 'como-funciona'} steps={pageData.how_it_works} label={fp.how_it_works_label} />

      {/* ── Qué incluye + Para quién (redesigned with images + CTAs) ──────────────────────── */}
      <section id={lang === 'en' ? 'what-includes' : 'que-incluye'} className="py-20 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <FadeIn className="flex flex-col rounded-[28px] border border-gray-200 bg-slate-50 p-10 shadow-sm">
              <div className="mb-8 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-4 py-2 text-cyan-dark text-sm font-semibold">
                  {fp.what_includes_label}
                </span>
                <h2 className="mt-6 text-3xl lg:text-4xl font-extrabold text-navy">
                  {lang === 'en' ? 'Everything included for your team' : 'Todo lo incluido para tu equipo'}
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {lang === 'en'
                    ? 'A clear package of features designed for fast implementation, lead control, and automated follow-up.'
                    : 'Un paquete claro de funcionalidades diseñado para una implementación rápida, control de leads y seguimiento automatizado.'}
                </p>
              </div>
              <IncludesPanel items={pageData.what_includes} lang={lang} />
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to={`${basePath}#${pricingAnchor}`}
                  className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan/20 transition hover:bg-cyan-medium"
                >
                  {pageData.cta_plans_text}
                </Link>
                <Link
                  to={`${basePath}#${contactAnchor}`}
                  className="inline-flex items-center justify-center rounded-full border border-cyan text-cyan px-6 py-3 text-sm font-semibold transition hover:bg-cyan/10"
                >
                  {fp.cta_expert}
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={150} className="flex flex-col gap-6">
              <div className="rounded-[28px] border border-gray-200 bg-slate-50 p-8 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-4 py-2 text-cyan-dark text-sm font-semibold">
                      {fp.for_who_label}
                    </span>
                    {pageData.for_who_segmentation && (
                      <span className="text-xs font-medium text-gray-400">
                        {SEGMENTATION_LABELS[pageData.for_who_segmentation]?.[lang]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-navy">
                    {lang === 'en'
                      ? 'Who gets the most value'
                      : 'Para quién es esto'}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {lang === 'en'
                      ? 'Clear use cases for teams that need lead visibility, predictable workflows, and faster sales cycles.'
                      : 'Casos de uso claros para equipos que necesitan visibilidad de leads, procesos predecibles y ciclos de venta más rápidos.'}
                  </p>
                </div>
              </div>

              <div id={lang === 'en' ? 'for-who' : 'para-quien'} className="grid grid-cols-1 gap-6">
                {pageData.for_who.map((item, i) => (
                  <article key={i} className="group cursor-pointer overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <AudiencePanel sector={item.sector} result={item.result} index={i} lang={lang} />
                    <div className="p-6">
                      <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-3 py-2 text-xs font-semibold text-cyan-dark">
                          <FaCheck className="w-3.5 h-3.5" />
                          {item.result}
                        </span>
                        {item.illustrative && (
                          <span className="text-[11px] text-gray-400">
                            {fp.illustrative_figure_label}
                          </span>
                        )}
                        <Link
                          to={`${basePath}#${contactAnchor}`}
                          className="text-sm font-semibold text-cyan hover:text-cyan-dark"
                        >
                          {lang === 'en' ? 'Contact us about this' : 'Contacta sobre esto'}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Blog moved to a dedicated page (accessible from Footer). */}

      {/* ── Stat block with animated counter ─────────────── */}
      <StatBlock stat={pageData.stat} label={fp.stat_label} />

      {/* ── Mini FAQ ──────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 bg-gray-50 scroll-mt-28">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8">
              {fp.faq_label}
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="space-y-3">
              {pageData.faq.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA doble ─────────────────────────────────────── */}
      <section id="cta" className="py-20 px-4 bg-navy text-white text-center relative overflow-hidden scroll-mt-28">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,144,201,0.1) 0%, transparent 70%)' }} />
        <FadeIn className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">
            {lang === 'en' ? 'Ready to activate this feature?' : '¿Listo para activar esta función?'}
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            {lang === 'en'
              ? 'Choose the plan that includes it and start automating today.'
              : 'Elige el plan que lo incluye y empieza a automatizar hoy.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`${basePath}#${pricingAnchor}`}
              className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg shadow-cyan/20"
            >
              {pageData.cta_plans_text}
            </Link>
            <Link
              to={`${basePath}#${contactAnchor}`}
              className="border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-lg transition-all"
            >
              {fp.cta_expert}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Related pages ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              {fp.related_label}
            </p>
            <div className="flex flex-wrap gap-3">
              {pageData.related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`${basePath}/servicios/${rel.slug}`}
                  className="inline-flex items-center gap-2 bg-gray-50 hover:bg-cyan-pale border border-gray-200 hover:border-cyan/40 text-navy hover:text-cyan-dark text-sm font-medium px-5 py-3 rounded-lg transition-all"
                >
                  {rel.title}
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
