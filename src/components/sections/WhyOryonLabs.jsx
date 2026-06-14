import { useLocation } from 'react-router-dom';
import {
  FaUser, FaComments, FaEnvelope, FaBolt, FaMobileAlt, FaClock,
  FaRobot, FaChartBar, FaNetworkWired, FaHeadset,
} from 'react-icons/fa';
import useCurrency from '../../hooks/useCurrency';
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

  const painItems = [
    { Icon: FaUser,      text: why.pain.item1, price: why.pain.price1 },
    { Icon: FaComments,  text: why.pain.item2, price: why.pain.price2 },
    { Icon: FaEnvelope,  text: why.pain.item3, price: why.pain.price3 },
    { Icon: FaBolt,      text: why.pain.item4, price: why.pain.price4 },
    { Icon: FaMobileAlt, text: why.pain.item5, price: why.pain.price5 },
    { Icon: FaClock,     text: why.pain.item6, price: null },
  ];

  const solutionItems = [
    { Icon: FaRobot,        text: why.solution.item1, included: true },
    { Icon: FaChartBar,     text: why.solution.item2, included: true },
    { Icon: FaEnvelope,     text: why.solution.item3, included: true },
    { Icon: FaNetworkWired, text: why.solution.item4, included: true },
    { Icon: FaHeadset,      text: why.solution.item5, included: true },
    { Icon: FaClock,        text: why.solution.item6, included: false },
  ];

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
        <div className="text-center mb-14">
          <p className="text-cyan text-xs font-bold uppercase tracking-[0.25em] mb-5">
            {why.eyebrow}
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl mx-auto mb-5">
            {why.title}
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            {why.subtitle.replace('{currency}', symbol)}
          </p>
        </div>

        {/* Comparison cards */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-4 items-stretch">

          {/* ── Pain card ── */}
          <div className="bg-navy rounded-2xl border border-white/10 p-6 flex flex-col">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              {why.pain.label}
            </p>

            <div className="space-y-3 flex-1">
              {painItems.map(({ Icon, text, price }, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
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

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] mb-2">
                {why.pain.total_label}
              </p>
              <p className="text-2xl font-black text-red-400 mb-1">{fmt(why.pain.total, why.pain.per_month)}</p>
              <p className="text-gray-500 text-xs">{why.pain.description}</p>
            </div>
          </div>

          {/* ── VS badge — desktop (absolutely centred over the gap) ── */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-12 h-12 bg-cyan rounded-full flex items-center justify-center shadow-lg shadow-cyan/40 ring-4 ring-navy-light">
              <span className="text-white font-black text-xs tracking-wider">VS</span>
            </div>
          </div>

          {/* ── Solution card ── */}
          <div className="bg-navy rounded-2xl border border-cyan/35 p-6 flex flex-col pricing-glow">

            {/* Card header: logo + name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-cyan rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">
                O
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Oryon Labs</p>
                <p className="text-cyan text-xs font-semibold leading-tight">{why.solution.label}</p>
              </div>
            </div>

            <p className="text-cyan text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              {why.solution.eyebrow}
            </p>

            <div className="space-y-3 flex-1">
              {solutionItems.map(({ Icon, text, included }, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 text-cyan" />
                    </div>
                    <span className="text-gray-200 text-sm leading-snug">{text}</span>
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

            <div className="mt-6 pt-5 border-t border-cyan/20">
              <p className="text-cyan text-[10px] font-bold uppercase tracking-[0.18em] mb-2">
                {why.solution.price_label}
              </p>
              <p className="text-2xl font-black text-cyan mb-1">{fmt(why.solution.price, why.solution.per_month)}</p>
              <p className="text-gray-400 text-xs">{why.solution.description}</p>
            </div>
          </div>
        </div>

        {/* ── VS badge — mobile (between stacked cards) ── */}
        <div className="flex lg:hidden justify-center my-2">
          <div className="w-11 h-11 bg-cyan rounded-full flex items-center justify-center shadow-lg shadow-cyan/40">
            <span className="text-white font-black text-xs tracking-wider">VS</span>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 max-w-2xl mx-auto">
          <p className="text-cyan text-3xl leading-none font-serif mb-2">"</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">{why.testimonial.text}</p>
          <p className="text-gray-500 text-xs">{why.testimonial.author}</p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
            className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan/25"
          >
            {why.cta.primary}
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            className="bg-transparent hover:bg-white/5 text-white font-semibold px-6 py-3.5 rounded-lg transition-all border border-white/30"
          >
            {why.cta.secondary}
          </button>
        </div>

      </div>
    </section>
  );
}
