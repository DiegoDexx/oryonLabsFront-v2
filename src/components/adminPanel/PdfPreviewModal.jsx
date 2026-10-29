import { useState, useEffect, useCallback } from "react";
import { useAdminT } from "../../context/AdminLangContext";

/**
 * Visor de PDF reutilizable (quotes e invoices) con barra inferior de envío.
 *
 * Props:
 *  - isOpen, onClose
 *  - title: string
 *  - loadPdfUrl: async () => objectURL
 *  - sendEmail: async () => void
 *  - sendWhatsApp: async () => void | null (null/undefined → botón oculto)
 *  - whatsappAvailable: bool (false → deshabilitado con tooltip)
 */
const PdfPreviewModal = ({
  isOpen,
  onClose,
  title,
  loadPdfUrl,
  sendEmail,
  sendWhatsApp,
  whatsappAvailable = false,
}) => {
  const { t } = useAdminT();
  const tv = t.pdf_viewer || {};

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [sending, setSending] = useState(null); // 'email' | 'whatsapp' | null
  const [result, setResult] = useState(null);   // { type: 'success'|'error', message }

  useEffect(() => {
    if (!isOpen) return undefined;
    let objectUrl = null;
    let cancelled = false;

    setLoadingPdf(true);
    setPdfError(null);
    setResult(null);

    loadPdfUrl()
      .then((url) => {
        if (cancelled) { URL.revokeObjectURL(url); return; }
        objectUrl = url;
        setPdfUrl(url);
      })
      .catch((err) => { if (!cancelled) setPdfError(mapError(err, tv)); })
      .finally(() => { if (!cancelled) setLoadingPdf(false); });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPdfUrl(null);
    };
  }, [isOpen, loadPdfUrl]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSend = useCallback(async (kind, fn) => {
    if (!fn) return;
    setSending(kind);
    setResult(null);
    try {
      await fn();
      setResult({ type: "success", message: kind === "email" ? (tv.email_sent || "Email sent") : (tv.whatsapp_sent || "Sent by WhatsApp") });
    } catch (err) {
      setResult({ type: "error", message: mapError(err, tv) });
    } finally {
      setSending(null);
    }
  }, [tv]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white w-full sm:w-[92vw] sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col h-full sm:h-[85vh] overflow-hidden"
        style={{ animation: "modalIn 0.15s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-navy truncate pr-3">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF body */}
        <div className="flex-1 min-h-0 bg-gray-100">
          {loadingPdf && (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
              <p className="text-xs text-gray-500">{tv.loading || "Loading PDF…"}</p>
            </div>
          )}
          {!loadingPdf && pdfError && (
            <div className="h-full flex items-center justify-center p-6">
              <p className="text-sm text-red-500 text-center max-w-md">{pdfError}</p>
            </div>
          )}
          {!loadingPdf && !pdfError && pdfUrl && (
            <iframe src={pdfUrl} title={title} className="w-full h-full border-0" />
          )}
        </div>

        {/* Result banner */}
        {result && (
          <div className={`px-4 sm:px-5 py-2 text-xs font-medium flex-shrink-0 ${
            result.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {result.message}
          </div>
        )}

        {/* Bottom action bar */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={() => handleSend("email", sendEmail)}
            disabled={sending !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-navy text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {sending === "email" ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {sending === "email" ? (tv.sending || "Sending…") : (tv.send_email || "Send by email")}
          </button>

          {sendWhatsApp && (
            <button
              onClick={() => handleSend("whatsapp", sendWhatsApp)}
              disabled={sending !== null || !whatsappAvailable}
              title={!whatsappAvailable ? (tv.no_phone || "No phone number") : undefined}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 disabled:opacity-50 transition"
            >
              {sending === "whatsapp" ? (
                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              )}
              {sending === "whatsapp" ? (tv.sending || "Sending…") : (tv.send_whatsapp || "Send by WhatsApp")}
            </button>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${title.replace(/\s+/g, "_")}.pdf`}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              {tv.download || "Download"}
            </a>
          )}
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
};

/** Traduce los errores del backend (send/pdf) a mensajes del visor. */
function mapError(err, tv) {
  const code = err?.data?.error;
  if (err?.status === 422 && code === "billing_profile_incomplete")
    return tv.err_billing || "Complete your billing profile in Settings";
  if (err?.status === 422 && code === "destination_email_missing")
    return tv.err_no_email || "The recipient has no email";
  if (err?.status === 422 && code === "amount_required")
    return tv.err_amount || "Set an amount first";
  if (err?.status === 502 && code === "send_failed")
    return tv.err_send_failed || "Email could not be sent, try again";
  return err?.message || tv.err_generic || "Something went wrong";
}

export default PdfPreviewModal;
