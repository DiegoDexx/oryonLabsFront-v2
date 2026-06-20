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
