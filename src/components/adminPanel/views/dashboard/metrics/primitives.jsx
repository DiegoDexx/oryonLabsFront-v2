// ── Summary KPI card (top row of a view) ────────────────────────────────────

export const SummaryKpiCard = ({ label, value, icon, trend, trendLabel, neutral }) => (
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

// ── Detail KPI card (inside collapsible sections / generic view stat) ───────

export const KpiCard = ({ label, value, sub, color = 'text-navy', badge }) => (
  <div className="bg-white rounded-xl border border-crm-border p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      {badge}
    </div>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export const TrendBadge = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-xs text-gray-400">—</span>;
  if (value > 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ +{value}%</span>;
  if (value < 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">↓ {value}%</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">→ 0%</span>;
};

export const RangeToggle = ({ value, onChange, labelAll, labelMonth }) => (
  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
    {[['all', labelAll], ['month', labelMonth]].map(([val, lbl]) => (
      <button key={val} onClick={() => onChange(val)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${value === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
        {lbl}
      </button>
    ))}
  </div>
);

export const VerticalBars = ({ data, barClass, valueFormatter = (v) => v || '—' }) => {
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
