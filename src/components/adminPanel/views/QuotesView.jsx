import { useState, useCallback } from "react";
import { Badge, STATUS_BADGE } from "../shared";
import { useAdminT } from "../../../context/AdminLangContext";
import PdfPreviewModal from "../PdfPreviewModal";
import {
  apiGetQuotePdfUrl,
  apiSendQuote,
  apiSendWhatsAppDocument,
} from "../../../api/apiActions";

const QUOTE_BADGE = {
  draft:    "bg-gray-100 text-gray-600",
  sent:     "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired:  "bg-orange-100 text-orange-700",
};

const formatAmount = (q) => {
  if (q.amount_fixed != null) return `€${q.amount_fixed}`;
  const min = q.amount_min != null ? `€${q.amount_min}` : "—";
  const max = q.amount_max != null ? `€${q.amount_max}` : "—";
  return `${min} – ${max}`;
};

const QuotesView = ({ quotes, token, onRefresh }) => {
  const { t } = useAdminT();
  const tq = t.quotes || {};
  const headers = Object.values(tq.headers || {
    number: "Nº Quote", lead: "Lead", amount: "Amount", status: "Status", date: "Date", actions: "Actions",
  });

  const [preview, setPreview] = useState(null); // quote abierta en el visor

  const openPreview = useCallback((quote) => setPreview(quote), []);
  const closePreview = useCallback(() => setPreview(null), []);

  const leadOf = (q) => q.lead || {};
  const phoneOf = (q) => leadOf(q).phone || leadOf(q).mobile || null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {tq.empty || "No quotes yet"}
                  </td>
                </tr>
              ) : quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 font-medium text-navy text-sm">{q.quote_number || `#${q.id}`}</td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 text-sm">
                    {leadOf(q).name || leadOf(q).email || "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 font-medium text-navy text-sm">{formatAmount(q)}</td>
                  <td className="px-4 sm:px-6 py-3"><Badge value={q.status} map={{ ...STATUS_BADGE, ...QUOTE_BADGE }} /></td>
                  <td className="px-4 sm:px-6 py-3 text-gray-500 text-xs">
                    {q.created_at ? new Date(q.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button
                      onClick={() => openPreview(q)}
                      className="text-xs bg-navy text-white px-2.5 py-1.5 rounded-lg hover:opacity-90 transition"
                    >
                      {tq.preview_send || "Preview & send"}
                    </button>
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
          title={preview.quote_number || `Quote #${preview.id}`}
          loadPdfUrl={() => apiGetQuotePdfUrl(token, preview.id)}
          sendEmail={async () => { await apiSendQuote(token, preview.id); onRefresh?.(); }}
          sendWhatsApp={phoneOf(preview) ? async () => apiSendWhatsAppDocument({
            doc_type: "quote",
            doc_id: preview.id,
            phone: phoneOf(preview),
            name: leadOf(preview).name || "",
          }) : null}
          whatsappAvailable={!!phoneOf(preview)}
        />
      )}
    </div>
  );
};

export default QuotesView;
