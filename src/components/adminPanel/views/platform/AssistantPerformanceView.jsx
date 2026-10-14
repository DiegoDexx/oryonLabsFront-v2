import { useGet } from '../../../../hooks/useFetch';
import { useAdminT } from '../../../../context/AdminLangContext';
import { KpiCard, SummaryKpiCard, VerticalBars } from '../dashboard/metrics/primitives';
import PerformanceOverview from './PerformanceOverview';

const API_URL = import.meta.env.VITE_API_URL;

const fmtUsd = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const fmtSeconds = (s) => {
  const total = Math.round(Number(s) || 0);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

// ── Margin ring gauge (local — single use, mirrors ChurnRateCard's pattern) ──

const MarginRing = ({ pct, label }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const R = 36;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - clamped / 100);
  const ring = pct >= 50 ? '#22c55e' : pct >= 20 ? '#f97316' : '#ef4444';

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
        <circle cx="44" cy="44" r={R} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle cx="44" cy="44" r={R} fill="none" stroke={ring} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-navy">{pct}%</span>
        <span className="text-[10px] text-gray-400">{label}</span>
      </div>
    </div>
  );
};

const AssistantPerformanceView = ({ organizations, selectedOrgId, onSelectOrg, token }) => {
  const { t } = useAdminT();
  const ta = t.assistant_performance;

  const usageUrl      = selectedOrgId ? `${API_URL}/api/metrics/usage?organization_id=${selectedOrgId}`      : null;
  const callsUrl       = selectedOrgId ? `${API_URL}/api/metrics/calls?organization_id=${selectedOrgId}`      : null;
  const executionsUrl  = selectedOrgId ? `${API_URL}/api/metrics/executions?organization_id=${selectedOrgId}` : null;
  const marginUrl       = selectedOrgId ? `${API_URL}/api/metrics/margin?organization_id=${selectedOrgId}`     : null;

  const { data: usageRaw,      loading: loadingUsage }      = useGet(usageUrl,      token);
  const { data: callsRaw,      loading: loadingCalls }      = useGet(callsUrl,      token);
  const { data: executionsRaw, loading: loadingExecutions } = useGet(executionsUrl, token);
  const { data: margin,        loading: loadingMargin }     = useGet(marginUrl,     token);

  const usage      = Array.isArray(usageRaw) ? usageRaw : [];
  const calls      = Array.isArray(callsRaw) ? callsRaw : [];
  const executions = Array.isArray(executionsRaw) ? executionsRaw : [];

  const selectedOrg = organizations.find((o) => o.id === Number(selectedOrgId)) || null;

  // ── LLM usage aggregates ────────────────────────────────────────────────
  const llmCost   = usage.reduce((acc, u) => acc + Number(u.cost_usd || 0), 0);
  const llmTokens = usage.reduce((acc, u) => acc + Number(u.prompt_tokens || 0) + Number(u.completion_tokens || 0), 0);

  const byModel = Object.entries(
    usage.reduce((acc, u) => {
      const key = u.model || ta.unknown;
      acc[key] = (acc[key] || 0) + Number(u.cost_usd || 0);
      return acc;
    }, {})
  ).map(([key, value]) => ({ key, label: key, value: Number(value.toFixed(4)) }));

  const byChannel = Object.entries(
    usage.reduce((acc, u) => {
      const key = u.channel || ta.unknown;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({ key, label: key, value }));

  // ── Voice call aggregates ───────────────────────────────────────────────
  const voiceCost = calls.reduce((acc, c) => acc + Number(c.cost_usd || 0), 0);
  const avgDuration = calls.length > 0
    ? calls.reduce((acc, c) => acc + Number(c.duration_seconds || 0), 0) / calls.length
    : 0;

  // ── Workflow execution aggregates ───────────────────────────────────────
  const successfulRuns = executions.filter((e) => e.status === 'success').length;
  const failedRuns      = executions.filter((e) => ['error', 'crashed', 'failed'].includes(e.status)).length;
  const avgExecMs       = executions.length > 0
    ? executions.reduce((acc, e) => acc + Number(e.duration_ms || 0), 0) / executions.length
    : 0;

  const totalAiCost = llmCost + voiceCost;
  const isLoading = loadingUsage || loadingCalls || loadingExecutions || loadingMargin;

  return (
    <div className="space-y-6">
      {/* ── Org picker ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-medium text-gray-700 sm:w-40 flex-shrink-0">{ta.select_org}</label>
        <select
          value={selectedOrgId ?? ''}
          onChange={(e) => onSelectOrg(e.target.value ? Number(e.target.value) : null)}
          className="w-full sm:max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan focus:border-transparent"
        >
          <option value="">{ta.overview.scope_global_option}</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.slug ? `${org.name} (${org.slug})` : org.name}</option>
          ))}
        </select>
        {selectedOrg && (
          <span className="text-xs text-gray-400">
            {ta.assistant_id}: {[selectedOrg.vapi_assistant_id, selectedOrg.telnyx_assistant_id].filter(Boolean).join(' / ') || '—'} · {ta.workflow_id}: {(selectedOrg.n8n_workflow_ids || []).join(', ') || '—'}
          </span>
        )}
      </div>

      <PerformanceOverview selectedOrgId={selectedOrgId} token={token} />

      {!selectedOrgId ? (
        <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
          {ta.no_org_selected}
        </div>
      ) : isLoading ? (
        <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
          {ta.loading}
        </div>
      ) : (
        <>
          {/* ── KPI row ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SummaryKpiCard label={ta.kpi_total_ai_cost} value={fmtUsd(totalAiCost)} icon={<span>💰</span>} />
            <SummaryKpiCard label={ta.kpi_total_calls}   value={calls.length}        icon={<span>📞</span>} />
            <SummaryKpiCard label={ta.kpi_total_runs}    value={executions.length}   icon={<span>⚙️</span>} />
          </div>

          {/* ── LLM usage ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-navy">{ta.llm_section_title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard label={ta.kpi_llm_cost}   value={fmtUsd(llmCost)} />
              <KpiCard label={ta.kpi_llm_tokens} value={llmTokens.toLocaleString()} />
              <KpiCard label={ta.kpi_llm_requests} value={usage.length} />
            </div>
            {usage.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-xs text-gray-400 mb-3">{ta.by_model}</p>
                  <VerticalBars data={byModel} barClass="bg-cyan" valueFormatter={fmtUsd} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-3">{ta.by_channel}</p>
                  <VerticalBars data={byChannel} barClass="bg-purple-500" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{ta.llm_empty}</p>
            )}
          </div>

          {/* ── Voice calls ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-navy">{ta.calls_section_title}</h3>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{ta.kpi_voice_cost}: <strong className="text-gray-700">{fmtUsd(voiceCost)}</strong></span>
                <span>{ta.kpi_avg_duration}: <strong className="text-gray-700">{fmtSeconds(avgDuration)}</strong></span>
              </div>
            </div>
            {calls.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">{ta.calls_empty}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-6 py-3">{ta.headers.date}</th>
                      <th className="text-left px-6 py-3">{ta.headers.duration}</th>
                      <th className="text-left px-6 py-3">{ta.headers.ended_reason}</th>
                      <th className="text-left px-6 py-3">{ta.headers.cost}</th>
                      <th className="text-right px-6 py-3">{ta.headers.recording}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {calls.slice(0, 25).map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/40 transition">
                        <td className="px-6 py-3 text-gray-500">{new Date(c.created_at).toLocaleString()}</td>
                        <td className="px-6 py-3 text-gray-700">{fmtSeconds(c.duration_seconds)}</td>
                        <td className="px-6 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {c.ended_reason || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{fmtUsd(c.cost_usd)}</td>
                        <td className="px-6 py-3 text-right">
                          {c.recording_url ? (
                            <a href={c.recording_url} target="_blank" rel="noreferrer" className="text-cyan hover:underline text-xs">
                              {ta.play_recording}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Workflow executions + Margin ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-navy">{ta.executions_section_title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <KpiCard label={ta.kpi_success} value={successfulRuns} color="text-green-600" />
                <KpiCard label={ta.kpi_failed}  value={failedRuns}     color={failedRuns > 0 ? 'text-red-500' : 'text-gray-400'} />
                <KpiCard label={ta.kpi_total_runs} value={executions.length} />
                <KpiCard label={ta.kpi_avg_duration_ms} value={`${Math.round(avgExecMs)}ms`} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
              <h3 className="font-semibold text-navy mb-4">{ta.margin_section_title}</h3>
              {margin ? (
                <>
                  <MarginRing pct={margin.margin_pct} label={ta.margin_period} />
                  <div className="space-y-2.5 text-sm mt-5">
                    <div className="flex justify-between text-gray-500">
                      <span>{ta.kpi_revenue}</span>
                      <span className="font-semibold text-navy">{fmtUsd(margin.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{ta.kpi_ai_cost}</span>
                      <span className="font-semibold text-red-500">{fmtUsd(margin.ai_cost)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 border-t border-gray-100 pt-2.5">
                      <span>{ta.kpi_margin_usd}</span>
                      <span className="font-semibold text-green-600">{fmtUsd(margin.margin_usd)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">{ta.margin_empty}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssistantPerformanceView;
