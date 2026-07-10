import { useLocation } from 'react-router-dom';
import {
  FaUser, FaComments, FaEnvelope, FaBolt, FaMobileAlt, FaClock,
  FaRobot, FaChartBar, FaNetworkWired, FaHeadset, FaExclamationTriangle,
} from 'react-icons/fa';
import logoBlue2 from '../../assets/img/logo_blue2.webp';
import useCurrency from '../../hooks/useCurrency';
import { AnimatedSection } from '../ui/AnimatedSection';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

export default function WhyOryonLabs() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const why = t.why;
  const symbol = useCurrency().symbol;

  // "~80" → "~€80/mes" | "500–800" → "€500–800/mes"
  const fmt = (amount, period = '') => {
    const approx = amount.startsWith('~');
    const num = approx ? amount.slice(1) : amount;
    return `${approx ? '~' : ''}${symbol}${num}${period}`;
  };

  // Máx. 5 líneas por card (ver Fase 2.1) — se omite el ítem 6 (más "meta", sin precio/badge)
  const painItems = [
    { Icon: FaUser,      text: why.pain.item1, price: why.pain.price1 },
    { Icon: FaComments,  text: why.pain.item2, price: why.pain.price2 },
    { Icon: FaEnvelope,  text: why.pain.item3, price: why.pain.price3 },
    { Icon: FaBolt,      text: why.pain.item4, price: why.pain.price4 },
    { Icon: FaMobileAlt, text: why.pain.item5, price: why.pain.price5 },
  ];

  const solutionItems = [
    { Icon: FaRobot,        text: why.solution.item1, included: true, highlight: true },
    { Icon: FaChartBar,     text: why.solution.item2, included: true },
    { Icon: FaEnvelope,     text: why.solution.item3, included: true },
    { Icon: FaNetworkWired, text: why.solution.item4, included: true },
    { Icon: FaHeadset,      text: why.solution.item5, included: true },
  ];

  // Badge de ahorro: rango alto de la competencia (peor caso) menos el precio OryonX
  const [, painHigh] = why.pain.total.split(/[–-]/).map((n) => parseInt(n.replace(/\D/g, ''), 10));
  const oryonPrice = parseInt(why.solution.price, 10);
  const maxSavings = Math.floor(Math.max(painHigh - oryonPrice, 0) / 10) * 10;
  const savingsText = why.savings_badge.replace('{amount}', `${symbol}${maxSavings}`);

  return (
    <section className="relative bg-navy-light py-24 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,144,201,0.06),transparent_65%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="text-center mb-14">
          <p className="text-cyan text-xs font-bold uppercase tracking-[0.25em] mb-5">
            {why.eyebrow}
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl mx-auto mb-5">
            {why.title}
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            {why.subtitle.replace('{currency}', symbol)}
          </p>
        </AnimatedSection>

        {/* Savings badge — primer elemento que el ojo captura tras el titular */}
        <AnimatedSection delay={40} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-cyan/30">
            <FaBolt className="w-3.5 h-3.5 flex-shrink-0" />
            {savingsText}
          </div>
        </AnimatedSection>

        {/* Comparison cards */}
        <AnimatedSection delay={80} className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-4 items-stretch">

          {/* ── Pain card ── */}
          <div className="bg-navy rounded-2xl border border-white/10 p-8 flex flex-col">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              {why.pain.label}
            </p>

            <div className="flex-1 divide-y divide-white/5">
              {painItems.map(({ Icon, text, price }, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-4 first:pt-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-gray-400 text-sm leading-snug">{text}</span>
                  </div>
                  {price ? (
                    <span className="text-gray-400 text-sm font-medium flex-shrink-0">{fmt(price, why.pain.per_month)}</span>
                  ) : (
                    <div className="w-5 h-5 bg-red-500/15 border border-red-500/25 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] mb-2">
                {why.pain.total_label}
              </p>
              <div className="flex items-center gap-2 mb-1">
                <FaExclamationTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xl font-black text-red-500">{fmt(why.pain.total, why.pain.per_month)}</p>
              </div>
              <p className="text-gray-500 text-xs">{why.pain.description}</p>
            </div>
          </div>

          {/* ── VS badge — desktop (absolutely centred over the gap) ── */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-12 h-12 bg-cyan rounded-full flex items-center justify-center shadow-lg shadow-cyan/40 ring-4 ring-navy-light">
              <span className="text-white font-black text-xs tracking-wider">VS</span>
            </div>
          </div>

          {/* ── VS badge — mobile (grid item now, sits naturally between stacked cards; lg:hidden = display:none on desktop, so it takes zero grid space and never breaks the 2-col layout) ── */}
          <div className="flex lg:hidden justify-center my-2 z-10 relative">
            <div className="w-11 h-11 bg-cyan rounded-full flex items-center justify-center shadow-lg shadow-cyan/40 ring-4 ring-navy-light">
              <span className="text-white font-black text-xs tracking-wider">VS</span>
            </div>
          </div>

          {/* ── Solution card ── */}
          <div className="bg-navy rounded-2xl border border-cyan/35 p-8 flex flex-col pricing-glow">

            {/* Card header: logo + name */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={logoBlue2}
                alt="OryonX"
                className="w-9 h-9 rounded-xl flex-shrink-0 object-contain"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,144,201,0.4))' }}
              />
              <div>
                <p className="text-white font-bold text-sm leading-tight">OryonX</p>
                <p className="text-cyan text-xs font-semibold leading-tight">{why.solution.label}</p>
              </div>
            </div>

            <p className="text-cyan text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              {why.solution.eyebrow}
            </p>

            <div className="flex-1 divide-y divide-cyan/10">
              {solutionItems.map(({ Icon, text, included, highlight }, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-4 first:pt-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 text-cyan" />
                    </div>
                    <span className={`text-sm leading-snug ${highlight ? 'text-white font-semibold' : 'text-gray-200'}`}>
                      {text}
                    </span>
                  </div>
                  {included ? (
                    <span className="text-cyan text-[11px] font-semibold flex-shrink-0 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-full">
                      {why.solution.included}
                    </span>
                  ) : (
                    <div className="w-5 h-5 bg-cyan/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaClock className="w-2.5 h-2.5 text-cyan/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-cyan/20">
              <p className="text-cyan text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                {why.solution.price_label}
              </p>
              <p className="text-4xl lg:text-4xl font-black text-cyan mb-2 leading-none tracking-tight">
                {fmt(why.solution.price, why.solution.per_month)}
              </p>
              <p className="text-gray-400 text-xs">{why.solution.description}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonial */}
        <AnimatedSection delay={160} className="mt-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 max-w-2xl mx-auto">
          <p className="text-cyan text-3xl leading-none font-serif mb-2">"</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">{why.testimonial.text}</p>
          <p className="text-gray-500 text-xs">{why.testimonial.author}</p>
        </AnimatedSection>

        {/* CTA — un único botón sólido; el secundario queda como link de menor peso */}
        <AnimatedSection delay={220} className="mt-8 flex flex-col items-center gap-3">
          <a
            href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
            className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan/25"
          >
            {why.cta.primary}
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            className="text-gray-400 hover:text-white text-sm font-medium underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-colors"
          >
            {why.cta.secondary}
          </button>
        </AnimatedSection>

      </div>
    </section>
  );
}