import { Badge, STATUS_BADGE } from '../shared';
import { useAdminT } from '../../../context/AdminLangContext';

const TYPE_BADGE = {
  setup:   'bg-purple-100 text-purple-700',
  monthly: 'bg-blue-100 text-blue-700',
  extra:   'bg-gray-100 text-gray-600',
};

const InvoicesView = ({ invoices, onMarkPaid }) => {
  const { t } = useAdminT();
  const ti = t.invoices;
  const headers = Object.values(ti.headers);
  const pending = invoices.filter(i => i.status === 'pending');
  const pendingAmount = pending.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 inline-flex gap-6">
        <div>
          <p className="text-xs text-gray-500">{ti.kpi_pending_amount}</p>
          <p className="text-2xl font-bold text-orange-500">€{pendingAmount.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{ti.kpi_pending_count}</p>
          <p className="text-2xl font-bold text-navy">{pending.length}</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr><td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500">{ti.empty}</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.client?.name || '—'}</td>
                  <td className="px-6 py-4"><Badge value={inv.type} map={TYPE_BADGE} /></td>
                  <td className="px-6 py-4 font-medium text-navy">€{inv.amount}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{inv.due_date}</td>
                  <td className="px-6 py-4"><Badge value={inv.status} map={STATUS_BADGE} /></td>
                  <td className="px-6 py-4">
                    {inv.status === 'pending' && (
                      <button onClick={() => onMarkPaid(inv.id)}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition">
                        {ti.mark_paid}
                      </button>
                    )}
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

export default InvoicesView;