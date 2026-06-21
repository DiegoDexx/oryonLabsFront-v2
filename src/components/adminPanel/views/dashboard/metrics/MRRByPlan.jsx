import { useAdminT } from '../../../../../context/AdminLangContext';

const PLAN_COLORS = {
  starter:      { bar: 'bg-gray-400',   pill: 'bg-gray-100 text-gray-700'     },
  pro:          { bar: 'bg-cyan',        pill: 'bg-cyan/10 text-cyan'          },
  professional: { bar: 'bg-blue-500',   pill: 'bg-blue-100 text-blue-700'     },
  voice_ai:     { bar: 'bg-purple-500', pill: 'bg-purple-100 text-purple-700' },
};

const MRRByPlan = ({ subscriptions }) => {
  const { t } = useAdminT();
  const td = t.dashboard.negocio;

  const active = subscriptions.filter(s => s.status === 'active');
  const totalMRR = active.reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  const byPlan = active.reduce((acc, s) => {
    const plan = (s.plan || 'unknown').toLowerCase();
    if (!acc[plan]) acc[plan] = { mrr: 0, count: 0 };
    acc[plan].mrr   += parseFloat(s.monthly_fee || 0);
    acc[plan].count += 1;
    return acc;
  }, {});

  const rows = Object.entries(byPlan)
    .map(([plan, { mrr, count }]) => ({
      plan,
      mrr,
      count,
      pct: totalMRR > 0 ? Math.round((mrr / totalMRR) * 100) : 0,
    }))
    .sort((a, b) => b.mrr - a.mrr);

  // concentration risk: % MRR from a single client
  const mrrByClient = active.reduce((acc, s) => {
    const name = s.client?.name || 'unknown';
    acc[name] = (acc[name] || 0) + parseFloat(s.monthly_fee || 0);
    return acc;
  }, {});
  const topClientMRR  = Math.max(...Object.values(mrrByClient), 0);
  const topClientPct  = totalMRR > 0 ? Math.round((topClientMRR / totalMRR) * 100) : 0;
  const showRiskAlert = topClientPct >= 80 && Object.keys(mrrByClient).length === 1;

  const maxMRR = rows[0]?.mrr || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-semibold text-navy mb-5">{td.mrr_by_plan_title}</h3>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{td.mrr_by_plan_empty}</p>
      ) : (
        <div className="space-y-4">
          {rows.map(({ plan, mrr, count, pct }) => {
            const cfg = PLAN_COLORS[plan] || { bar: 'bg-gray-300', pill: 'bg-gray-100 text-gray-600' };
            return (
              <div key={plan}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${cfg.pill}`}>
                      {plan.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{count} sub{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{pct}%</span>
                    <span className="text-sm font-bold text-navy">€{mrr.toFixed(0)}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                    style={{ width: `${Math.round((mrr / maxMRR) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {showRiskAlert && (
            <div className="mt-4 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
              <span className="text-orange-500 text-sm">⚠️</span>
              <p className="text-xs text-orange-700 font-medium">
                {topClientPct}% {td.concentration_label}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MRRByPlan;
