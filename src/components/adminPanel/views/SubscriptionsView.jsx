import { useState } from 'react';
import { Badge, PLAN_BADGE, PLAN_LABEL, STATUS_BADGE } from '../shared';
import Modal from '../../ui/Modal';
import { useAdminT } from '../../../context/AdminLangContext';
import { apiDeleteSubscription } from '../../../api/apiActions';

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

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SubscriptionsView = ({ subscriptions, onStatusChange, token, onDeleteSubscription }) => {
  const { t, lang } = useAdminT();
  const ts = t.subscriptions;
  const cd = t.confirm_delete;
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';

  const [viewTarget,   setViewTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState(null);

  const openDelete  = (s) => { setDeleteError(null); setDeleteTarget(s); };
  const closeDelete = () => { setDeleteTarget(null); setDeleteError(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiDeleteSubscription(token, deleteTarget.id);
      onDeleteSubscription(deleteTarget.id);
      closeDelete();
    } catch (err) {
      setDeleteError(err.message || t.common.unexpected_error);
    } finally {
      setDeleting(false);
    }
  };

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
                  <td className="px-6 py-4"><Badge value={s.plan} label={PLAN_LABEL[s.plan] || s.plan} map={PLAN_BADGE} /></td>
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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewTarget(s)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalle"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => openDelete(s)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title={ts.delete_btn}
                      >
                        <TrashIcon />
                      </button>
                    </div>
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

            <div className="flex items-center gap-2">
              <Badge value={viewTarget.plan} label={PLAN_LABEL[viewTarget.plan] || viewTarget.plan} map={PLAN_BADGE} />
              {viewTarget.status === 'active' && (
                <span className="text-xs text-green-600 font-medium">{ts.detail.active}</span>
              )}
            </div>

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

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteTarget} onClose={closeDelete} title={cd.title}>
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-navy text-lg">
                {cd.prefix} <span className="text-red-500">{PLAN_LABEL[deleteTarget.plan] || deleteTarget.plan}</span>?
              </p>
              <p className="text-sm text-gray-500">{deleteTarget.client?.name}</p>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-600 text-xs">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={closeDelete}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                {t.common.cancel}
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition">
                {deleting ? cd.deleting : cd.confirm}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionsView;
