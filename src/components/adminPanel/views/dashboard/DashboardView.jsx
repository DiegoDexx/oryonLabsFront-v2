import { useState } from 'react';
import { useAdminT } from '../../../../context/AdminLangContext';
import { getChannelConfig } from './metrics/helpers';

import LeadCaptureTrend    from './metrics/LeadCaptureTrend';
import ChannelCards        from './metrics/ChannelCards';
import ConversionFunnel    from './metrics/ConversionFunnel';
import LeadsConvertedTrend from './metrics/LeadsConvertedTrend';
import MRRGrowthChart      from './metrics/MRRGrowthChart';
import ChurnRateCard       from './metrics/ChurnRateCard';
import MRRByPlan           from './metrics/MRRByPlan';

// ── Helpers ───────────────────────────────────────────────────────────────────

const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const prevMonthKey = () => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const dateKey = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const daysElapsedThisMonth = () => new Date().getDate();

// ── Sub-components ────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, color = 'text-navy', badge }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {badge}
    </div>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const TrendPill = ({ value }) => {
  if (value === null || value === undefined) return null;
  if (value > 0)  return <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">↑ +{value}%</span>;
  if (value < 0)  return <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full mb-1">↓ {value}%</span>;
  return <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mb-1">→ 0%</span>;
};

const SectionHeader = ({ title, subtitle, isOpen, onToggle, alertCount }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-navy/30 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-left">
        <h2 className="font-bold text-navy text-base">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      {alertCount > 0 && (
        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
          {alertCount}
        </span>
      )}
    </div>
    <svg
      className={`w-5 h-5 text-gray-400 group-hover:text-navy transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────

const DashboardView = ({ leads, subscriptions, invoices }) => {
  const { t } = useAdminT();
  const [open, setOpen] = useState({ adquisicion: true, conversion: true, negocio: true });
  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const channelConfig = getChannelConfig(t.dashboard.channels);

  // ── Adquisición ───────────────────────────────────────────────────────────
  const ta = t.dashboard.adquisicion;
  const curKey  = currentMonthKey();
  const prevKey = prevMonthKey();
  const thisMonthLeads = leads.filter(l => dateKey(l.created_at) === curKey).length;
  const prevMonthLeads = leads.filter(l => dateKey(l.created_at) === prevKey).length;
  const avgPerDay      = (thisMonthLeads / daysElapsedThisMonth()).toFixed(1);
  const momPct         = prevMonthLeads > 0
    ? Math.round(((thisMonthLeads - prevMonthLeads) / prevMonthLeads) * 100)
    : thisMonthLeads > 0 ? 100 : null;

  // ── Conversión ────────────────────────────────────────────────────────────
  const tc = t.dashboard.conversion_section;
  const totalConverted = leads.filter(l => l.status === 'converted').length;
  const globalRate     = leads.length > 0 ? Math.round((totalConverted / leads.length) * 100) : 0;

  const byChannel = leads.reduce((acc, l) => {
    const ch = (l.channel || 'manual').toLowerCase();
    if (!acc[ch]) acc[ch] = { total: 0, converted: 0 };
    acc[ch].total++;
    if (l.status === 'converted') acc[ch].converted++;
    return acc;
  }, {});

  const bestChannel = Object.entries(byChannel)
    .map(([ch, { total, converted }]) => ({
      ch,
      label: channelConfig[ch]?.label || ch,
      rate: total > 0 ? Math.round((converted / total) * 100) : 0,
    }))
    .filter(x => x.rate > 0)
    .sort((a, b) => b.rate - a.rate)[0] || null;

  const now = new Date();
  const unmanagedLeads = leads.filter(l => {
    if (l.status !== 'new' || !l.created_at) return false;
    const diffDays = (now - new Date(l.created_at)) / 86400000;
    return diffDays > 3;
  });

  // ── Negocio ───────────────────────────────────────────────────────────────
  const tn = t.dashboard.negocio;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const MRR = activeSubscriptions.reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  const uniqueActiveClients = new Set(
    activeSubscriptions.map(s => s.client?.name).filter(Boolean)
  ).size;
  const ARPU = uniqueActiveClients > 0 ? (MRR / uniqueActiveClients).toFixed(0) : 0;

  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  const upcomingRenewals = activeSubscriptions.filter(s => {
    if (!s.next_billing_date) return false;
    const diffDays = (new Date(s.next_billing_date) - now) / 86400000;
    return diffDays >= 0 && diffDays <= 15;
  });

  return (
    <div className="space-y-3">

      {/* ══ SECCIÓN 1: ADQUISICIÓN ══════════════════════════════════════════ */}
      <SectionHeader
        title={ta.title}
        subtitle={ta.subtitle}
        isOpen={open.adquisicion}
        onToggle={() => toggle('adquisicion')}
      />
      {open.adquisicion && (
        <div className="space-y-4 pb-2">
          <div className="grid grid-cols-3 gap-4">
            <KpiCard
              label={ta.kpi_this_month}
              value={thisMonthLeads}
              badge={<TrendPill value={momPct} />}
            />
            <KpiCard
              label={ta.kpi_prev_month}
              value={prevMonthLeads}
              color="text-gray-600"
            />
            <KpiCard
              label={ta.kpi_avg_day}
              value={avgPerDay}
              sub={ta.kpi_avg_day_sub}
              color="text-cyan"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadCaptureTrend leads={leads} />
            <ChannelCards     leads={leads} />
          </div>
        </div>
      )}

      {/* ══ SECCIÓN 2: CONVERSIÓN ═══════════════════════════════════════════ */}
      <SectionHeader
        title={tc.title}
        subtitle={tc.subtitle}
        isOpen={open.conversion}
        onToggle={() => toggle('conversion')}
        alertCount={unmanagedLeads.length}
      />
      {open.conversion && (
        <div className="space-y-4 pb-2">
          <div className="grid grid-cols-3 gap-4">
            <KpiCard
              label={tc.kpi_rate}
              value={`${globalRate}%`}
              color="text-green-600"
            />
            <KpiCard
              label={tc.kpi_best_channel}
              value={bestChannel ? `${bestChannel.label}` : tc.kpi_best_channel_none}
              sub={bestChannel ? `${bestChannel.rate}% ${tc.kpi_best_channel_sub}` : undefined}
              color={bestChannel ? 'text-navy' : 'text-gray-400'}
            />
            <KpiCard
              label={tc.kpi_unmanaged}
              value={unmanagedLeads.length}
              sub={tc.kpi_unmanaged_sub}
              color={unmanagedLeads.length > 0 ? 'text-red-500' : 'text-green-600'}
            />
          </div>

          {unmanagedLeads.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-sm font-medium text-red-700">
                {unmanagedLeads.length} {tc.unmanaged_alert}
              </p>
              <div className="ml-auto flex flex-wrap gap-2">
                {unmanagedLeads.slice(0, 3).map(l => (
                  <span key={l.id} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    {l.name}
                  </span>
                ))}
                {unmanagedLeads.length > 3 && (
                  <span className="text-xs text-red-500">+{unmanagedLeads.length - 3}</span>
                )}
              </div>
            </div>
          )}

          <ConversionFunnel    leads={leads} />
          <LeadsConvertedTrend leads={leads} />
        </div>
      )}

      {/* ══ SECCIÓN 3: NEGOCIO ══════════════════════════════════════════════ */}
      <SectionHeader
        title={tn.title}
        subtitle={tn.subtitle}
        isOpen={open.negocio}
        onToggle={() => toggle('negocio')}
        alertCount={upcomingRenewals.length}
      />
      {open.negocio && (
        <div className="space-y-4 pb-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label={tn.kpi_mrr}    value={`€${MRR.toFixed(0)}`}  sub={tn.kpi_mrr_sub}  color="text-cyan" />
            <KpiCard label={tn.kpi_active} value={uniqueActiveClients}    color="text-green-600" />
            <KpiCard label={tn.kpi_arpu}   value={`€${ARPU}`}            sub={tn.kpi_arpu_sub} />
            <KpiCard label={tn.kpi_pending} value={`€${pendingAmount.toFixed(0)}`} color={pendingAmount > 0 ? 'text-orange-500' : 'text-gray-400'} />
          </div>

          {upcomingRenewals.length > 0 && (
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
              <span className="text-orange-500 text-lg mt-0.5">🔔</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-700 mb-2">
                  {upcomingRenewals.length} {tn.renewal_alert}
                </p>
                <div className="flex flex-wrap gap-2">
                  {upcomingRenewals.map(s => {
                    const days = Math.ceil((new Date(s.next_billing_date) - now) / 86400000);
                    return (
                      <span key={s.id} className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                        {s.client?.name || '—'} · {tn.renewal_in} {days} {tn.renewal_days}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MRRByPlan    subscriptions={subscriptions} />
            <MRRGrowthChart subscriptions={subscriptions} />
          </div>

          <ChurnRateCard subscriptions={subscriptions} />
        </div>
      )}

    </div>
  );
};

export default DashboardView;
