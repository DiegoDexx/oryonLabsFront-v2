import {
  FaRobot, FaPaperPlane, FaWhatsapp, FaTelegram, FaInstagram,
  FaClock, FaPhoneAlt, FaChartLine, FaTachometerAlt, FaFilter,
  FaUserFriends, FaFileInvoice, FaBolt, FaUsers, FaCog,
} from 'react-icons/fa';
import MockupFrame from '../ui/MockupFrame';

/* ── Tab 1 · Chat web 24/7 ─────────────────────────────────────
   Scrollable conversation panel — it's fine for the example thread
   to overflow and require scrolling, it doesn't need to fit whole. */
export function ChatWebMockup({ data }) {
  return (
    <MockupFrame className="w-full p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
            <FaRobot className="w-4 h-4 text-cyan-light" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{data.header_name}</p>
            <p className="text-green-400 text-xs">{data.header_status}</p>
          </div>
        </div>
        <span className="text-gray-500 text-xs flex-shrink-0 hidden sm:inline">{data.header_domain}</span>
      </div>

      <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
        {data.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] text-sm leading-snug px-3.5 py-2.5 rounded-2xl ${
                m.from === 'user'
                  ? 'bg-white/10 text-white/85 rounded-br-sm'
                  : 'bg-cyan text-white rounded-bl-sm'
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <span className="text-white/30 text-sm">{data.input_placeholder}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center flex-shrink-0">
          <FaPaperPlane className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </MockupFrame>
  );
}

/* ── Tab 2 · Multicanal IA ─────────────────────────────────────
   Only WhatsApp is live; Telegram/Instagram render as disabled
   pills with a "roadmap" badge instead of looking equally active. */
const CHANNEL_ICONS = { whatsapp: FaWhatsapp, telegram: FaTelegram, instagram: FaInstagram };

export function MulticanalMockup({ data, roadmapLabel }) {
  return (
    <MockupFrame className="w-full p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(data.channels_tab).map(([key, label]) => {
            const Icon = CHANNEL_ICONS[key];
            const isActive = key === 'whatsapp';
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
                title={isActive ? undefined : roadmapLabel}
              >
                <Icon className="w-3 h-3" />
                {label}
                {!isActive && <span className="text-[9px] font-normal opacity-70">· {roadmapLabel}</span>}
              </span>
            );
          })}
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {data.status}
        </span>
      </div>

      <div className="h-56 overflow-y-auto px-4 py-4 space-y-3">
        {data.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] text-sm leading-snug px-3.5 py-2.5 rounded-2xl ${
                m.from === 'user'
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-white/10 text-white/85 rounded-bl-sm'
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 py-3.5 border-t border-white/10 bg-white/[0.02]">
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-2">{data.footer_label}</p>
        <div className="flex flex-wrap gap-1.5">
          {data.channels.map((c, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                c.status === 'active'
                  ? 'bg-cyan/15 text-cyan-light border border-cyan/20'
                  : 'bg-white/5 text-gray-500 border border-white/10'
              }`}
            >
              {c.text}
              {c.status === 'roadmap' && <span className="opacity-70">· {roadmapLabel}</span>}
            </span>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

/* ── Tab 3 · CRM unificado ─────────────────────────────────────
   Stylized recreation, not a real product screenshot — no "Producto
   real" badge here. If this is ever swapped for an authentic capture,
   flip SHOWS_REAL_SCREENSHOT and reintroduce a badge referencing it. */
const SHOWS_REAL_SCREENSHOT = false;

const SIDEBAR_ICONS = [FaTachometerAlt, FaFilter, FaUserFriends, FaUsers, FaFileInvoice, FaBolt, FaUsers, FaCog];

export function CRMMockup({ data, illustrativeLabel }) {
  const chartBars = [30, 45, 38, 60, 52, 70, 64];
  const channelBars = [
    { label: 'Website', value: 80 },
    { label: 'WhatsApp', value: 55 },
    { label: 'Voz IA', value: 30 },
  ];

  return (
    <MockupFrame className="w-full p-0 overflow-hidden">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col items-center gap-1 py-4 px-2.5 border-r border-white/10 bg-white/[0.02] flex-shrink-0">
          {SIDEBAR_ICONS.map((Icon, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                i === 0 ? 'bg-cyan/20 text-cyan' : 'text-gray-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wide">{data.header_title}</p>
              <p className="text-white font-bold text-sm mt-0.5">{data.panel_title}</p>
            </div>
            {SHOWS_REAL_SCREENSHOT && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Producto real · OryonX CRM
              </span>
            )}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {data.kpis.map((kpi, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/5 rounded-lg px-3 py-2.5">
                <p className="text-white font-bold text-lg leading-none">{kpi.value}</p>
                <p className="text-gray-500 text-[10px] mt-1 leading-tight">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Line chart */}
          <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3.5 mb-3">
            <p className="text-gray-400 text-[11px] font-semibold">{data.chart_title}</p>
            <p className="text-gray-600 text-[10px] mb-2">{data.chart_subtitle}</p>
            <div className="flex items-end gap-1.5 h-14">
              {chartBars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-cyan/50" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Channel bar chart */}
          <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3.5">
            <p className="text-gray-400 text-[11px] font-semibold mb-2.5">{data.channel_chart_title}</p>
            <div className="space-y-2">
              {channelBars.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-500 text-[10px] w-16 flex-shrink-0">{b.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-cyan/60" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat badges */}
          <div className="absolute -top-1 right-3 sm:right-4 bg-navy border border-white/10 rounded-lg px-3 py-2 shadow-xl max-w-[150px]">
            <p className="text-cyan-light text-[11px] font-bold leading-tight">{data.badge_growth}</p>
            <p className="text-gray-500 text-[9px] mt-0.5">{illustrativeLabel}</p>
          </div>
          <div className="absolute bottom-2 -left-1 sm:left-2 bg-navy border border-white/10 rounded-lg px-3 py-2 shadow-xl">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-white text-[11px] font-bold leading-tight">{data.badge_new_today}</p>
            </div>
            <p className="text-gray-500 text-[9px] mt-0.5">{data.badge_new_today_sub} · {illustrativeLabel}</p>
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

/* ── Tab 4 · Voz IA ────────────────────────────────────────────
   Inbound call — Ridley picks up, not a robo-dialer making outbound
   sales calls (see product-accuracy note in the tab copy). */
export function VoiceMockup({ data }) {
  const waveform = [4, 9, 6, 14, 8, 11, 5, 16, 7, 10, 4, 13, 8, 6, 12, 5, 9, 14, 6, 4];

  return (
    <MockupFrame className="w-full p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FaPhoneAlt className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            <p className="text-white text-sm font-semibold truncate">{data.header_status}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow" />
            {data.duration}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-1">{data.phone_number} · {data.channel_label}</p>
      </div>

      <div className="flex items-center gap-[3px] h-12 px-5 py-3 border-b border-white/10">
        {waveform.map((h, i) => (
          <div key={i} className="flex-1 rounded-full bg-cyan/60" style={{ height: `${h * 6}%` }} />
        ))}
      </div>

      <div className="px-5 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">{data.transcript_label}</p>
      </div>
      <div className="h-40 overflow-y-auto px-5 py-2 space-y-2.5">
        {data.transcript.map((line, i) => (
          <div key={i} className="flex gap-2.5">
            <span className={`text-[10px] font-bold uppercase w-12 flex-shrink-0 pt-0.5 ${line.speaker === 'ia' ? 'text-cyan' : 'text-gray-500'}`}>
              {line.speaker === 'ia' ? data.ia_label : data.customer_label}
            </span>
            <p className="text-white/80 text-sm leading-snug">{line.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-t border-white/10 bg-white/[0.02]">
        <FaClock className="w-3 h-3 text-gray-500 flex-shrink-0" />
        <span className="text-gray-500 text-xs flex-1">{data.footer_label}</span>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
      </div>
    </MockupFrame>
  );
}
