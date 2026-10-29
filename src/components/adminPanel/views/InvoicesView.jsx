import { useState, useCallback } from 'react';
import { Badge, STATUS_BADGE } from '../shared';
import { useAdminT } from '../../../context/AdminLangContext';
import PdfPreviewModal from '../PdfPreviewModal';
import { apiGetInvoicePdfUrl, apiSendInvoice, apiSendWhatsAppDocument } from '../../../api/apiActions';

// client_invoices: estados draft/sent/paid/overdue. "Pendiente de cobro"
// = todo lo no pagado (draft + sent + overdue).
const UNPAID = ['draft', 'sent', 'overdue'];

const InvoicesView = ({ invoices, onMarkPaid, token }) => {
  const { t } = useAdminT();
  const ti = t.invoices;
  const headers = Object.values(ti.headers);
  const pending = invoices.filter(i => UNPAID.includes(i.status));
  const pendingAmount = pending.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  const [preview, setPreview] = useState(null); // factura abierta en el visor
  const openPreview = useCallback((inv) => setPreview(inv), []);
  const closePreview = useCallback(() => setPreview(null), []);
  const phoneOf = (inv) => inv.client?.phone || null;

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
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {inv.trade_job_id ? `#${inv.trade_job_id}` : (ti.direct || 'Direct')}
                  </td>
                  <td className="px-6 py-4 font-medium text-navy">€{inv.amount}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{inv.due_date}</td>
                  <td className="px-6 py-4"><Badge value={inv.status} map={STATUS_BADGE} /></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => openPreview(inv)}
                        className="text-xs bg-navy text-white px-2.5 py-1.5 rounded-lg hover:opacity-90 transition">
                        {ti.preview_send || 'Preview & send'}
                      </button>
                      {inv.status !== 'paid' && (
                        <button onClick={() => onMarkPaid(inv.id)}
                          className="text-xs bg-green-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-600 transition">
                          {ti.mark_paid}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <PdfPreviewModal
          isOpen={!!preview}
          onClose={closePreview}
          title={preview.invoice_number || `Invoice #${preview.id}`}
          loadPdfUrl={() => apiGetInvoicePdfUrl(token, preview.id)}
          sendEmail={() => apiSendInvoice(token, preview.id)}
          sendWhatsApp={phoneOf(preview) ? () => apiSendWhatsAppDocument({
            doc_type: 'client_invoice',
            doc_id: preview.id,
            phone: phoneOf(preview),
            name: preview.client?.name || '',
          }) : null}
          whatsappAvailable={!!phoneOf(preview)}
        />
      )}
    </div>
  );
};

export default InvoicesView;