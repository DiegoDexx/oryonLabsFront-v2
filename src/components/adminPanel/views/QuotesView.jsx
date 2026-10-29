import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useAdminT } from "../../../context/AdminLangContext";
import {
  apiDeleteQuote,
  apiDownloadQuotePdf,
  apiSendQuote,
  apiUpdateQuoteStatus,
} from "../../../api/apiActions";
import Modal from "../../ui/Modal";
import CreateQuoteModal from "../modals/CreateQuoteModal";
import { clientInvoiceErrorMessage, formatGBP } from "../billing";

const QUOTE_STATUSES = ["draft", "sent", "accepted", "rejected", "expired"];

const QUOTE_STATUS_COLOR = {
  draft:    "default",
  sent:     "info",
  accepted: "success",
  rejected: "error",
  expired:  "warning",
};

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

const quoteAmount = (q) => {
  if (q.amount_fixed != null) return formatGBP(q.amount_fixed);
  if (q.amount_min != null && q.amount_max != null) return `${formatGBP(q.amount_min)} – ${formatGBP(q.amount_max)}`;
  if (q.amount_min != null) return `from ${formatGBP(q.amount_min)}`;
  if (q.amount_max != null) return `up to ${formatGBP(q.amount_max)}`;
  return "—";
};

const canSendQuote   = (q) => q.status === "draft";
const canDeleteQuote = (q) => q.status === "draft";

const QuotesView = ({ quotes, loading, error, token, leads, onRetry, onRefresh, onToast }) => {
  const { t, lang } = useAdminT();
  const tq = t.quotes;
  const fl = t.billing?.fields;

  const [filterStatus, setFilterStatus] = useState("");
  const [refreshing, setRefreshing]     = useState(false);
  const [showCreate, setShowCreate]     = useState(false);
  const [pdfBusy, setPdfBusy]           = useState(null);

  const [action, setAction]         = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const formatDate = (value) => {
    if (!value) return "—";
    const locale = lang === "en" ? "en-GB" : "es-ES";
    return new Date(value).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  };

  const errorMessage = (err) => clientInvoiceErrorMessage(err, tq, fl) || t.common.unexpected_error;

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await onRefresh(); }
    finally { setRefreshing(false); }
  };

  const openAction = (type, quote) => { setActionError(null); setAction({ type, quote }); };
  const closeAction = () => { if (!actionBusy) { setAction(null); setActionError(null); } };

  const handleConfirmAction = async () => {
    if (!action) return;
    const { type, quote } = action;
    setActionBusy(true);
    setActionError(null);
    try {
      if (type === "send")   await apiSendQuote(token, quote.id);
      if (type === "delete") await apiDeleteQuote(token, quote.id);
      setAction(null);
      onToast({ send: t.toasts.quote_sent, delete: t.toasts.quote_deleted }[type]);
      onRefresh();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setActionBusy(false);
    }
  };

  const handleDownload = async (quote) => {
    setPdfBusy(quote.id);
    try {
      await apiDownloadQuotePdf(token, quote.id, quote.quote_number);
    } catch (err) {
      onToast(`${tq.pdf_error}: ${errorMessage(err)}`, "error");
    } finally {
      setPdfBusy(null);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await apiUpdateQuoteStatus(token, quoteId, newStatus);
      onToast(t.toasts.quote_status_updated);
      onRefresh();
    } catch (err) {
      onToast(errorMessage(err), "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        {tq.loading}
      </div>
    );
  }

  if (error) {
    const moduleMissing = error.data?.error === "module_not_available";
    return (
      <div className={`${moduleMissing ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"} border rounded-xl p-6 text-center space-y-3`}>
        <p className={`text-sm font-semibold ${moduleMissing ? "text-amber-800" : "text-red-700"}`}>
          {moduleMissing ? tq.module_unavailable : tq.load_error}
        </p>
        {!moduleMissing && (
          <>
            <p className="text-xs text-red-600">{error.status ? `${error.status} · ${error.message}` : error.message}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-medium hover:bg-red-100 transition"
            >
              {tq.retry}
            </button>
          </>
        )}
      </div>
    );
  }

  const filtered = filterStatus ? quotes.filter((q) => q.status === filterStatus) : quotes;
  const iconBtn = "p-1.5 text-gray-400 rounded-lg transition disabled:opacity-40";

  const columns = [
    { field: "quote_number", headerName: tq.headers.number, flex: 1, minWidth: 150 },
    { field: "leadName",     headerName: tq.headers.lead,   flex: 1.4, minWidth: 160 },
    { field: "amount",       headerName: tq.headers.amount, flex: 1, minWidth: 140 },
    {
      field: "status",
      headerName: tq.headers.status,
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          color={QUOTE_STATUS_COLOR[params.value] ?? "default"}
          label={tq.statuses[params.value] ?? params.value}
        />
      ),
    },
    { field: "created_at", headerName: tq.headers.issued,  width: 130, valueFormatter: (value) => formatDate(value) },
    { field: "sent_at",    headerName: tq.headers.sent_at, width: 130, valueFormatter: (value) => formatDate(value) },
    { field: "expires_at", headerName: tq.headers.expires, width: 130, valueFormatter: (value) => formatDate(value) },
    {
      field: "actions",
      headerName: tq.headers.actions,
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const q = params.row.raw;
        return (
          <div className="flex items-center gap-1 h-full">
            <button
              onClick={() => handleDownload(q)}
              disabled={pdfBusy === q.id}
              className={`${iconBtn} hover:text-navy hover:bg-gray-100`}
              title={tq.actions.pdf}
            >
              <DownloadIcon />
            </button>
            {canSendQuote(q) && (
              <button onClick={() => openAction("send", q)} className={`${iconBtn} hover:text-blue-500 hover:bg-blue-50`} title={tq.actions.send}>
                <SendIcon />
              </button>
            )}
            {canDeleteQuote(q) && (
              <button onClick={() => openAction("delete", q)} className={`${iconBtn} hover:text-red-500 hover:bg-red-50`} title={tq.actions.delete}>
                <TrashIcon />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const rows = filtered.map((q) => ({
    id:           q.id,
    quote_number: q.quote_number ?? `#${q.id}`,
    leadName:     q.lead?.name ?? "—",
    amount:       quoteAmount(q),
    status:       q.status,
    created_at:   q.created_at,
    sent_at:      q.sent_at,
    expires_at:   q.expires_at,
    raw:          q,
  }));

  const sendEmail = action?.type === "send" ? (action.quote.lead?.email ?? null) : null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
          >
            <option value="">{tq.filter_all}</option>
            {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{tq.statuses[s]}</option>)}
          </select>

          <div className="ml-auto flex items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">{filtered.length} / {quotes.length}</p>
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
              {tq.new_btn}
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            {quotes.length === 0 ? tq.empty : tq.empty_filtered}
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

      {/* Confirm: send / delete */}
      <Modal
        isOpen={!!action}
        onClose={closeAction}
        title={action ? tq[action.type]?.title ?? "" : ""}
      >
        {action && (
          <div className="space-y-5">
            {action.type === "send" && (
              <p className="text-sm text-gray-700 text-center">
                {sendEmail
                  ? tq.send.question.replace("{number}", action.quote.quote_number).replace("{email}", sendEmail)
                  : tq.send.question_no_email.replace("{number}", action.quote.quote_number)}
              </p>
            )}

            {action.type === "delete" && (
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
                </div>
                <p className="font-semibold text-navy text-lg">
                  {tq.delete.question_prefix} <span className="text-red-500">{action.quote.quote_number}</span>?
                </p>
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
                  action.type === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-cyan hover:bg-cyan-medium"
                }`}
              >
                {actionBusy ? tq[action.type].busy : tq[action.type].confirm}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CreateQuoteModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        token={token}
        leads={leads}
        onSuccess={() => { setShowCreate(false); onToast(t.toasts.quote_created); onRefresh(); }}
      />
    </>
  );
};

export default QuotesView;
