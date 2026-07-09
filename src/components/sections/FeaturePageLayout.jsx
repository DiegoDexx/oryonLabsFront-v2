import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useInView } from '../../hooks/useInView';

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
const AsistenteIll = () => (
  <svg viewBox="0 0 260 360" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="a-body" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#1E3A70" />
        <stop offset="100%" stopColor="#0B1D45" />
      </linearGradient>
      <linearGradient id="a-bubble" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0090C9" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
      </linearGradient>
      <filter id="a-glow">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Phone body */}
    <rect x="28" y="6" width="204" height="348" rx="32" fill="url(#a-body)" stroke="white" strokeOpacity="0.08" strokeWidth="1.5" />
    {/* Screen */}
    <rect x="36" y="22" width="188" height="316" rx="24" fill="#060F27" />
    {/* Dynamic island / notch */}
    <rect x="108" y="25" width="44" height="10" rx="5" fill="#0A1530" />
    {/* App bar */}
    <rect x="36" y="38" width="188" height="50" fill="#0090C9" fillOpacity="0.1" />
    <circle cx="60" cy="63" r="15" fill="#0090C9" fillOpacity="0.35" />
    <circle cx="60" cy="59" r="5.5" fill="#0090C9" fillOpacity="0.7" />
    <path d="M47 72 Q60 65 73 72" fill="#0090C9" fillOpacity="0.3" />
    <rect x="84" y="57" width="72" height="7" rx="3.5" fill="white" fillOpacity="0.6" />
    <rect x="84" y="68" width="48" height="5" rx="2.5" fill="white" fillOpacity="0.22" />
    {/* Online dot */}
    <circle cx="71" cy="47" r="5.5" fill="#22C55E" />
    <circle cx="71" cy="47" r="3" fill="#4ADE80" />
    {/* Separator */}
    <line x1="36" y1="88" x2="224" y2="88" stroke="white" strokeOpacity="0.05" />
    {/* Bot bubble 1 */}
    <rect x="42" y="96" width="128" height="34" rx="17" fill="url(#a-bubble)" />
    <rect x="52" y="105" width="96" height="6" rx="3" fill="white" fillOpacity="0.75" />
    <rect x="52" y="116" width="66" height="6" rx="3" fill="white" fillOpacity="0.45" />
    {/* User bubble 1 */}
    <rect x="118" y="140" width="100" height="26" rx="13" fill="white" fillOpacity="0.09" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="130" y="149" width="68" height="6" rx="3" fill="white" fillOpacity="0.4" />
    {/* Bot bubble 2 */}
    <rect x="42" y="176" width="148" height="50" rx="17" fill="url(#a-bubble)" fillOpacity="0.8" />
    <rect x="52" y="185" width="118" height="6" rx="3" fill="white" fillOpacity="0.75" />
    <rect x="52" y="196" width="100" height="6" rx="3" fill="white" fillOpacity="0.55" />
    <rect x="52" y="207" width="72" height="6" rx="3" fill="white" fillOpacity="0.3" />
    {/* User bubble 2 */}
    <rect x="120" y="236" width="98" height="26" rx="13" fill="white" fillOpacity="0.09" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="132" y="245" width="60" height="6" rx="3" fill="white" fillOpacity="0.4" />
    {/* Typing indicator */}
    <rect x="42" y="272" width="64" height="28" rx="14" fill="#0090C9" fillOpacity="0.28" />
    <circle cx="56" cy="286" r="3.5" fill="white" fillOpacity="0.65" />
    <circle cx="68" cy="286" r="3.5" fill="white" fillOpacity="0.42" />
    <circle cx="80" cy="286" r="3.5" fill="white" fillOpacity="0.22" />
    {/* Input bar */}
    <rect x="42" y="312" width="140" height="32" rx="16" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="54" y="324" width="72" height="6" rx="3" fill="white" fillOpacity="0.1" />
    <circle cx="210" cy="328" r="12" fill="#0090C9" fillOpacity="0.85" filter="url(#a-glow)" />
    <path d="M205 328 L213 325 L213 331 Z" fill="white" />
    {/* Home indicator */}
    <rect x="100" y="352" width="60" height="4" rx="2" fill="white" fillOpacity="0.12" />
    {/* Notification badge */}
    <circle cx="222" cy="32" r="14" fill="#F97316" filter="url(#a-glow)" />
    <text x="222" y="37" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">3</text>
    {/* WhatsApp badge */}
    <circle cx="183" cy="63" r="10" fill="#25D366" />
    <path d="M183 58 C179 58 176 61 176 64.5 C176 65.8 176.4 67 177.2 68 L176 70.5 L178.8 69.5 C179.8 70 180.9 70.3 182.1 70.3 C186 70.3 189 67.3 189 63.8 C189 60.3 186.3 58 183 58Z" fill="white" fillOpacity="0.85" />
  </svg>
);

const CRMIll = () => (
  <svg viewBox="0 0 320 240" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="crm-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0F1F4A" />
        <stop offset="100%" stopColor="#080F28" />
      </linearGradient>
      <linearGradient id="crm-bar1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0090C9" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="crm-bar2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    {/* Panel */}
    <rect width="320" height="240" rx="16" fill="url(#crm-bg)" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    {/* Header */}
    <rect x="0" y="0" width="320" height="44" rx="16" fill="white" fillOpacity="0.04" />
    <rect x="0" y="32" width="320" height="12" fill="white" fillOpacity="0.04" />
    <rect x="14" y="14" width="90" height="8" rx="4" fill="#0090C9" fillOpacity="0.55" />
    <rect x="14" y="26" width="55" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
    <circle cx="292" cy="22" r="10" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
    <circle cx="292" cy="22" r="4" fill="#0090C9" fillOpacity="0.7" />
    <circle cx="270" cy="22" r="10" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
    <rect x="264" y="18" width="12" height="2" rx="1" fill="white" fillOpacity="0.5" />
    <rect x="264" y="22" width="12" height="2" rx="1" fill="white" fillOpacity="0.35" />
    <rect x="264" y="26" width="8" height="2" rx="1" fill="white" fillOpacity="0.2" />
    {/* KPI cards */}
    <rect x="12" y="52" width="88" height="56" rx="10" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="22" y="61" width="44" height="5" rx="2.5" fill="white" fillOpacity="0.2" />
    <rect x="22" y="74" width="36" height="12" rx="4" fill="url(#crm-bar1)" fillOpacity="0.9" />
    <rect x="22" y="91" width="55" height="5" rx="2.5" fill="#22C55E" fillOpacity="0.6" />

    <rect x="114" y="52" width="88" height="56" rx="10" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="124" y="61" width="50" height="5" rx="2.5" fill="white" fillOpacity="0.2" />
    <rect x="124" y="74" width="42" height="12" rx="4" fill="url(#crm-bar2)" fillOpacity="0.9" />
    <rect x="124" y="91" width="40" height="5" rx="2.5" fill="#22C55E" fillOpacity="0.6" />

    <rect x="216" y="52" width="92" height="56" rx="10" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
    <rect x="226" y="61" width="55" height="5" rx="2.5" fill="white" fillOpacity="0.2" />
    <rect x="226" y="74" width="30" height="12" rx="4" fill="#F97316" fillOpacity="0.8" />
    <rect x="226" y="91" width="48" height="5" rx="2.5" fill="#F97316" fillOpacity="0.45" />

    {/* Pipeline columns */}
    <rect x="12" y="118" width="88" height="10" rx="5" fill="#0090C9" fillOpacity="0.15" />
    <rect x="18" y="121" width="44" height="4" rx="2" fill="#0090C9" fillOpacity="0.5" />
    <rect x="12" y="134" width="88" height="16" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="20" y="139" width="56" height="6" rx="3" fill="white" fillOpacity="0.3" />
    <rect x="12" y="156" width="88" height="16" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="20" y="161" width="40" height="6" rx="3" fill="white" fillOpacity="0.2" />
    <rect x="12" y="178" width="88" height="16" rx="8" fill="#0090C9" fillOpacity="0.15" stroke="#0090C9" strokeOpacity="0.2" strokeWidth="1" />
    <rect x="20" y="183" width="48" height="6" rx="3" fill="#0090C9" fillOpacity="0.5" />

    <rect x="114" y="118" width="88" height="10" rx="5" fill="#F97316" fillOpacity="0.15" />
    <rect x="120" y="121" width="44" height="4" rx="2" fill="#F97316" fillOpacity="0.5" />
    <rect x="114" y="134" width="88" height="16" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="122" y="139" width="62" height="6" rx="3" fill="white" fillOpacity="0.3" />
    <rect x="114" y="156" width="88" height="16" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="122" y="161" width="50" height="6" rx="3" fill="white" fillOpacity="0.2" />

    <rect x="216" y="118" width="92" height="10" rx="5" fill="#22C55E" fillOpacity="0.15" />
    <rect x="222" y="121" width="44" height="4" rx="2" fill="#22C55E" fillOpacity="0.5" />
    <rect x="216" y="134" width="92" height="16" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
    <rect x="224" y="139" width="68" height="6" rx="3" fill="white" fillOpacity="0.3" />
    <rect x="216" y="156" width="92" height="16" rx="8" fill="#22C55E" fillOpacity="0.15" stroke="#22C55E" strokeOpacity="0.2" strokeWidth="1" />
    <rect x="224" y="161" width="45" height="6" rx="3" fill="#22C55E" fillOpacity="0.5" />

    {/* Score badge */}
    <rect x="22" y="202" width="66" height="26" rx="8" fill="#0090C9" fillOpacity="0.2" stroke="#0090C9" strokeOpacity="0.3" strokeWidth="1" />
    <rect x="30" y="210" width="20" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    <rect x="55" y="210" width="24" height="5" rx="2.5" fill="#0090C9" fillOpacity="0.8" />
    <rect x="30" y="219" width="50" height="3" rx="1.5" fill="white" fillOpacity="0.1" />
    <rect x="30" y="219" width="38" height="3" rx="1.5" fill="#0090C9" fillOpacity="0.5" />
  </svg>
);

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

const IntegrationsIll = () => (
  <svg viewBox="0 0 320 240" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="int-center" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0090C9" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0090C9" stopOpacity="0" />
      </radialGradient>
      <filter id="int-glow">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Ambient glow */}
    <circle cx="160" cy="120" r="80" fill="url(#int-center)" />
    {/* Connection lines */}
    <line x1="160" y1="120" x2="55" y2="42" stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />
    <line x1="160" y1="120" x2="280" y2="42" stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />
    <line x1="160" y1="120" x2="28" y2="148" stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />
    <line x1="160" y1="120" x2="292" y2="148" stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />
    <line x1="160" y1="120" x2="160" y2="215" stroke="#0090C9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />
    {/* Data packets on lines */}
    <circle cx="107" cy="81" r="4" fill="#0090C9" fillOpacity="0.7" />
    <circle cx="220" cy="81" r="4" fill="#0090C9" fillOpacity="0.5" />
    <circle cx="94" cy="134" r="4" fill="#0090C9" fillOpacity="0.6" />
    <circle cx="226" cy="134" r="4" fill="#0090C9" fillOpacity="0.4" />
    <circle cx="160" cy="167" r="4" fill="#0090C9" fillOpacity="0.55" />
    {/* Center hub */}
    <circle cx="160" cy="120" r="30" fill="#0090C9" fillOpacity="0.15" stroke="#0090C9" strokeOpacity="0.4" strokeWidth="2" filter="url(#int-glow)" />
    <circle cx="160" cy="120" r="18" fill="#0090C9" fillOpacity="0.5" />
    <circle cx="160" cy="120" r="10" fill="#0090C9" fillOpacity="0.9" />
    <rect x="153" y="116" width="14" height="8" rx="2" fill="white" fillOpacity="0.9" />
    <path d="M156 120 H164 M160 116 V124" stroke="#0090C9" strokeWidth="1.5" strokeLinecap="round" />
    {/* Satellite nodes */}
    {/* WhatsApp */}
    <circle cx="55" cy="42" r="22" fill="#0F1F4A" stroke="#25D366" strokeOpacity="0.5" strokeWidth="1.5" />
    <circle cx="55" cy="42" r="12" fill="#25D366" fillOpacity="0.2" />
    <rect x="47" y="36" width="16" height="12" rx="4" fill="#25D366" fillOpacity="0.7" />
    <rect x="50" y="53" width="22" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    {/* Email */}
    <circle cx="280" cy="42" r="22" fill="#0F1F4A" stroke="#F97316" strokeOpacity="0.5" strokeWidth="1.5" />
    <rect x="268" y="34" width="24" height="16" rx="4" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeOpacity="0.4" strokeWidth="1" />
    <path d="M268 34 L280 44 L292 34" stroke="#F97316" strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
    <rect x="262" y="53" width="36" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    {/* CRM */}
    <circle cx="28" cy="148" r="22" fill="#0F1F4A" stroke="#0090C9" strokeOpacity="0.5" strokeWidth="1.5" />
    <rect x="17" y="140" width="22" height="16" rx="4" fill="#0090C9" fillOpacity="0.25" />
    <rect x="20" y="143" width="7" height="10" rx="2" fill="#0090C9" fillOpacity="0.6" />
    <rect x="29" y="146" width="7" height="7" rx="2" fill="#0090C9" fillOpacity="0.4" />
    <rect x="5" y="163" width="46" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    {/* Calendar */}
    <circle cx="292" cy="148" r="22" fill="#0F1F4A" stroke="#A855F7" strokeOpacity="0.5" strokeWidth="1.5" />
    <rect x="280" y="138" width="24" height="20" rx="4" fill="#A855F7" fillOpacity="0.2" stroke="#A855F7" strokeOpacity="0.3" strokeWidth="1" />
    <line x1="280" y1="143" x2="304" y2="143" stroke="#A855F7" strokeOpacity="0.5" strokeWidth="1" />
    <circle cx="287" cy="150" r="2" fill="#A855F7" fillOpacity="0.6" />
    <circle cx="293" cy="150" r="2" fill="#A855F7" fillOpacity="0.6" />
    <circle cx="299" cy="150" r="2" fill="#A855F7" fillOpacity="0.4" />
    <rect x="269" y="163" width="46" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    {/* Invoice */}
    <circle cx="160" cy="215" r="22" fill="#0F1F4A" stroke="#22C55E" strokeOpacity="0.5" strokeWidth="1.5" />
    <rect x="149" y="205" width="22" height="20" rx="3" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeOpacity="0.3" strokeWidth="1" />
    <rect x="153" y="209" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
    <rect x="153" y="214" width="10" height="3" rx="1.5" fill="white" fillOpacity="0.35" />
    <rect x="153" y="219" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.25" />
  </svg>
);

const CustomAIIll = () => (
  <svg viewBox="0 0 320 240" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="ai-glow1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ai-glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0090C9" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0090C9" stopOpacity="0" />
      </radialGradient>
      <filter id="ai-node-glow">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Ambient glows */}
    <circle cx="252" cy="80" r="50" fill="url(#ai-glow1)" />
    <circle cx="90" cy="140" r="50" fill="url(#ai-glow2)" />
    {/* Layer labels */}
    <rect x="20" y="12" width="42" height="14" rx="7" fill="white" fillOpacity="0.06" />
    <rect x="126" y="12" width="42" height="14" rx="7" fill="white" fillOpacity="0.06" />
    <rect x="232" y="12" width="42" height="14" rx="7" fill="white" fillOpacity="0.06" />
    <rect x="26" y="15" width="30" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    <rect x="132" y="15" width="30" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    <rect x="238" y="15" width="30" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
    {/* Layer 1 nodes (input) */}
    {[44, 84, 124, 164, 204].map((y, i) => (
      <g key={`l1-${i}`}>
        <circle cx="40" cy={y} r="11" fill="#0090C9" fillOpacity="0.2" stroke="#0090C9" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="40" cy={y} r="5" fill="#0090C9" fillOpacity="0.6" />
      </g>
    ))}
    {/* Layer 2 nodes (hidden) */}
    {[54, 94, 134, 174].map((y, i) => (
      <g key={`l2-${i}`}>
        <circle cx="147" cy={y} r="14" fill="#0090C9" fillOpacity="0.22" stroke="#0090C9" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="147" cy={y} r="7" fill="#0090C9" fillOpacity="0.7" />
      </g>
    ))}
    {/* Layer 3 nodes (output - highlighted) */}
    {[80, 148].map((y, i) => (
      <g key={`l3-${i}`}>
        <circle cx="260" cy={y} r="22" fill="#F97316" fillOpacity="0.1" stroke="#F97316" strokeOpacity="0.4" strokeWidth="2" filter="url(#ai-node-glow)" />
        <circle cx="260" cy={y} r="12" fill="#F97316" fillOpacity="0.5" />
        <circle cx="260" cy={y} r="6" fill="#F97316" fillOpacity="0.9" />
      </g>
    ))}
    {/* Connections L1→L2 */}
    {[44, 84, 124, 164, 204].map((y1) =>
      [54, 94, 134, 174].map((y2, j) => (
        <line key={`c1-${y1}-${j}`} x1="51" y1={y1} x2="133" y2={y2} stroke="#0090C9" strokeOpacity="0.09" strokeWidth="1" />
      ))
    )}
    {/* Connections L2→L3 */}
    {[54, 94, 134, 174].map((y1, i) =>
      [80, 148].map((y2, j) => (
        <line key={`c2-${i}-${j}`} x1="161" y1={y1} x2="238" y2={y2} stroke="#0090C9" strokeOpacity="0.15" strokeWidth="1" />
      ))
    )}
    {/* Active path highlight */}
    <line x1="51" y1="124" x2="133" y2="94" stroke="#0090C9" strokeOpacity="0.6" strokeWidth="1.5" />
    <line x1="161" y1="94" x2="238" y2="80" stroke="#F97316" strokeOpacity="0.5" strokeWidth="1.5" />
    {/* Output label */}
    <rect x="230" y="108" width="60" height="20" rx="10" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeOpacity="0.3" strokeWidth="1" />
    <rect x="238" y="114" width="44" height="6" rx="3" fill="#F97316" fillOpacity="0.5" />
  </svg>
);

function HeroIllustration({ slug }) {
  const map = {
    'asistente-24-7': <AsistenteIll />,
    crm: <CRMIll />,
    'desarrollo-web': <WebIll />,
    integraciones: <IntegrationsIll />,
    'custom-ai': <CustomAIIll />,
  };
  return map[slug] || <AsistenteIll />;
}

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
              className="inline-flex items-center gap-2 text-cyan/60 text-sm mb-10 hover:text-cyan transition-colors"
              style={heroStyle(0, 10)}
            >
              ← {fp.back_to_pricing}
            </Link>
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
              <HeroIllustration slug={pageData.slug} />
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
      <HowItWorksSection steps={pageData.how_it_works} label={fp.how_it_works_label} />

      {/* ── Qué incluye + Para quién ──────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn className="flex flex-col">
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8 self-start">
              {fp.what_includes_label}
            </span>
            <ul className="space-y-3.5">
              {pageData.what_includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaCheck className="w-2.5 h-2.5 text-cyan" />
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={150} className="flex flex-col">
            <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-8 self-start">
              {fp.for_who_label}
            </span>
            <div className="space-y-4">
              {pageData.for_who.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-cyan/25 transition-colors group">
                  <p className="font-bold text-navy text-sm mb-1">{item.sector}</p>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-cyan-dark text-xs font-bold bg-cyan-pale px-3 py-1 rounded-full">
                    <FaCheck className="w-2.5 h-2.5" />
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stat block with animated counter ─────────────── */}
      <StatBlock stat={pageData.stat} label={fp.stat_label} />

      {/* ── Mini FAQ ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
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
      <section className="py-20 px-4 bg-navy text-white text-center relative overflow-hidden">
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
