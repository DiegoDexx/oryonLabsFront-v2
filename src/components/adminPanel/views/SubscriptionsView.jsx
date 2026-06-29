import { useState } from 'react';
import { Badge, PLAN_BADGE, STATUS_BADGE } from '../shared';
import Modal from '../../ui/Modal';
import { useAdminT } from '../../../context/AdminLangContext';

const formatDate = (d, locale = 'es-ES') => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32 flex-shrink-0">{label}</span>
    <span className="text-sm text-gray-800 text-right">{value ?? '—'}</span>
  </div>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SubscriptionsView = ({ subscriptions, onStatusChange }) => {
  const { t, lang } = useAdminT();
  const ts = t.subscriptions;
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  const [viewTarget, setViewTarget] = useState(null);

  const MRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  const headers = Object.values(ts.headers);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 inline-flex gap-6">
        <div>
          <p className="text-xs text-gray-500">{ts.kpi_mrr}</p>
          <p className="text-2xl font-bold text-cyan">€{MRR.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{ts.kpi_active}</p>
          <p className="text-2xl font-bold text-green-600">
            {subscriptions.filter(s => s.status === 'active').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map(h => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{h}</th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.length === 0 ? (
                <tr><td colSpan={headers.length + 1} className="px-6 py-12 text-center text-gray-500">{ts.empty}</td></tr>
              ) : subscriptions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{s.client?.name || '—'}</td>
                  <td className="px-6 py-4"><Badge value={s.plan} map={PLAN_BADGE} /></td>
                  <td className="px-6 py-4 text-gray-600">€{s.setup_fee}</td>
                  <td className="px-6 py-4 text-gray-600">€{s.monthly_fee}{ts.per_month}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.start_date}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.next_billing_date || '—'}</td>
                  <td className="px-6 py-4"><Badge value={s.status} map={STATUS_BADGE} /></td>
                  <td className="px-6 py-4">
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600"
                      value={s.status} onChange={e => onStatusChange(s.id, e.target.value)}>
                      {['active', 'paused', 'cancelled', 'pending'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewTarget(s)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      title="Ver detalle"
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription detail modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={ts.detail.title}>
        {viewTarget && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm flex-shrink-0">
                {(viewTarget.client?.name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy text-base leading-tight">{viewTarget.client?.name || '—'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{viewTarget.client?.email || '—'}</p>
              </div>
              <Badge value={viewTarget.status} map={STATUS_BADGE} />
            </div>

            {/* Plan badge */}
            <div className="flex items-center gap-2">
              <Badge value={viewTarget.plan} map={PLAN_BADGE} />
              {viewTarget.status === 'active' && (
                <span className="text-xs text-green-600 font-medium">{ts.detail.active}</span>
              )}
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 divide-y divide-gray-100">
              <DetailRow label={ts.detail.setup}        value={viewTarget.setup_fee    ? `€${viewTarget.setup_fee}` : null} />
              <DetailRow label={ts.detail.monthly}      value={viewTarget.monthly_fee  ? `€${viewTarget.monthly_fee}/mes` : null} />
              <DetailRow label={ts.detail.start}        value={formatDate(viewTarget.start_date, locale)} />
              <DetailRow label={ts.detail.next_billing} value={formatDate(viewTarget.next_billing_date, locale)} />
              <DetailRow label={ts.detail.end_date}     value={formatDate(viewTarget.end_date, locale)} />
              {viewTarget.notes && (
                <div className="py-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{ts.detail.notes}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{viewTarget.notes}</p>
                </div>
              )}
            </div>

            {/* MRR contribution */}
            {viewTarget.status === 'active' && viewTarget.monthly_fee && (
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-green-700">{ts.detail.mrr_contribution}</span>
                <span className="text-lg font-bold text-green-700">€{parseFloat(viewTarget.monthly_fee).toFixed(0)}/mes</span>
              </div>
            )}

            <button
              onClick={() => setViewTarget(null)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              {t.common.close}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionsView;
