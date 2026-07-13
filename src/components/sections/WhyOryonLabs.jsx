import { useLocation } from 'react-router-dom';
import { FaBolt, FaCircle } from 'react-icons/fa';
import useCurrency from '../../hooks/useCurrency';
import { AnimatedSection } from '../ui/AnimatedSection';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

// Wraps standalone percentage figures (e.g. "60%") in a highlighted span so
// the one stat that matters in the testimonial stands out from the quote
// around it, instead of reading as plain body text.
function highlightStat(text) {
  return text.split(/(\d+%)/g).map((part, i) =>
    /^\d+%$/.test(part)
      ? <span key={i} className="text-cyan font-bold text-lg">{part}</span>
      : part
  );
}

// Status pill for the OryonX column — plain text reads as marketing copy,
// a compact badge reads as a product/system state.
function StatusBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cyan-pale text-cyan-dark text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 leading-tight">
      {children}
    </span>
  );
}

export default function WhyOryonLabs() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const why = t.why;
  const table = why.table;
  const symbol = useCurrency().symbol;

  // "~80" → "~€80/mes" | "500–800" → "€500–800/mes"
  const fmt = (amount, period = '') => {
    const approx = amount.startsWith('~');
    const num = approx ? amount.slice(1) : amount;
    return `${approx ? '~' : ''}${symbol}${num}${period}`;
  };

  // Badge de ahorro: rango alto de la competencia (peor caso) menos el precio OryonX
  const [, painHigh] = table.total_today.split(/[–-]/).map((n) => parseInt(n.replace(/\D/g, ''), 10));
  const oryonPrice = parseInt(why.price, 10);
  const maxSavings = Math.floor(Math.max(painHigh - oryonPrice, 0) / 10) * 10;
  const savingsText = why.savings_badge.replace('{amount}', `${symbol}${maxSavings}`);

  // Shared column template for every row — the tool-name column needs more
  // room than the price/badge columns, especially on mobile where equal
  // thirds forced numbers to wrap mid-value. Reverts to even thirds at sm+
  // where there's enough width for it not to matter.
  const rowGrid = 'grid grid-cols-[36%_28%_36%] sm:grid-cols-3';

  return (
    <section className="relative bg-navy py-24 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header — sits directly on the navy page background */}
        <AnimatedSection className="text-center mb-14">
          <p className="inline-block text-cyan-light text-xs font-bold uppercase tracking-[0.25em] mb-5 border border-cyan/30 bg-cyan/5 rounded-full px-4 py-1.5">
            {why.eyebrow}
          </p>
          {/* Two-line H2: weight/color live on the line-level span, never on
              words inside a line, so future copy edits can't reintroduce
              mixed-weight text within a single line. */}
          <h2 className="text-4xl lg:text-5xl leading-tight max-w-2xl mx-auto mb-5">
            <span className="block font-normal text-white">{why.title}</span>
            <span className="block font-medium text-cyan">{why.title_highlight}</span>
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            {why.subtitle.replace('{currency}', symbol)}
          </p>
        </AnimatedSection>

        {/* Floating comparison panel — flat cream card, no gradients/glow,
            just a functional shadow to lift it off the navy background. */}
        <AnimatedSection delay={80} className="relative rounded-[2.5rem] bg-[#FAF9F6] shadow-2xl shadow-black/30 overflow-hidden">
          {/* Continuous light-blue tint behind the whole OryonX column —
              width matches the 3rd column of `rowGrid` at each breakpoint */}
          <div className="absolute inset-y-0 right-0 w-[36%] sm:w-1/3 bg-cyan-pale/50" aria-hidden="true" />

          <div className="relative">
            {/* App window chrome — same traffic-light treatment as the
                hero's "OryonX — Panel de automatizaciones" mockup, so this
                reads as a screen of the actual product, not landing content. */}
            <div className="flex items-center gap-1.5 px-4 sm:px-6 py-3 bg-black/[0.035] border-b border-black/5">
              <FaCircle className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
              <FaCircle className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />
              <FaCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
              <span className="ml-1.5 text-gray-500 text-xs sm:text-sm truncate">{table.window_title}</span>
            </div>

            {/* Header row */}
            <div className={`${rowGrid} border-b border-black/5`}>
              <div className="px-2.5 sm:px-8 py-4 sm:py-5">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-400">{table.col_tool}</p>
              </div>
              <div className="px-2 sm:px-6 py-4 sm:py-5 text-right">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-400">{table.col_today}</p>
                <p className="hidden sm:block text-[11px] text-gray-400 mt-0.5">{table.col_today_sub}</p>
              </div>
              <div className="px-2 sm:px-6 py-4 sm:py-5">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-cyan-dark">{table.col_oryonx}</p>
                <p className="hidden sm:block text-[11px] text-cyan-dark/70 mt-0.5">{table.col_oryonx_sub}</p>
              </div>
            </div>

            {/* Tool rows */}
            {table.rows.map((row, i) => (
              <div key={i} className={`${rowGrid} border-b border-black/5 sm:hover:bg-black/[0.025] transition-colors duration-150`}>
                <div className="px-2.5 sm:px-8 py-3.5 flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-navy">{row.tool}</span>
                </div>
                <div className="px-2 sm:px-6 py-3.5 flex items-center justify-end">
                  <span className="text-xs sm:text-sm font-semibold text-gray-600 tabular-nums text-right whitespace-nowrap">{fmt(row.price, table.per_month)}</span>
                </div>
                <div className="px-2 sm:px-6 py-3.5 flex items-center">
                  {/* Status badge — no icon inside. The column tint already
                      carries the visual weight; a repeated check 6 times
                      over would just be redundant noise. */}
                  <StatusBadge>{table.included_label}</StatusBadge>
                </div>
              </div>
            ))}

            {/* Administrative management row — concrete figures, not vague
                "time saved" language. */}
            <div className={`${rowGrid} border-b border-black/5 sm:hover:bg-black/[0.025] transition-colors duration-150`}>
              <div className="px-2.5 sm:px-8 py-3.5 flex items-center">
                <span className="text-xs sm:text-sm font-medium text-navy">{table.admin_row.tool}</span>
              </div>
              <div className="px-2 sm:px-6 py-3.5 flex items-center justify-end">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 tabular-nums text-right whitespace-nowrap">{table.admin_row.today_value}</span>
              </div>
              <div className="px-2 sm:px-6 py-3.5 flex items-center">
                <StatusBadge>{table.admin_row.oryonx_value}</StatusBadge>
              </div>
            </div>

            {/* Total row */}
            <div className={`${rowGrid} bg-black/[0.03]`}>
              <div className="px-2.5 sm:px-8 py-5 sm:py-6 flex items-center">
                <span className="text-xs sm:text-sm font-bold text-navy">{table.total_label}</span>
              </div>
              <div className="px-2 sm:px-6 py-5 sm:py-6 flex flex-col justify-center items-end text-right">
                <span className="text-sm sm:text-base font-bold text-gray-700 tabular-nums whitespace-nowrap">{fmt(table.total_today, table.per_month)}</span>
                <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{table.total_estimated_label}</span>
              </div>
              <div className="px-2 sm:px-6 py-5 sm:py-6 flex flex-col justify-center items-end text-right gap-1">
                <span className="text-lg sm:text-2xl font-extrabold text-cyan-dark leading-none tabular-nums whitespace-nowrap">
                  {fmt(why.price, table.per_month)}
                </span>
                {/* Key persuasion element — must read clearly, not fade into
                    the background like a footnote. */}
                <span className="text-xs sm:text-base font-bold text-gray-600 tabular-nums whitespace-nowrap line-through decoration-gray-400">
                  {table.total_before_prefix} {fmt(table.total_today, table.per_month)}
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Below the panel, back on navy: savings badge + testimonial */}
        <AnimatedSection delay={140} className="flex justify-center mt-10">
          <div className="inline-flex items-center gap-2 bg-cyan text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-cyan/30">
            <FaBolt className="w-3.5 h-3.5 flex-shrink-0" />
            {savingsText}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={180} className="mt-8 bg-navy-light rounded-xl border border-cyan/20 p-7 max-w-2xl mx-auto shadow-xl shadow-navy/10">
          <p className="text-cyan text-3xl leading-none font-serif mb-2">&quot;</p>
          <p className="text-gray-100 text-base leading-relaxed mb-3">{highlightStat(why.testimonial.text)}</p>
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
