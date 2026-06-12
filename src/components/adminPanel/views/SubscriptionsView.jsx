import { Badge, PLAN_BADGE, STATUS_BADGE } from '../shared';

const HEADERS = ['Empresa', 'Plan', 'Setup', 'Mensualidad', 'Inicio', 'Próx. factura', 'Estado', 'Acción'];

const SubscriptionsView = ({ subscriptions, onStatusChange }) => {
  const MRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 inline-flex gap-6">
        <div>
          <p className="text-xs text-gray-500">MRR Total</p>
          <p className="text-2xl font-bold text-cyan">€{MRR.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Suscripciones activas</p>
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
                {HEADERS.map(h => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.length === 0 ? (
                <tr><td colSpan={HEADERS.length} className="px-6 py-12 text-center text-gray-500">Sin suscripciones</td></tr>
              ) : subscriptions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{s.client?.name || '—'}</td>
                  <td className="px-6 py-4"><Badge value={s.plan} map={PLAN_BADGE} /></td>
                  <td className="px-6 py-4 text-gray-600">€{s.setup_fee}</td>
                  <td className="px-6 py-4 text-gray-600">€{s.monthly_fee}/mes</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.start_date}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.next_billing_date || '—'}</td>
                  <td className="px-6 py-4"><Badge value={s.status} map={STATUS_BADGE} /></td>
                  <td className="px-6 py-4">
                    <select
                      className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600"
                      value={s.status}
                      onChange={e => onStatusChange(s.id, e.target.value)}
                    >
                      {['active', 'paused', 'cancelled', 'pending'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsView;