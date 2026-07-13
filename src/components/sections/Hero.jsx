import { useState, useEffect } from 'react';
import { FaCircle, FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

// Counts from 0 → target with ease-out cubic, holds, then loops
function useLoopCounter(target, durationMs = 3400, holdMs = 1100, delayMs = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animFrame;
    let startTime = null;
    let holdStart = null;
    let delayStart = null;
    let phase = delayMs > 0 ? 'delay' : 'up';

    function step(ts) {
      if (phase === 'delay') {
        if (!delayStart) delayStart = ts;
        if (ts - delayStart >= delayMs) { phase = 'up'; startTime = null; }
        animFrame = requestAnimationFrame(step);
        return;
      }
      if (phase === 'up') {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(eased * target);
        if (progress >= 1) { phase = 'hold'; holdStart = ts; }
        animFrame = requestAnimationFrame(step);
        return;
      }
      if (phase === 'hold') {
        if (ts - holdStart >= holdMs) { setValue(0); phase = 'up'; startTime = null; }
        animFrame = requestAnimationFrame(step);
      }
    }

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, durationMs, holdMs, delayMs]);

  return value;
}

export default function Hero() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const hero = t.hero;

  const [showScrollHint, setShowScrollHint] = useState(true);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 80) setShowScrollHint(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animated counters — staggered starts
  const leadsVal    = useLoopCounter(2.4,  3400, 1100,    0);
  const responseVal = useLoopCounter(18,   3400, 1100,  700);
  const savingsVal  = useLoopCounter(8.2,  3400, 1100, 1400);

  return (
    <section className="relative bg-navy min-h-screen pt-20 overflow-hidden">
      {/* ── Background: dot grid + floating orbs ── */}
      <style>{`
        @keyframes orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(18px, -24px) scale(1.05); }
          66%       { transform: translate(-10px, 12px) scale(0.96); }
        }
        @keyframes orb-drift-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-14px, 20px) scale(1.04); }
          66%       { transform: translate(10px, -14px) scale(0.97); }
        }
      `}</style>

      {/* Base: dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Orb 1: cyan — top right */}
      <div
        className="absolute -top-40 -right-24 w-[520px] h-[520px] rounded-full bg-cyan/[0.13] blur-[100px] pointer-events-none"
        style={{ animation: 'orb-drift 9s ease-in-out infinite' }}
      />

      {/* Orb 2: purple — bottom left */}
      <div
        className="absolute -bottom-48 -left-24 w-[420px] h-[420px] rounded-full bg-purple-500/[0.11] blur-[90px] pointer-events-none"
        style={{ animation: 'orb-drift-reverse 12s ease-in-out infinite' }}
      />

      {/* Edge fade: softens grid borders so the navy bleeds in naturally */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 md:py-12 lg:py-14 xl:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 lg:gap-10 xl:gap-12 items-center">

          {/* ── Left Content ── */}
          {/* FIX #7: reduced vertical spacing on mobile (space-y-6 vs space-y-8) */}
          <div className="space-y-6 md:space-y-7 lg:space-y-8 animate-fade-in-up" style={{ animationDuration: '0.7s', animationDelay: '0s', animationFillMode: 'both' }}>

            {/* Badge */}
            {/* FIX #1: rounded-2xl on mobile so it doesn't look broken when text wraps */}
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 py-2 border border-white/10 animate-fade-in"
              style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
            >
              <span className="w-2 h-2 bg-cyan rounded-full animate-pulse flex-shrink-0" />
              <span className="text-cyan-light text-sm font-medium leading-snug">
                {hero.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl 2xl:text-6xl font-black text-white leading-tight">
                {(() => {
                  const title = hero.title;
                  const hl = hero.title_highlight;
                  const idx = title.indexOf(hl);
                  if (idx === -1) return title;
                  return (
                    <>
                      {title.slice(0, idx)}
                      <span className="text-cyan-light">{hl}</span>
                      {title.slice(idx + hl.length)}
                    </>
                  );
                })()}
              </h1>

              {/* Subtitle: short on mobile, full on sm+ — both in DOM for SEO */}
              <p className="text-gray-300 text-base sm:text-lg lg:text-base 2xl:text-lg leading-relaxed max-w-xl">
                <span className="sm:hidden">{hero.subtitle_short}</span>
                <span className="hidden sm:inline">{hero.subtitle}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            {/* FIX #6: full-width on mobile for better tap targets */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={`/${lang}#${lang === 'en' ? 'pricing' : 'precios'}`}
                className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg shadow-cyan/25"
              >
                {hero.cta_primary}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-center border border-white/15"
              >
                {hero.cta_secondary}
              </button>
            </div>

            {/* Trust Indicators */}
            {/* FIX #8: smaller gap on mobile (gap-x-5 gap-y-2) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:gap-5 lg:gap-6 pt-2">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
                <span>{hero.trust_indicator_1}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
                <span>{hero.trust_indicator_2}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCheck className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
                <span>{hero.trust_indicator_3}</span>
              </div>
            </div>
          </div>

          {/* ── Right Content — Dashboard Panel ── */}
          {/* FIX #4: pb-10 on mobile so the absolute floating badge doesn't overlap content below */}
          <div className="relative animate-fade-in-up pb-10 md:pb-0" style={{ animationDuration: '0.8s', animationDelay: '0.1s', animationFillMode: 'both' }}>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />

            {/* Panel */}
            {/* FIX #4 (panel): extra bottom padding so metrics aren't hidden behind floating badge */}
            <div className="relative bg-navy-light/80 backdrop-blur rounded-2xl border border-white/10 p-4 sm:p-5 md:p-4 lg:p-5 xl:p-6 shadow-2xl pb-6">

              {/* Panel Header */}
              {/* FIX #2 + #3: min-w-0 + truncate on title; whitespace-nowrap + flex-shrink-0 on badge */}
              <div className="flex items-center justify-between mb-5 gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FaCircle className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
                  <FaCircle className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />
                  <FaCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                  <span className="ml-1.5 text-gray-400 text-xs sm:text-sm truncate">{hero.panel_title}</span>
                </div>
                <div className="bg-cyan/20 text-cyan-light text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  {hero.panel_badge}
                </div>
              </div>

              {/* Automation Items */}
              {/* FIX #5: text-xs on mobile for item labels */}
              <div className="space-y-2.5 mb-5">
                {hero.automation_items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 sm:px-4 py-2.5 border border-white/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="text-gray-200 text-xs sm:text-sm truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-green-400 text-xs">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metrics — animated counters */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                    {leadsVal.toFixed(1)}k
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{hero.metrics.leads.label}</p>
                  <p className="text-[10px] sm:text-xs text-green-400">{hero.metrics.leads.sublabel}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                    {Math.round(responseVal)}{hero.metrics.response.unit}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{hero.metrics.response.label}</p>
                  <p className="text-[10px] sm:text-xs text-green-400">{hero.metrics.response.sublabel}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                    {hero.metrics.savings.currency}{savingsVal.toFixed(1)}{hero.metrics.savings.unit}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{hero.metrics.savings.label}</p>
                  <p className="text-[10px] sm:text-xs text-green-400">{hero.metrics.savings.sublabel}</p>
                </div>
              </div>

              {/* Time Saved Badge — floating */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-navy-light border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight">{hero.time_saved.title}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs">{hero.time_saved.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar — separated from the CTA block above by both a
            border-t divider and generous top padding, so it doesn't read
            as part of the same action group (Ley de Proximidad). */}
        {/* TODO(business): t.trust_bar.logos (src/locales/home/*.json) are
            generic sector-style placeholder names ("INMOBILIARIA VIVA",
            "CLÍNICA BEAUTYMED"...), not confirmed real client names/logos.
            Confirm real client names/logos before shipping this as social
            proof, or relabel the section so it doesn't imply named clients. */}
        <div className="mt-14 md:mt-16 lg:mt-16 xl:mt-20 pt-10 md:pt-12 lg:pt-12 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm mb-8">
            {t.trust_bar.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {t.trust_bar.logos.map((logo, index) => (
              <span
                key={index}
                className="text-gray-500 font-semibold text-xs sm:text-sm tracking-wider hover:text-gray-300 transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {showScrollHint && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none">
          <svg
            className="w-6 h-6 animate-bounce"
            style={{ color: 'rgba(56,189,248,0.6)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </section>
  );
}
