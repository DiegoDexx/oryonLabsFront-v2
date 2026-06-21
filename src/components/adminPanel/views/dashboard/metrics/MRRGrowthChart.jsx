import { useAdminT } from '../../../../../context/AdminLangContext';
import { getMonthKey, getLastNMonths, growthPct } from './helpers';
import { TrendBadge, VerticalBars } from './primitives';

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

export default MRRGrowthChart;
