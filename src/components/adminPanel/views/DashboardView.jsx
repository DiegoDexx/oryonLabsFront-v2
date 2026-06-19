import { useState } from 'react';
import { StatCard, Badge } from '../shared';
import { useAdminT } from '../../../context/AdminLangContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMonthKey = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getLastNMonths = (n, lang = 'es') => {
  const months = [];
  const now = new Date();
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString(locale, { month: 'short' }),
    });
  }
  return months;
};

const isLastMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
};

const growthPct = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

// ── Shared sub-components ─────────────────────────────────────────────────────

const TrendBadge = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-xs text-gray-400">—</span>;
  if (value > 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ +{value}%</span>;
  if (value < 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">↓ {value}%</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">→ 0%</span>;
};

const RangeToggle = ({ value, onChange, labelAll, labelMonth }) => (
  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
    {[['all', labelAll], ['month', labelMonth]].map(([val, lbl]) => (
      <button key={val} onClick={() => onChange(val)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${value === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
        {lbl}
      </button>
    ))}
  </div>
);

const VerticalBars = ({ data, barClass, valueFormatter = (v) => v || '—' }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 96 }}>
      {data.map((d) => (
        <div key={d.key} className="flex-1 flex flex-col items-center justify-end gap-1">
          {d.value > 0 && (
            <span className="text-[10px] text-gray-500 leading-none">{valueFormatter(d.value)}</span>
          )}
          <div
            className={`w-full rounded-t-md transition-all duration-500 ${barClass} ${d.value === 0 ? 'opacity-15' : ''}`}
            style={{ height: `${Math.max((d.value / max) * 76, d.value > 0 ? 6 : 2)}px` }}
          />
          <span className="text-[10px] text-gray-400 capitalize leading-none">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Channel config ────────────────────────────────────────────────────────────

const getChannelConfig = (channelLabels) => ({
  form:     { label: channelLabels.form,     bar: 'bg-cyan',       pill: 'bg-cyan/10 text-cyan',          convBar: 'bg-cyan',       icon: '📝' },
  chatbot:  { label: channelLabels.chatbot,  bar: 'bg-purple-500', pill: 'bg-purple-100 text-purple-700', convBar: 'bg-purple-500', icon: '🤖' },
  whatsapp: { label: channelLabels.whatsapp, bar: 'bg-green-500',  pill: 'bg-green-100 text-green-700',   convBar: 'bg-green-500',  icon: '💬' },
  phone:    { label: channelLabels.phone,    bar: 'bg-blue-500',   pill: 'bg-blue-100 text-blue-700',     convBar: 'bg-blue-500',   icon: '📞' },
  manual:   { label: channelLabels.manual,   bar: 'bg-gray-400',   pill: 'bg-gray-100 text-gray-600',     convBar: 'bg-gray-400',   icon: '✏️' },
});

// ── Leads by source ───────────────────────────────────────────────────────────

const LeadsBySource = ({ leads }) => {
  const { t } = useAdminT();
  const td = t.dashboard.marketing.leads_by_source;
  const channelConfig = getChannelConfig(t.dashboard.channels);
  const [range, setRange] = useState('all');
  const filtered = range === 'month' ? leads.filter(l => isLastMonth(l.created_at)) : leads;
  const total = filtered.length;
  const counts = filtered.reduce((acc, l) => {
    const ch = (l.channel || 'manual').toLowerCase();
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-navy">{td.title}</h3>
        <RangeToggle value={range} onChange={setRange} labelAll={td.range_all} labelMonth={td.range_month} />
      </div>
      {total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{td.empty}</p>
      ) : (
        <div className="space-y-4">
          {sorted.map(([channel, count]) => {
            const cfg = channelConfig[channel] || { label: channel, bar: 'bg-gray-400', pill: 'bg-gray-100 text-gray-600', icon: '📌' };
            const pct = Math.round((count / total) * 100);
            return (
              <div key={channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>{count} lead{count !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`} style={{ width: `${Math.round((count / max) * 100)}%` }} />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            {td.total_prefix} <span className="font-semibold text-gray-600">{total}</span> leads
          </p>
        </div>
      )}
    </div>
  );
};

// ── Conversion by source ──────────────────────────────────────────────────────

const ConversionBySource = ({ leads }) => {
  const { t } = useAdminT();
  const td = t.dashboard.marketing.conversion_by_source;
  const channelConfig = getChannelConfig(t.dashboard.channels);
  const [range, setRange] = useState('all');
  const filtered = range === 'month' ? leads.filter(l => isLastMonth(l.created_at)) : leads;

  const byChannel = filtered.reduce((acc, l) => {
    const ch = (l.channel || 'manual').toLowerCase();
    if (!acc[ch]) acc[ch] = { total: 0, converted: 0 };
    acc[ch].total += 1;
    if (l.status === 'converted') acc[ch].converted += 1;
    return acc;
  }, {});

  const rows = Object.entries(byChannel)
    .map(([ch, { total, converted }]) => ({
      channel: ch,
      total,
      converted,
      rate: total > 0 ? Math.round((converted / total) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate);

  const maxRate = rows[0]?.rate || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-navy">{td.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{td.subtitle}</p>
        </div>
        <RangeToggle value={range} onChange={setRange} labelAll={t.dashboard.marketing.leads_by_source.range_all} labelMonth={t.dashboard.marketing.leads_by_source.range_month} />
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{td.empty}</p>
      ) : (
        <div className="space-y-5">
          {rows.map(({ channel, total, converted, rate }) => {
            const cfg = channelConfig[channel] || { label: channel, convBar: 'bg-gray-400', pill: 'bg-gray-100 text-gray-600', icon: '📌' };
            const rateColor = rate >= 30 ? 'text-green-600' : rate >= 15 ? 'text-orange-500' : 'text-red-500';
            return (
              <div key={channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{converted}/{total}</span>
                    <span className={`text-sm font-bold w-10 text-right ${rateColor}`}>{rate}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.convBar}`}
                    style={{ width: `${Math.round((rate / maxRate) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            {td.legend}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Leads converted – trend ───────────────────────────────────────────────────

const LeadsConvertedTrend = ({ leads }) => {
  const { t, lang } = useAdminT();
  const td = t.dashboard.ventas.converted_trend;
  const months = getLastNMonths(6, lang);
  const convertedByMonth = leads
    .filter(l => l.status === 'converted' && l.created_at)
    .reduce((acc, l) => { const k = getMonthKey(l.created_at); if (k) acc[k] = (acc[k] || 0) + 1; return acc; }, {});

  const data = months.map(m => ({ ...m, value: convertedByMonth[m.key] || 0 }));
  const last = data[data.length - 1]?.value ?? 0;
  const prev = data[data.length - 2]?.value ?? 0;
  const trend = growthPct(last, prev);
  const totalConverted = leads.filter(l => l.status === 'converted').length;
  const convRate = leads.length > 0 ? Math.round((totalConverted / leads.length) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-navy">{td.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{td.subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TrendBadge value={trend} />
          <span className="text-[10px] text-gray-400">{td.vs_prev}</span>
        </div>
      </div>
      <div className="flex gap-6 mb-5">
        <div>
          <p className="text-2xl font-bold text-navy">{totalConverted}</p>
          <p className="text-xs text-gray-400">{td.total_label}</p>
        </div>
        <div className="border-l border-gray-100 pl-6">
          <p className="text-2xl font-bold text-green-600">{convRate}%</p>
          <p className="text-xs text-gray-400">{td.rate_label}</p>
        </div>
      </div>
      <VerticalBars data={data} barClass="bg-green-400" />
    </div>
  );
};

// ── MRR Growth MoM ────────────────────────────────────────────────────────────

const MRRGrowthChart = ({ subscriptions }) => {
  const { t, lang } = useAdminT();
  const td = t.dashboard.ventas.mrr_growth;
  const months = getLastNMonths(6, lang);
  const newMRRByMonth = subscriptions
    .filter(s => s.start_date && s.monthly_fee)
    .reduce((acc, s) => { const k = getMonthKey(s.start_date); if (k) acc[k] = (acc[k] || 0) + parseFloat(s.monthly_fee); return acc; }, {});

  const data = months.map(m => ({ ...m, value: newMRRByMonth[m.key] || 0 }));
  const last = data[data.length - 1]?.value ?? 0;
  const prev = data[data.length - 2]?.value ?? 0;
  const trend = growthPct(last, prev);
  const currentMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-navy">{td.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{td.subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TrendBadge value={trend} />
          <span className="text-[10px] text-gray-400">{td.vs_prev}</span>
        </div>
      </div>
      <div className="flex gap-6 mb-5">
        <div>
          <p className="text-2xl font-bold text-cyan">€{currentMRR.toFixed(0)}</p>
          <p className="text-xs text-gray-400">{td.current_label}</p>
        </div>
        <div className="border-l border-gray-100 pl-6">
          <p className="text-2xl font-bold text-navy">€{last.toFixed(0)}</p>
          <p className="text-xs text-gray-400">{td.new_label}</p>
        </div>
      </div>
      <VerticalBars data={data} barClass="bg-cyan" valueFormatter={v => v > 0 ? `€${v}` : null} />
    </div>
  );
};

// ── Churn rate ────────────────────────────────────────────────────────────────

const ChurnRateCard = ({ subscriptions }) => {
  const { t } = useAdminT();
  const td = t.dashboard.ventas.churn;
  const total     = subscriptions.length;
  const cancelled = subscriptions.filter(s => s.status === 'cancelled').length;
  const active    = subscriptions.filter(s => s.status === 'active').length;
  const rate      = total > 0 ? parseFloat(((cancelled / total) * 100).toFixed(1)) : 0;

  const health =
    rate >= 10 ? { label: td.health_high, ring: '#ef4444', bg: 'bg-red-50',    txt: 'text-red-600'    } :
    rate >=  5 ? { label: td.health_mid,  ring: '#f97316', bg: 'bg-orange-50', txt: 'text-orange-600' } :
                 { label: td.health_low,  ring: '#22c55e', bg: 'bg-green-50',  txt: 'text-green-700'  };

  const R = 36;
  const circ   = 2 * Math.PI * R;
  const offset = circ * (1 - Math.min(rate / 100, 1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
      <h3 className="font-semibold text-navy mb-0.5">{td.title}</h3>
      <p className="text-xs text-gray-400 mb-5">{td.subtitle}</p>
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
            <circle cx="44" cy="44" r={R} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle cx="44" cy="44" r={R} fill="none"
              stroke={health.ring} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-navy">{rate}%</span>
          </div>
        </div>
      </div>
      <div className={`text-center text-xs font-semibold px-3 py-1.5 rounded-full ${health.bg} ${health.txt} mb-5`}>
        {health.label}
      </div>
      <div className="space-y-2.5 text-sm mt-auto">
        <div className="flex justify-between text-gray-500">
          <span>{td.active}</span>
          <span className="font-semibold text-green-600">{active}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>{td.cancelled}</span>
          <span className="font-semibold text-red-500">{cancelled}</span>
        </div>
        <div className="flex justify-between text-gray-500 border-t border-gray-100 pt-2.5">
          <span>{td.total}</span>
          <span className="font-semibold text-navy">{total}</span>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const DashboardView = ({ leads, subscriptions, invoices }) => {
  const { t } = useAdminT();
  const td = t.dashboard;
  const [activeView, setActiveView] = useState('marketing');

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const MRR           = activeSubscriptions.reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const pendingAmount = pendingInvoices.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);
  const totalConverted = leads.filter(l => l.status === 'converted').length;
  const convRate = leads.length > 0 ? Math.round((totalConverted / leads.length) * 100) : 0;

  const VIEWS = [
    { id: 'marketing', label: td.selector.marketing, icon: '📣' },
    { id: 'ventas',    label: td.selector.ventas,    icon: '💼' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Dashboard selector ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeView === v.id
                ? 'bg-navy text-white border-navy shadow-md'
                : 'bg-white text-gray-500 border-gray-200 hover:border-navy/30 hover:text-navy'
            }`}
          >
            <span>{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── MARKETING & ACQUISITION ───────────────────────────────────────── */}
      {activeView === 'marketing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label={td.marketing.kpi_total}     value={leads.length} />
            <StatCard label={td.marketing.kpi_converted} value={totalConverted} color="green-600" />
            <StatCard label={td.marketing.kpi_rate}      value={`${convRate}%`} sub={td.marketing.kpi_rate_sub} color="cyan" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadsBySource leads={leads} />
            <ConversionBySource leads={leads} />
          </div>
        </div>
      )}

      {/* ── LEADS & SALES ─────────────────────────────────────────────────── */}
      {activeView === 'ventas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label={td.ventas.kpi_active_clients} value={activeSubscriptions.length} color="green-600" />
            <StatCard label={td.ventas.kpi_mrr}            value={`€${MRR.toFixed(0)}`} sub={td.ventas.kpi_mrr_sub} />
            <StatCard label={td.ventas.kpi_pending}        value={`€${pendingAmount.toFixed(0)}`} color="orange-500" />
          </div>

          {pendingInvoices.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-orange-700 font-medium text-sm">
                ⚠️ {pendingInvoices.length} {td.ventas.alert_pending}
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-navy mb-4">{td.ventas.latest_leads_title}</h3>
            <div className="space-y-3">
              {leads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                  <Badge color="blue-500" size="sm">{lead.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LeadsConvertedTrend leads={leads} />
            <MRRGrowthChart subscriptions={subscriptions} />
            <ChurnRateCard subscriptions={subscriptions} />
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardView;
