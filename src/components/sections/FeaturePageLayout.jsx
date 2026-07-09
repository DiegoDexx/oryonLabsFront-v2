import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useInView } from '../../hooks/useInView';

/* ── Per-page SVG illustrations ───────────────────────────── */
function HeroIllustration({ slug }) {
  const map = {
    'asistente-24-7': (
      <svg viewBox="0 0 220 170" fill="none" className="w-full h-full">
        <rect x="65" y="20" width="90" height="130" rx="14" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
        <rect x="74" y="37" width="72" height="96" rx="7" fill="white" fillOpacity="0.04" />
        <rect x="78" y="46" width="44" height="15" rx="7.5" fill="#0090C9" fillOpacity="0.7" />
        <rect x="88" y="68" width="52" height="15" rx="7.5" fill="white" fillOpacity="0.1" />
        <rect x="78" y="90" width="36" height="15" rx="7.5" fill="#0090C9" fillOpacity="0.45" />
        <rect x="88" y="112" width="48" height="15" rx="7.5" fill="white" fillOpacity="0.08" />
        <circle cx="162" cy="34" r="9" fill="#F97316" fillOpacity="0.25" />
        <circle cx="162" cy="34" r="5" fill="#F97316" fillOpacity="0.8" />
        <circle cx="48" cy="85" r="3.5" fill="#0090C9" fillOpacity="0.4" />
        <circle cx="40" cy="72" r="2.5" fill="#0090C9" fillOpacity="0.25" />
        <circle cx="36" cy="92" r="3" fill="#0090C9" fillOpacity="0.3" />
      </svg>
    ),
    crm: (
      <svg viewBox="0 0 220 170" fill="none" className="w-full h-full">
        {[28, 84, 140].map((x, i) => (
          <g key={i}>
            <rect x={x} y="24" width="46" height="9" rx="4.5" fill="white" fillOpacity="0.12" />
            {[40, 57, 74, 91].slice(0, 4 - i).map((y, j) => (
              <rect key={j} x={x + 3} y={y} width="40" height="13" rx="6.5" fill="#0090C9" fillOpacity={0.22 + j * 0.08} />
            ))}
          </g>
        ))}
        <path d="M76 64 L82 64" stroke="#0090C9" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M132 54 L138 54" stroke="#0090C9" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="178" cy="42" r="16" fill="#0090C9" fillOpacity="0.15" stroke="#0090C9" strokeOpacity="0.35" strokeWidth="1.5" />
        <text x="178" y="47" textAnchor="middle" fill="#0090C9" fontSize="12" fontWeight="bold">92</text>
      </svg>
    ),
    'desarrollo-web': (
      <svg viewBox="0 0 220 170" fill="none" className="w-full h-full">
        <rect x="28" y="28" width="164" height="114" rx="9" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
        <rect x="28" y="28" width="164" height="22" rx="9" fill="white" fillOpacity="0.08" />
        <rect x="28" y="42" width="164" height="8" fill="white" fillOpacity="0.07" />
        <rect x="65" y="31" width="90" height="11" rx="5.5" fill="white" fillOpacity="0.1" />
        <circle cx="40" cy="37" r="3.5" fill="#F97316" fillOpacity="0.65" />
        <circle cx="52" cy="37" r="3.5" fill="white" fillOpacity="0.28" />
        <circle cx="64" cy="37" r="3.5" fill="#0090C9" fillOpacity="0.5" />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={38 + (i % 2) * 10} y={62 + i * 15} width={55 + (i % 3) * 22} height="7" rx="3.5" fill="#0090C9" fillOpacity={0.12 + i * 0.04} />
        ))}
        <rect x="132" y="94" width="44" height="26" rx="7" fill="#0090C9" fillOpacity="0.35" />
        <circle cx="141" cy="107" r="2.5" fill="white" fillOpacity="0.8" />
        <circle cx="152" cy="107" r="2.5" fill="white" fillOpacity="0.8" />
        <circle cx="163" cy="107" r="2.5" fill="white" fillOpacity="0.8" />
      </svg>
    ),
    integraciones: (
      <svg viewBox="0 0 220 170" fill="none" className="w-full h-full">
        <circle cx="110" cy="85" r="20" fill="#0090C9" fillOpacity="0.2" stroke="#0090C9" strokeOpacity="0.45" strokeWidth="2" />
        <circle cx="110" cy="85" r="11" fill="#0090C9" fillOpacity="0.5" />
        {[[54, 38], [166, 38], [30, 108], [190, 108], [110, 148]].map(([cx, cy], i) => (
          <g key={i}>
            <line x1="110" y1="85" x2={cx} y2={cy} stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx={cx} cy={cy} r="13" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="6" fill="#0090C9" fillOpacity="0.4" />
          </g>
        ))}
        <rect x="38" y="22" width="32" height="9" rx="4.5" fill="white" fillOpacity="0.1" />
        <rect x="150" y="22" width="32" height="9" rx="4.5" fill="white" fillOpacity="0.1" />
      </svg>
    ),
    'custom-ai': (
      <svg viewBox="0 0 220 170" fill="none" className="w-full h-full">
        {[30, 65, 100, 135].map((y, i) => (
          <circle key={`l1-${i}`} cx="46" cy={y} r="9" fill="#0090C9" fillOpacity="0.28" stroke="#0090C9" strokeOpacity="0.4" strokeWidth="1.5" />
        ))}
        {[45, 82, 120].map((y, i) => (
          <circle key={`l2-${i}`} cx="110" cy={y} r="11" fill="#0090C9" fillOpacity="0.38" stroke="#0090C9" strokeOpacity="0.5" strokeWidth="1.5" />
        ))}
        {[62, 102].map((y, i) => (
          <circle key={`l3-${i}`} cx="174" cy={y} r="13" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeOpacity="0.45" strokeWidth="1.5" />
        ))}
        {[30, 65, 100, 135].flatMap((y1, i) =>
          [45, 82, 120].map((y2, j) => (
            <line key={`c1-${i}-${j}`} x1="55" y1={y1} x2="99" y2={y2} stroke="#0090C9" strokeOpacity="0.12" strokeWidth="1" />
          ))
        )}
        {[45, 82, 120].flatMap((y1, i) =>
          [62, 102].map((y2, j) => (
            <line key={`c2-${i}-${j}`} x1="121" y1={y1} x2="161" y2={y2} stroke="#0090C9" strokeOpacity="0.18" strokeWidth="1" />
          ))
        )}
      </svg>
    ),
  };
  return map[slug] || map['asistente-24-7'];
}

/* ── How-it-works staggered section ───────────────────────── */
function HowItWorksSection({ steps, label }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-10">
          {label}
        </span>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-cyan/30 hover:shadow-md"
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: '600ms',
                transitionDelay: `${i * 130}ms`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <span className="text-5xl font-extrabold text-cyan/15 mb-4 block leading-none select-none">
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

/* ── FAQ accordion item ────────────────────────────────────── */
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

/* ── Main layout ───────────────────────────────────────────── */
export default function FeaturePageLayout({ pageData, fp, lang }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const { ref: includesRef, inView: includesInView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: forWhoRef, inView: forWhoInView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: statRef, inView: statInView } = useInView({ threshold: 0.25, triggerOnce: true });

  if (!pageData) return null;

  const basePath = `/${lang}`;
  const pricingAnchor = lang === 'en' ? 'pricing' : 'precios';
  const contactAnchor = lang === 'en' ? 'contact' : 'contacto';

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
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <Link
              to={`${basePath}#${pricingAnchor}`}
              className="inline-flex items-center gap-2 text-cyan/60 text-sm mb-10 hover:text-cyan transition-colors"
              style={heroStyle(0, 12)}
            >
              ← {fp.back_to_pricing}
            </Link>
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight"
              style={heroStyle(80)}
            >
              {pageData.hero_title}
            </h1>
            <p
              className="text-lg text-gray-300 max-w-lg leading-relaxed mb-10"
              style={heroStyle(220)}
            >
              {pageData.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4" style={heroStyle(370, 14)}>
              <Link
                to={`${basePath}#${pricingAnchor}`}
                className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-7 py-3.5 rounded-lg transition-all"
              >
                {pageData.cta_plans_text}
              </Link>
              <Link
                to={`${basePath}#${contactAnchor}`}
                className="border border-white/25 hover:border-white text-white font-semibold px-7 py-3.5 rounded-lg transition-all"
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
            <div className="w-72 h-56">
              <HeroIllustration slug={pageData.slug} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: mounted ? 0.4 : 0, transition: 'opacity 700ms 900ms' }}
        >
          <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ─────────────────────────────────── */}
      <HowItWorksSection steps={pageData.how_it_works} label={fp.how_it_works_label} />

      {/* ── Qué incluye + Para quién ──────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Qué incluye */}
          <div
            ref={includesRef}
            style={{
              opacity: includesInView ? 1 : 0,
              transform: includesInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 600ms, transform 600ms',
            }}
          >
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8">
              {fp.what_includes_label}
            </span>
            <ul className="space-y-3">
              {pageData.what_includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan" />
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quién */}
          <div
            ref={forWhoRef}
            style={{
              opacity: forWhoInView ? 1 : 0,
              transform: forWhoInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 600ms 150ms, transform 600ms 150ms',
            }}
          >
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8">
              {fp.for_who_label}
            </span>
            <div className="space-y-4">
              {pageData.for_who.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-cyan/25 transition-colors">
                  <p className="font-semibold text-navy text-sm mb-1">{item.sector}</p>
                  <p className="text-gray-600 text-sm mb-2 leading-relaxed">{item.description}</p>
                  <p className="text-cyan-dark text-xs font-semibold">{item.result}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat block ────────────────────────────────────── */}
      <section ref={statRef} className="py-20 px-4 bg-navy text-white overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-cyan/10 text-cyan text-xs font-bold px-4 py-2 rounded-full mb-10 uppercase tracking-widest">
            {fp.stat_label}
          </span>
          <p
            className="text-7xl lg:text-9xl font-extrabold text-cyan mb-6 leading-none"
            style={{
              opacity: statInView ? 1 : 0,
              transform: statInView ? 'scale(1)' : 'scale(0.75)',
              transition: 'opacity 800ms 100ms, transform 800ms 100ms',
            }}
          >
            {pageData.stat.figure}
          </p>
          <p
            className="text-xl text-gray-200 mb-4 leading-relaxed max-w-xl mx-auto"
            style={{
              opacity: statInView ? 1 : 0,
              transition: 'opacity 700ms 350ms',
            }}
          >
            {pageData.stat.text}
          </p>
          <p className="text-xs text-gray-500">— {pageData.stat.source}</p>
        </div>
      </section>

      {/* ── Mini FAQ ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8">
            {fp.faq_label}
          </span>
          <div className="space-y-3">
            {pageData.faq.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA doble ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">
            {lang === 'en'
              ? 'Ready to activate this feature?'
              : '¿Listo para activar esta función?'}
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            {lang === 'en'
              ? 'Choose the plan that includes it and start automating today.'
              : 'Elige el plan que lo incluye y empieza a automatizar hoy.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`${basePath}#${pricingAnchor}`}
              className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-4 rounded-lg transition-all"
            >
              {pageData.cta_plans_text}
            </Link>
            <Link
              to={`${basePath}#${contactAnchor}`}
              className="border border-white/25 hover:border-white text-white font-semibold px-8 py-4 rounded-lg transition-all"
            >
              {fp.cta_expert}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related pages ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
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
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
