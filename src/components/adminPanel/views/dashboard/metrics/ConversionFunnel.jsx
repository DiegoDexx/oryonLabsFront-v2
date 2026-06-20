import { useAdminT } from '../../../../../context/AdminLangContext';

const FUNNEL_STAGES = ['new', 'contacted', 'qualified', 'converted'];

const FUNNEL_COLORS = {
  new:       { bar: 'bg-blue-400',   pill: 'bg-blue-50 text-blue-700'     },
  contacted: { bar: 'bg-yellow-400', pill: 'bg-yellow-50 text-yellow-700' },
  qualified: { bar: 'bg-orange-400', pill: 'bg-orange-50 text-orange-700' },
  converted: { bar: 'bg-green-500',  pill: 'bg-green-50 text-green-700'   },
};

const ConversionFunnel = ({ leads }) => {
  const { t } = useAdminT();
  const td = t.dashboard.ventas.funnel;

  const total     = leads.length;
  const discarded = leads.filter(l => l.status === 'discarded').length;

  const counts = FUNNEL_STAGES.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-navy">{td.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{td.subtitle}</p>
        </div>
        {discarded > 0 && (
          <span className="text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
            {discarded} {td.discarded_label}
          </span>
        )}
      </div>

      {total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">{td.empty}</p>
      ) : (
        <div className="space-y-1">
          {FUNNEL_STAGES.map((stage, i) => {
            const count    = counts[stage];
            const pct      = total > 0 ? Math.round((count / total) * 100) : 0;
            const barWidth = Math.round((count / maxCount) * 100);
            const prev     = i > 0 ? counts[FUNNEL_STAGES[i - 1]] : null;
            const dropOff  = prev !== null && prev > 0
              ? Math.round(((prev - count) / prev) * 100)
              : null;
            const cfg = FUNNEL_COLORS[stage];

            return (
              <div key={stage}>
                {dropOff !== null && (
                  <div className="flex items-center gap-2 py-1.5 pl-1">
                    <div className="w-px h-3 bg-gray-200 ml-1" />
                    <span className="text-[11px] font-medium text-red-400">
                      ↓ -{dropOff}% {td.drop_off}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-24 flex-shrink-0 text-right">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                      {td.stages[stage]}
                    </span>
                  </div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${cfg.bar} flex items-center justify-end pr-3`}
                      style={{ width: `${Math.max(barWidth, count > 0 ? 6 : 0)}%` }}
                    >
                      {count > 0 && barWidth > 15 && (
                        <span className="text-white text-xs font-bold">{count}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-14 flex-shrink-0 flex items-center justify-end gap-1">
                    {count > 0 && barWidth <= 15 && (
                      <span className="text-sm font-bold text-gray-700">{count}</span>
                    )}
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversionFunnel;
