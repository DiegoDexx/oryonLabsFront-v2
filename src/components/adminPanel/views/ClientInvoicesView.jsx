import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useAdminT } from "../../../context/AdminLangContext";
import {
  apiDeleteClientInvoice,
  apiDownloadClientInvoicePdf,
  apiGetPdfBlobUrl,
  apiMarkClientInvoicePaid,
  apiSendClientInvoice,
  apiSendWhatsAppDocument,
} from "../../../api/apiActions";
import Modal from "../../ui/Modal";
import PdfPreviewModal from "../PdfPreviewModal";
import CreateClientInvoiceModal from "../modals/CreateClientInvoiceModal";
import EditClientInvoiceModal from "../modals/EditClientInvoiceModal";
import {
  CLIENT_INVOICE_STATUSES,
  CLIENT_INVOICE_STATUS_COLOR,
  PAYMENT_METHOD_SUGGESTIONS,
  canDeleteInvoice,
  canEditInvoice,
  canMarkInvoicePaid,
  canSendInvoice,
  clientInvoiceErrorMessage,
  formatGBP,
  invoiceClientName,
  invoiceDestinationEmail,
} from "../billing";

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ErrorBox = ({ message }) => message ? (
  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
    <p className="text-red-600 text-xs whitespace-pre-line">{message}</p>
  </div>
) : null;

const ClientInvoicesView = ({ invoices, loading, error, token, clients, onRetry, onRefresh, onToast }) => {
  const { t, lang } = useAdminT();
  const ti = t.client_invoices;
  const fl = t.billing.fields;

  const [filterStatus, setFilterStatus] = useState("");
  const [refreshing, setRefreshing]     = useState(false);
  const [showCreate, setShowCreate]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [pdfBusy, setPdfBusy]           = useState(null);
  const [previewInv, setPreviewInv]     = useState(null); // factura abierta en el visor PDF

  // Acciones con confirmación: { type: 'send' | 'delete' | 'paid', invoice }
  const [action, setAction]             = useState(null);
  const [actionBusy, setActionBusy]     = useState(false);
  const [actionError, setActionError]   = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const formatDate = (value) => {
    if (!value) return "—";
    const locale = lang === "en" ? "en-GB" : "es-ES";
    return new Date(value).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  };

  const errorMessage = (err) => clientInvoiceErrorMessage(err, ti, fl) || t.common.unexpected_error;

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await onRefresh(); }
    finally { setRefreshing(false); }
  };

  const openAction = (type, invoice) => {
    setActionError(null);
    setPaymentMethod(invoice.payment_method ?? "");
    setAction({ type, invoice });
  };
  const closeAction = () => { if (!actionBusy) { setAction(null); setActionError(null); } };

  const handleConfirmAction = async () => {
    if (!action) return;
    const { type, invoice } = action;
    setActionBusy(true);
    setActionError(null);
    try {
      if (type === "send")   await apiSendClientInvoice(token, invoice.id);
      if (type === "delete") await apiDeleteClientInvoice(token, invoice.id);
      if (type === "paid")   await apiMarkClientInvoicePaid(token, invoice.id, paymentMethod.trim() || null);
      setAction(null);
      onToast({ send: t.toasts.client_invoice_sent, delete: t.toasts.client_invoice_deleted, paid: t.toasts.client_invoice_paid }[type]);
      onRefresh();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setActionBusy(false);
    }
  };

  const handleDownload = async (invoice) => {
    setPdfBusy(invoice.id);
    try {
      await apiDownloadClientInvoicePdf(token, invoice.id, invoice.invoice_number);
    } catch (err) {
      onToast(`${ti.pdf_error}: ${errorMessage(err)}`, "error");
    } finally {
      setPdfBusy(null);
    }
  };

  // ── Estados de carga / error / vacío ──────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        {ti.loading}
      </div>
    );
  }

  // Un fallo de carga (401/403/500…) nunca debe parecer "sin facturas".
  if (error) {
    const moduleMissing = error.data?.error === "module_not_available";
    return (
      <div className={`${moduleMissing ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"} border rounded-xl p-6 text-center space-y-3`}>
        <p className={`text-sm font-semibold ${moduleMissing ? "text-amber-800" : "text-red-700"}`}>
          {moduleMissing ? ti.module_unavailable : ti.load_error}
        </p>
        {!moduleMissing && (
          <>
            <p className="text-xs text-red-600">{error.status ? `${error.status} · ${error.message}` : error.message}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-medium hover:bg-red-100 transition"
            >
              {ti.retry}
            </button>
          </>
        )}
      </div>
    );
  }

  const filtered = filterStatus ? invoices.filter((i) => i.status === filterStatus) : invoices;

  const iconBtn = "p-1.5 text-gray-400 rounded-lg transition disabled:opacity-40";

  const columns = [
    { field: "invoice_number", headerName: ti.headers.number, flex: 1, minWidth: 150 },
    { field: "clientName",     headerName: ti.headers.client, flex: 1.4, minWidth: 160 },
    {
      field: "amount",
      headerName: ti.headers.amount,
      width: 120,
      type: "number",
      valueFormatter: (value) => formatGBP(value),
    },
    {
      field: "status",
      headerName: ti.headers.status,
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          color={CLIENT_INVOICE_STATUS_COLOR[params.value] ?? "default"}
          label={ti.statuses[params.value] ?? params.value}
        />
      ),
    },
    { field: "created_at", headerName: ti.headers.issued, width: 130, valueFormatter: (value) => formatDate(value) },
    { field: "due_date",   headerName: ti.headers.due,    width: 130, valueFormatter: (value) => formatDate(value) },
    {
      field: "actions",
      headerName: ti.headers.actions,
      width: 190,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const inv = params.row.raw;
        return (
          <div className="flex items-center gap-1 h-full">
            <button
              onClick={() => setPreviewInv(inv)}
              className={`${iconBtn} hover:text-cyan hover:bg-cyan/10`}
              title={ti.actions?.preview_send || "Preview & send"}
            >
              <EyeIcon />
            </button>
            <button
              onClick={() => handleDownload(inv)}
              disabled={pdfBusy === inv.id}
              className={`${iconBtn} hover:text-navy hover:bg-gray-100`}
              title={ti.actions.pdf}
            >
              <DownloadIcon />
            </button>
            {canSendInvoice(inv) && (
              <button onClick={() => openAction("send", inv)} className={`${iconBtn} hover:text-blue-500 hover:bg-blue-50`} title={ti.actions.send}>
                <SendIcon />
              </button>
            )}
            {canEditInvoice(inv) && (
              <button onClick={() => setEditTarget(inv)} className={`${iconBtn} hover:text-cyan hover:bg-cyan/10`} title={ti.actions.edit}>
                <PencilIcon />
              </button>
            )}
            {canMarkInvoicePaid(inv) && (
              <button onClick={() => openAction("paid", inv)} className={`${iconBtn} hover:text-green-600 hover:bg-green-50`} title={ti.actions.mark_paid}>
                <CheckIcon />
              </button>
            )}
            {canDeleteInvoice(inv) && (
              <button onClick={() => openAction("delete", inv)} className={`${iconBtn} hover:text-red-500 hover:bg-red-50`} title={ti.actions.delete}>
                <TrashIcon />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const rows = filtered.map((inv) => ({
    id:             inv.id,
    invoice_number: inv.invoice_number ?? `#${inv.id}`,
    clientName:     invoiceClientName(inv),
    amount:         inv.amount === null || inv.amount === undefined ? null : Number(inv.amount),
    status:         inv.status,
    created_at:     inv.created_at,
    due_date:       inv.due_date,
    raw:            inv,
  }));

  const sendEmail = action?.type === "send" ? invoiceDestinationEmail(action.invoice) : null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
          >
            <option value="">{ti.filter_all}</option>
            {CLIENT_INVOICE_STATUSES.map((s) => <option key={s} value={s}>{ti.statuses[s]}</option>)}
          </select>

          <div className="ml-auto flex items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">{filtered.length} / {invoices.length}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              <RefreshIcon spinning={refreshing} />
              {refreshing ? t.common.refreshing : t.common.refresh}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {ti.new_btn}
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            {invoices.length === 0 ? ti.empty : ti.empty_filtered}
          </div>
        ) : (
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
              sx={{ border: 0 }}
            />
          </Box>
        )}
      </div>

      {/* Confirmación: enviar / marcar pagada / eliminar */}
      <Modal
        isOpen={!!action}
        onClose={closeAction}
        title={action ? ti[action.type === "paid" ? "mark_paid" : action.type].title : ""}
      >
        {action && (
          <div className="space-y-5">
            {action.type === "send" && (
              <p className="text-sm text-gray-700 text-center">
                {sendEmail
                  ? ti.send.question.replace("{number}", action.invoice.invoice_number).replace("{email}", sendEmail)
                  : ti.send.question_no_email.replace("{number}", action.invoice.invoice_number)}
              </p>
            )}

            {action.type === "delete" && (
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
                </div>
                <p className="font-semibold text-navy text-lg">
                  {ti.delete.question_prefix} <span className="text-red-500">{action.invoice.invoice_number}</span>?
                </p>
                <p className="text-sm text-gray-500">{ti.delete.warning}</p>
              </div>
            )}

            {action.type === "paid" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  {ti.mark_paid.question.replace("{number}", action.invoice.invoice_number)}
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{ti.modal.payment_method}</label>
                  <input
                    type="text"
                    list="client-invoice-payment-methods"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder={ti.modal.payment_method_placeholder}
                    maxLength={50}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                  />
                  <datalist id="client-invoice-payment-methods">
                    {PAYMENT_METHOD_SUGGESTIONS.map((m) => <option key={m} value={m} />)}
                  </datalist>
                </div>
              </div>
            )}

            <ErrorBox message={actionError} />

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeAction}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={actionBusy}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50 transition ${
                  action.type === "delete" ? "bg-red-500 hover:bg-red-600"
                  : action.type === "paid" ? "bg-green-500 hover:bg-green-600"
                  : "bg-cyan hover:bg-cyan-medium"
                }`}
              >
                {(() => {
                  const tx = ti[action.type === "paid" ? "mark_paid" : action.type];
                  return actionBusy ? tx.busy : tx.confirm;
                })()}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CreateClientInvoiceModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        token={token}
        clients={clients}
        invoices={invoices}
        onSuccess={() => { setShowCreate(false); onToast(t.toasts.client_invoice_created); onRefresh(); }}
      />

      <EditClientInvoiceModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        token={token}
        invoice={editTarget}
        clients={clients}
        onSuccess={() => { setEditTarget(null); onToast(t.toasts.client_invoice_updated); onRefresh(); }}
      />

      {previewInv && (
        <PdfPreviewModal
          isOpen={!!previewInv}
          onClose={() => setPreviewInv(null)}
          title={previewInv.invoice_number || `Invoice #${previewInv.id}`}
          loadPdfUrl={() => apiGetPdfBlobUrl(token, `/api/client-invoices/${previewInv.id}/pdf`)}
          sendEmail={() => apiSendClientInvoice(token, previewInv.id)}
          sendWhatsApp={(previewInv.client?.phone || previewInv.bill_to?.phone) ? () => apiSendWhatsAppDocument({
            doc_type: "client_invoice",
            doc_id: previewInv.id,
            phone: previewInv.client?.phone || previewInv.bill_to?.phone,
            name: invoiceClientName(previewInv) || "",
          }) : null}
          whatsappAvailable={!!(previewInv.client?.phone || previewInv.bill_to?.phone)}
        />
      )}
    </>
  );
};

export default ClientInvoicesView;
