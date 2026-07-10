import { FaRobot, FaPaperPlane, FaRegClock, FaChartLine } from 'react-icons/fa';
import MockupFrame from '../ui/MockupFrame';
import logoBlueOx from '../../assets/img/logo_blue_ox.webp';

/* ── Hero 1 · Chatbot multicanal ──────────────────────────────
   Móvil con conversación real (Ridley — Reformas García),
   badge "Nuevo lead" pulsante y micro-badge de velocidad flotante. */
export function ChatbotHeroVisual({ lang }) {
  const t = lang === 'en'
    ? {
        contact: 'Reformas García',
        online: 'Online',
        badge: 'New lead',
        placeholder: 'Type a message…',
        response: 'Response in 8 seconds',
        msgs: [
          { from: 'user', text: 'Hi, I need a quote to renovate my bathroom' },
          { from: 'bot', text: 'Sure! When would you like to start the work?' },
          { from: 'user', text: 'As soon as possible' },
          { from: 'bot', text: "Perfect, I'm connecting you with our team right now" },
        ],
      }
    : {
        contact: 'Reformas García',
        online: 'En línea',
        badge: 'Nuevo lead',
        placeholder: 'Escribe un mensaje…',
        response: 'Respuesta en 8 segundos',
        msgs: [
          { from: 'user', text: 'Hola, necesito presupuesto para reformar mi baño' },
          { from: 'bot', text: '¡Claro! ¿Cuándo te gustaría empezar la obra?' },
          { from: 'user', text: 'Lo antes posible' },
          { from: 'bot', text: 'Perfecto, te paso con nuestro equipo ahora mismo' },
        ],
      };

  return (
    <div className="relative w-64 mx-auto">
      <span className="absolute -top-3 -right-3 z-20 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/30 animate-pulse-slow whitespace-nowrap">
        {t.badge}
      </span>

      <MockupFrame rounded="rounded-[2.25rem]" className="p-2.5">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black/40 rounded-full z-10" />

        <div className="rounded-[1.65rem] overflow-hidden bg-navy">
          {/* header */}
          <div className="flex items-center gap-2.5 px-3.5 pt-5 pb-3 bg-cyan/10 border-b border-white/5">
            <div className="relative w-8 h-8 rounded-full bg-cyan/25 flex items-center justify-center flex-shrink-0">
              <FaRobot className="w-4 h-4 text-cyan-light" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">Ridley — {t.contact}</p>
              <p className="text-green-400 text-[9px] leading-tight">{t.online}</p>
            </div>
          </div>

          {/* messages */}
          <div className="px-3 py-3 space-y-2 min-h-[212px]">
            {t.msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[80%] text-[10px] leading-snug px-2.5 py-1.5 rounded-xl ${
                    m.from === 'user'
                      ? 'bg-white/10 text-white/80 rounded-br-sm'
                      : 'bg-cyan text-white rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 px-3 pb-3.5">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <span className="text-white/25 text-[9px]">{t.placeholder}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-cyan flex items-center justify-center flex-shrink-0">
              <FaPaperPlane className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <div className="w-16 h-1 rounded-full bg-white/15" />
          </div>
        </div>
      </MockupFrame>

      {/* floating speed badge */}
      <div className="absolute -bottom-4 left-2 flex items-center gap-2 bg-white/95 backdrop-blur px-3.5 py-2 rounded-xl shadow-xl">
        <FaRegClock className="w-3.5 h-3.5 text-cyan-dark flex-shrink-0" />
        <span className="text-navy text-[11px] font-semibold whitespace-nowrap">{t.response}</span>
      </div>
    </div>
  );
}

/* ── Hero 2 · Integraciones ──────────────────────────────────
   Hub-and-spoke con logo real de OryonX en el centro, etiquetas
   por nodo y líneas con flujo de datos animado. */
export function IntegrationsHeroVisual({ lang }) {
  const labels = lang === 'en'
    ? { whatsapp: 'WhatsApp', email: 'Email', calendar: 'Calendar', billing: 'Billing', crm: 'CRM' }
    : { whatsapp: 'WhatsApp', email: 'Email', calendar: 'Calendario', billing: 'Facturación', crm: 'CRM' };

  const hub = { x: 160, y: 128 };
  const nodes = [
    { key: 'whatsapp', label: labels.whatsapp, x: 54, y: 40, color: '#25D366' },
    { key: 'email', label: labels.email, x: 280, y: 40, color: '#F97316' },
    { key: 'crm', label: labels.crm, x: 26, y: 156, color: '#0090C9' },
    { key: 'calendar', label: labels.calendar, x: 294, y: 156, color: '#0090C9' },
    { key: 'billing', label: labels.billing, x: 160, y: 224, color: '#22C55E' },
  ];

  return (
    <MockupFrame className="w-full max-w-sm p-6">
      <svg viewBox="0 0 320 282" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="int-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0090C9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0090C9" stopOpacity="0" />
          </radialGradient>
          <filter id="int-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <circle cx={hub.x} cy={hub.y} r="78" fill="url(#int-center)" />

        {/* connection lines with flowing dash animation */}
        {nodes.map((n) => (
          <line
            key={`line-${n.key}`}
            x1={hub.x}
            y1={hub.y}
            x2={n.x}
            y2={n.y}
            stroke="#0090C9"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            className="animate-dash-flow"
          />
        ))}

        {/* traveling data packets */}
        {nodes.map((n) => (
          <circle key={`packet-${n.key}`} r="3" fill={n.color} fillOpacity="0.85">
            <animateMotion
              path={`M${hub.x},${hub.y} L${n.x},${n.y}`}
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* central hub — real OryonX logo */}
        <circle cx={hub.x} cy={hub.y} r="30" fill="#0090C9" fillOpacity="0.15" stroke="#0090C9" strokeOpacity="0.4" strokeWidth="2" filter="url(#int-glow)" />
        <circle cx={hub.x} cy={hub.y} r="22" fill="#0B1A3E" />
        <image href={logoBlueOx} x={hub.x - 15} y={hub.y - 15} width="30" height="30" />

        {/* satellite nodes */}
        {nodes.map((n) => (
          <g key={n.key}>
            <circle cx={n.x} cy={n.y} r="20" fill="#0F1F4A" stroke={n.color} strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="9" fill={n.color} fillOpacity="0.55" />
            <text
              x={n.x}
              y={n.y + 34}
              textAnchor="middle"
              fill="white"
              fillOpacity="0.65"
              fontSize="10"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </MockupFrame>
  );
}

/* ── Hero 3 · IA personalizada ────────────────────────────────
   Comparación directa: plantilla genérica vs. sistema a medida
   con el sector del cliente visible en el header. */
export function CustomAIHeroVisual({ lang }) {
  const t = lang === 'en'
    ? {
        generic: 'Generic template',
        sector: 'Renovations',
        live: 'Live',
        genericItems: ['Basic FAQ', 'Fixed catalog', 'General pricing'],
        liveItems: ['Renovation FAQ', 'Instant quotes', 'Real project pricing'],
      }
    : {
        generic: 'Plantilla genérica',
        sector: 'Reformas',
        live: 'En vivo',
        genericItems: ['FAQ básico', 'Catálogo fijo', 'Precios genéricos'],
        liveItems: ['FAQ de reformas', 'Presupuestos al vuelo', 'Precios por obra real'],
      };

  return (
    <MockupFrame className="w-full max-w-sm p-3">
      <div className="grid grid-cols-2 gap-2.5">
        {/* generic */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 opacity-60">
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-wide mb-2.5 leading-tight">
            {t.generic}
          </p>
          <div className="space-y-1.5">
            {t.genericItems.map((item, i) => (
              <div key={i} className="h-5 rounded bg-white/5 flex items-center px-2">
                <span className="text-[8px] text-white/30 line-through truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* tailored */}
        <div className="rounded-xl bg-cyan/10 border border-cyan/25 p-3 relative">
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-[7px] text-green-400 font-bold uppercase">{t.live}</span>
          </span>
          <p className="text-[8px] font-bold text-cyan-light uppercase tracking-wide mb-2.5 leading-tight pr-8">
            {t.sector}
          </p>
          <div className="space-y-1.5">
            {t.liveItems.map((item, i) => (
              <div key={i} className="h-5 rounded bg-cyan/15 flex items-center px-2 border border-cyan/10">
                <span className="text-[8px] text-white/85 truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

/* ── Hero 4 · CRM ──────────────────────────────────────────────
   Pipeline con leads reales, cifras concretas y mini-gráfico de
   leads del mes. */
export function CRMHeroVisual({ lang }) {
  const t = lang === 'en'
    ? {
        leadsLabel: 'Leads this month',
        stages: { new: 'New', qualified: 'Qualified', inProgress: 'In progress' },
        leads: [
          { stage: 'new', name: 'Sarah Mitchell', company: 'Mitchell Renovations', amount: '€8,500 est.' },
          { stage: 'qualified', name: 'Dave K.', company: 'DKRM Property', amount: '€3,200 est.' },
          { stage: 'inProgress', name: 'Reformas García', company: 'Full kitchen remodel', amount: '€12,000 est.' },
        ],
      }
    : {
        leadsLabel: 'Leads este mes',
        stages: { new: 'Nuevo', qualified: 'Cualificado', inProgress: 'En progreso' },
        leads: [
          { stage: 'new', name: 'Sarah Mitchell', company: 'Mitchell Renovations', amount: '8.500 € est.' },
          { stage: 'qualified', name: 'Dave K.', company: 'DKRM Property', amount: '3.200 € est.' },
          { stage: 'inProgress', name: 'Reformas García', company: 'Cocina completa', amount: '12.000 € est.' },
        ],
      };

  const stageStyles = {
    new: { bar: 'bg-cyan', text: 'text-cyan-light', bg: 'bg-cyan/10', border: 'border-cyan/25' },
    qualified: { bar: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/25' },
    inProgress: { bar: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25' },
  };

  const trendBars = [5, 7, 6, 9, 8, 12];

  return (
    <MockupFrame className="w-full max-w-sm p-4">
      {/* header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div>
          <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wide mb-1">
            {t.leadsLabel}
          </p>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-extrabold text-white leading-none tabular-nums">47</span>
            <FaChartLine className="w-3 h-3 text-green-400 mb-1 animate-bounce-slow" />
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-8">
          {trendBars.map((h, i) => (
            <div key={i} className="w-2 rounded-sm bg-cyan/60" style={{ height: `${h * 2.2}px` }} />
          ))}
        </div>
      </div>

      {/* pipeline */}
      <div className="space-y-2">
        {t.leads.map((lead, i) => {
          const s = stageStyles[lead.stage];
          return (
            <div key={i} className={`relative pl-3 pr-2.5 py-2 rounded-lg ${s.bg} border ${s.border} overflow-hidden`}>
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className={`text-[8px] font-bold uppercase ${s.text}`}>{t.stages[lead.stage]}</span>
                <span className="text-[9px] font-bold text-white whitespace-nowrap">{lead.amount}</span>
              </div>
              <p className="text-[10px] text-white/85 font-semibold truncate">{lead.name}</p>
              <p className="text-[9px] text-white/45 truncate">{lead.company}</p>
            </div>
          );
        })}
      </div>
    </MockupFrame>
  );
}
