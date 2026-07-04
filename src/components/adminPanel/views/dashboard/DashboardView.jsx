import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAdminT } from '../../../../context/AdminLangContext';
import { getChannelConfig } from './metrics/helpers';

import LeadCaptureTrend    from './metrics/LeadCaptureTrend';
import ChannelCards        from './metrics/ChannelCards';
import ConversionFunnel    from './metrics/ConversionFunnel';
import LeadsConvertedTrend from './metrics/LeadsConvertedTrend';
import MRRGrowthChart      from './metrics/MRRGrowthChart';
import ChurnRateCard       from './metrics/ChurnRateCard';
import MRRByPlan           from './metrics/MRRByPlan';

// ── Date/time helpers ─────────────────────────────────────────────────────────

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

const getGreeting = (t) => {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return (t.dashboard.greeting_morning  || 'Buenos días').toUpperCase();
  if (h >= 14 && h < 21) return (t.dashboard.greeting_afternoon || 'Buenas tardes').toUpperCase();
  return (t.dashboard.greeting_evening || 'Buenas noches').toUpperCase();
};

const formatDate = () =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// ── Summary KPI card (top row) ────────────────────────────────────────────────

const SummaryKpiCard = ({ label, value, icon, trend, trendLabel, neutral }) => (
  <div className="bg-white rounded-2xl border border-crm-border shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-[10px] bg-cyan-pale flex items-center justify-center text-crm-accent flex-shrink-0">
        {icon}
      </div>
      {trend !== undefined && trend !== null && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
          neutral
            ? 'text-gray-500 bg-gray-100'
            : trend > 0
              ? 'text-green-600 bg-green-50'
              : trend < 0
                ? 'text-red-500 bg-red-50'
                : 'text-gray-500 bg-gray-100'
        }`}>
          {neutral ? null : trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
          {trendLabel}
        </span>
      )}
    </div>
    <div>
      <p className="text-[32px] font-bold text-crm-text tabular-nums leading-tight">{value}</p>
      <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Detail KPI card (inside collapsible sections) ─────────────────────────────

const KpiCard = ({ label, value, sub, color = 'text-navy', badge }) => (
  <div className="bg-white rounded-xl border border-crm-border p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
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

// ── Collapsible section header ────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, isOpen, onToggle, alertCount }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-crm-border shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:border-navy/30 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-left">
        <h2 className="font-bold text-crm-text text-base">{title}</h2>
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

// ── KPI icons ─────────────────────────────────────────────────────────────────

const IconLeads = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconClients = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconSubs = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const IconInvoice = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// ── DashboardView ─────────────────────────────────────────────────────────────

const DashboardView = ({ leads, clients, subscriptions, invoices, onNewLead, onNewClient, onNewSub, onNewInvoice }) => {
  const { t } = useAdminT();
  const user  = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState({ adquisicion: true, conversion: true, negocio: true });
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const channelConfig = getChannelConfig(t.dashboard.channels);

  // ── Adquisición data ───────────────────────────────────────────────────────
  const ta = t.dashboard.adquisicion;
  const curKey  = currentMonthKey();
  const prevKey = prevMonthKey();
  const thisMonthLeads = leads.filter((l) => dateKey(l.created_at) === curKey).length;
  const prevMonthLeads = leads.filter((l) => dateKey(l.created_at) === prevKey).length;
  const avgPerDay      = (thisMonthLeads / daysElapsedThisMonth()).toFixed(1);
  const momPct         = prevMonthLeads > 0
    ? Math.round(((thisMonthLeads - prevMonthLeads) / prevMonthLeads) * 100)
    : thisMonthLeads > 0 ? 100 : null;

  // ── Conversión data ────────────────────────────────────────────────────────
  const tc = t.dashboard.conversion_section;
  const totalConverted = leads.filter((l) => l.status === 'converted').length;
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
    .filter((x) => x.rate > 0)
    .sort((a, b) => b.rate - a.rate)[0] || null;

  const now = new Date();
  const unmanagedLeads = leads.filter((l) => {
    if (l.status !== 'new' || !l.created_at) return false;
    return (now - new Date(l.created_at)) / 86400000 > 3;
  });

  // ── Negocio data ───────────────────────────────────────────────────────────
  const tn = t.dashboard.negocio;
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const MRR = activeSubscriptions.reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  const uniqueActiveClients = new Set(
    activeSubscriptions.map((s) => s.client?.name).filter(Boolean)
  ).size;
  const ARPU = uniqueActiveClients > 0 ? (MRR / uniqueActiveClients).toFixed(0) : 0;

  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const pendingAmount   = pendingInvoices.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  const upcomingRenewals = activeSubscriptions.filter((s) => {
    if (!s.next_billing_date) return false;
    const diffDays = (new Date(s.next_billing_date) - now) / 86400000;
    return diffDays >= 0 && diffDays <= 15;
  });

  // ── Greeting ───────────────────────────────────────────────────────────────
  const greeting  = getGreeting(t);
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || '';

  return (
    <div className="space-y-6">

      {/* ══ GREETING HEADER ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[#1B86C9] text-[12px] font-bold uppercase tracking-[0.08em] mb-1">
            {greeting}{firstName ? `, ${firstName}` : ''}
          </p>
          <h1 className="text-[30px] font-bold text-crm-text leading-tight">
            {t.dashboard.panel_title || 'Panel de control'}
          </h1>
          <p className="text-sm text-[#64748B] mt-1 capitalize">{formatDate()}</p>
        </div>

        {/* Quick-action buttons in dashboard header */}
        <div className="flex flex-wrap gap-2 sm:justify-end sm:flex-shrink-0">
          <button onClick={onNewLead}
            className="flex items-center gap-1.5 bg-white text-gray-700 border border-crm-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.actions.new_lead}
          </button>
          <button onClick={onNewClient}
            className="flex items-center gap-1.5 bg-white text-gray-700 border border-crm-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.actions.add_client}
          </button>
          <button onClick={onNewSub}
            className="flex items-center gap-1.5 bg-crm-accent text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.actions.subscription}
          </button>
          <button onClick={onNewInvoice}
            className="flex items-center gap-1.5 bg-navy text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.actions.invoice}
          </button>
        </div>
      </div>

      {/* ══ 4-KPI SUMMARY ROW ════════════════════════════════════════════════ */}
      {/* Mobile: stacked single column | Tablet: 2×2 | Desktop: 4-across */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Nuevos leads */}
        <SummaryKpiCard
          label={t.dashboard.kpi_new_leads || 'Nuevos leads'}
          value={thisMonthLeads}
          icon={<IconLeads />}
          trend={momPct}
          trendLabel={momPct !== null ? `${momPct > 0 ? '+' : ''}${momPct}%` : undefined}
        />

        {/* Clientes activos */}
        <SummaryKpiCard
          label={t.dashboard.kpi_active_clients || 'Clientes activos'}
          value={uniqueActiveClients}
          icon={<IconClients />}
        />

        {/* Suscripciones activas */}
        <SummaryKpiCard
          label={t.dashboard.kpi_active_subs || 'Suscripciones activas'}
          value={activeSubscriptions.length}
          icon={<IconSubs />}
        />

        {/* Facturas pendientes — 0 = all-clear (neutral), >0 = attention */}
        <SummaryKpiCard
          label={t.dashboard.kpi_pending_invoices || 'Facturas pendientes'}
          value={pendingInvoices.length}
          icon={<IconInvoice />}
          trend={pendingInvoices.length === 0 ? 0 : undefined}
          trendLabel={
            pendingInvoices.length === 0
              ? (t.dashboard.kpi_pending_none || 'Ninguna pendiente')
              : undefined
          }
          neutral={pendingInvoices.length === 0}
        />
      </div>

      {/* ══ SECCIÓN 1: ADQUISICIÓN ════════════════════════════════════════════ */}
      <div className="space-y-3">
        <SectionHeader
          title={ta.title}
          subtitle={ta.subtitle}
          isOpen={open.adquisicion}
          onToggle={() => toggle('adquisicion')}
        />
        {open.adquisicion && (
          <div className="space-y-4 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      </div>

      {/* ══ SECCIÓN 2: CONVERSIÓN ════════════════════════════════════════════ */}
      <div className="space-y-3">
        <SectionHeader
          title={tc.title}
          subtitle={tc.subtitle}
          isOpen={open.conversion}
          onToggle={() => toggle('conversion')}
          alertCount={unmanagedLeads.length}
        />
        {open.conversion && (
          <div className="space-y-4 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard label={tc.kpi_rate}         value={`${globalRate}%`} color="text-green-600" />
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
                  {unmanagedLeads.slice(0, 3).map((l) => (
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
      </div>

      {/* ══ SECCIÓN 3: NEGOCIO ═══════════════════════════════════════════════ */}
      <div className="space-y-3">
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
              <KpiCard label={tn.kpi_mrr}     value={`€${MRR.toFixed(0)}`}              sub={tn.kpi_mrr_sub}   color="text-cyan" />
              <KpiCard label={tn.kpi_active}  value={uniqueActiveClients}                                       color="text-green-600" />
              <KpiCard label={tn.kpi_arpu}    value={`€${ARPU}`}                         sub={tn.kpi_arpu_sub} />
              <KpiCard
                label={tn.kpi_pending}
                value={`€${pendingAmount.toFixed(0)}`}
                color={pendingAmount > 0 ? 'text-orange-500' : 'text-gray-400'}
              />
            </div>

            {upcomingRenewals.length > 0 && (
              <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <span className="text-orange-500 text-lg mt-0.5">🔔</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-700 mb-2">
                    {upcomingRenewals.length} {tn.renewal_alert}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {upcomingRenewals.map((s) => {
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
              <MRRByPlan      subscriptions={subscriptions} />
              <MRRGrowthChart subscriptions={subscriptions} />
            </div>

            <ChurnRateCard subscriptions={subscriptions} />
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardView;
