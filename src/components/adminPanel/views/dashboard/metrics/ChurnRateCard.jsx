import { useAdminT } from '../../../../../context/AdminLangContext';

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

export default ChurnRateCard;
