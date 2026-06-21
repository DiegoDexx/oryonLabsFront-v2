import { useAdminT } from '../../../../../context/AdminLangContext';
import { getMonthKey, getLastNMonths, growthPct } from './helpers';
import { TrendBadge, VerticalBars } from './primitives';

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

export default LeadsConvertedTrend;
