import { useGet } from '../../../../hooks/useFetch';
import { useAdminT } from '../../../../context/AdminLangContext';
import { SummaryKpiCard } from '../dashboard/metrics/primitives';
import { normalizeOrganization } from './orgDisplay';

const API_URL = import.meta.env.VITE_API_URL;

const CHANNEL_STYLE = {
  whatsapp:     { icon: '💬', pill: 'bg-green-100 text-green-700' },
  web_chat:     { icon: '🤖', pill: 'bg-purple-100 text-purple-700' },
  voice_telnyx: { icon: '📞', pill: 'bg-blue-100 text-blue-700' },
  voice_vapi:   { icon: '🎙️', pill: 'bg-cyan/10 text-cyan' },
  other:        { icon: '📌', pill: 'bg-gray-100 text-gray-600' },
};

const fmtUsd = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const fmtMs  = (n) => (n === null || n === undefined ? '—' : `${Number(n).toLocaleString()} ms`);
const fmtPct = (n) => (n === null || n === undefined ? '—' : `${n}%`);
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

const Stat = ({ label, value, tone = 'text-navy' }) => (
  <div>
    <p className="text-[11px] text-gray-400">{label}</p>
    <p className={`text-sm font-semibold tabular-nums ${tone}`}>{value}</p>
  </div>
);

const ChannelCard = ({ row, labels, to }) => {
  const style = CHANNEL_STYLE[row.channel] || CHANNEL_STYLE.other;
  const hasErrors = row.error_rate !== null && row.error_rate > 0;

  return (
    <div className="bg-white rounded-xl border border-crm-border p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">{style.icon}</span>
          <span className="text-sm font-semibold text-navy">{labels[row.channel] || row.channel}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.pill}`}>
          {row.executions} {to.executions_short}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Stat label={to.latency} value={fmtMs(row.avg_duration_ms)} />
        <Stat label={to.response_time} value={fmtMs(row.avg_response_time_ms)} />
        <Stat label={to.error_rate} value={fmtPct(row.error_rate)} tone={hasErrors ? 'text-red-500' : 'text-navy'} />
        <Stat label={to.cost_month} value={fmtUsd(row.cost)} />
      </div>
    </div>
  );
};

// Month cost, margin and per-channel agent performance — for the selected
// tenant, or for every tenant plus the unattributed bucket when none is.
const PerformanceOverview = ({ selectedOrgId, token }) => {
  const { t } = useAdminT();
  const to = t.assistant_performance.overview;

  const { data, loading, error } = useGet(`${API_URL}/api/metrics/overview`, token);
  const overview = data && !Array.isArray(data) && data.global ? data : null;

  if (!overview) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
        {loading && !error ? to.loading : to.error}
      </div>
    );
  }

  const orgEntry = selectedOrgId
    ? overview.organizations.find((o) => o.organization.id === Number(selectedOrgId))
    : null;
  const entry = orgEntry || overview.global;
  const isGlobal = !orgEntry;

  const { ai_cost: cost, margin, revenue, performance } = entry;
  const unattributed = overview.unattributed;
  const hasUnattributed =
    isGlobal && (unattributed.ai_cost.current > 0 || unattributed.performance.executions > 0);

  // Active clients with no billing client linked count 0 revenue, so their
  // margin is just minus their cost — say so instead of showing a scary number.
  const unlinkedClients = isGlobal
    ? overview.organizations
        .filter((o) => !o.organization.is_platform && o.organization.is_active && o.revenue?.linked === false)
        .map((o) => normalizeOrganization(o.organization).name)
    : [];

  const marginLabel = margin.pct === null ? to.margin : `${to.margin} · ${margin.pct}%`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-navy">
          {to.title} — {isGlobal ? to.scope_global : normalizeOrganization(orgEntry.organization).name}
        </h3>
        <span className="text-xs text-gray-400">
          {overview.period.month} · {to.vs_previous} {overview.period.previous_month}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryKpiCard
          label={to.ai_cost}
          value={fmtUsd(cost.current)}
          icon={<span>💰</span>}
          trend={cost.delta_pct}
          trendLabel={cost.delta_pct === null ? undefined : `${signed(cost.delta_pct)}%`}
          neutral
        />
        <SummaryKpiCard
          label={marginLabel}
          value={fmtUsd(margin.current)}
          icon={<span>📈</span>}
          trend={margin.delta}
          trendLabel={margin.delta_pct === null ? fmtUsd(margin.delta) : `${signed(margin.delta_pct)}%`}
        />
        <SummaryKpiCard label={to.executions} value={performance.executions} icon={<span>⚙️</span>} />
        <SummaryKpiCard label={to.error_rate} value={fmtPct(performance.error_rate)} icon={<span>⚠️</span>} />
      </div>

      <p className="text-xs text-gray-400">
        {to.revenue}: <strong className="text-gray-600">{fmtUsd(revenue.current)}</strong>
        {' · '}{to.cost_voice}: <strong className="text-gray-600">{fmtUsd(cost.voice)}</strong>
        {' · '}{to.cost_llm}: <strong className="text-gray-600">{fmtUsd(cost.llm)}</strong>
        {!isGlobal && !revenue.linked && <span className="text-amber-600"> · {to.revenue_unlinked}</span>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {performance.channels.map((row) => (
          <ChannelCard key={row.channel} row={row} labels={to.channels} to={to} />
        ))}
      </div>

      {performance.executions === 0 && (
        <p className="text-sm text-gray-400">{to.empty}</p>
      )}

      {unlinkedClients.length > 0 && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          {to.revenue_unlinked_list.replace('{clients}', unlinkedClients.join(', '))}
        </div>
      )}

      {hasUnattributed && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          {to.unattributed
            .replace('{cost}', fmtUsd(unattributed.ai_cost.current))
            .replace('{executions}', unattributed.performance.executions)}
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
