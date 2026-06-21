import { useAdminT } from '../../../../../context/AdminLangContext';
import { getMonthKey, getLastNMonths, growthPct } from './helpers';
import { TrendBadge, VerticalBars } from './primitives';

const LeadCaptureTrend = ({ leads }) => {
  const { t, lang } = useAdminT();
  const td = t.dashboard.marketing.capture_trend;
  const months = getLastNMonths(6, lang);

  const capturedByMonth = leads
    .filter(l => l.created_at)
    .reduce((acc, l) => {
      const k = getMonthKey(l.created_at);
      if (k) acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

  const data = months.map(m => ({ ...m, value: capturedByMonth[m.key] || 0 }));
  const thisMonth = data[data.length - 1]?.value ?? 0;
  const prevMonth = data[data.length - 2]?.value ?? 0;
  const trend = growthPct(thisMonth, prevMonth);
  const total = leads.length;

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
          <p className="text-2xl font-bold text-navy">{thisMonth}</p>
          <p className="text-xs text-gray-400">{td.this_month}</p>
        </div>
        <div className="border-l border-gray-100 pl-6">
          <p className="text-2xl font-bold text-cyan">{total}</p>
          <p className="text-xs text-gray-400">{td.total_label}</p>
        </div>
      </div>

      <VerticalBars data={data} barClass="bg-cyan" valueFormatter={v => v > 0 ? v : null} />
    </div>
  );
};

export default LeadCaptureTrend;
