import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiCreateClientInvoice, apiGetTradeJobs } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";
import { PAYMENT_METHOD_SUGGESTIONS, clientInvoiceErrorMessage, formatGBP } from "../billing";

const EMPTY = { trade_job_id: "", client_id: "", amount: "", due_date: "", payment_method: "", vat_rate: "" };

const tradeJobLabel = (tj) => {
  const quote = tj.quote?.amount_fixed ?? tj.quote?.amount_max ?? tj.quote?.amount_min;
  return [
    `#${tj.id}`,
    tj.lead?.name,
    tj.scheduled_date ? String(tj.scheduled_date).slice(0, 10) : null,
    quote != null ? formatGBP(quote) : null,
  ].filter(Boolean).join(" · ");
};

const CreateClientInvoiceModal = ({ isOpen, onClose, token, clients = [], invoices = [], onSuccess }) => {
  const { t } = useAdminT();
  const ti = t.client_invoices;
  const tm = ti.modal;

  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [tradeJobs, setTradeJobs] = useState([]);
  const [tjLoading, setTjLoading] = useState(false);
  const [tjError, setTjError]     = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY);
    setErrors({});
    setTjError(null);
    setTjLoading(true);
    apiGetTradeJobs(token)
      .then((d) => setTradeJobs(Array.isArray(d) ? d : []))
      .catch((err) => setTjError(clientInvoiceErrorMessage(err, ti, t.billing.fields) || t.common.unexpected_error))
      .finally(() => setTjLoading(false));
    // ti/t cambian solo con el idioma; recargar trade jobs por eso no aporta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // Un trade job solo admite una factura: fuera los que ya tienen una.
  const invoicedJobIds = new Set(invoices.map((i) => String(i.trade_job_id)));
  const availableJobs  = tradeJobs.filter((tj) => !invoicedJobIds.has(String(tj.id)));

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Si el lead del trabajo ya es cliente, se preselecciona.
      if (field === "trade_job_id" && !prev.client_id) {
        const clientId = tradeJobs.find((tj) => String(tj.id) === value)?.lead?.client_id;
        if (clientId && clients.some((c) => c.id === clientId)) next.client_id = String(clientId);
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.trade_job_id) { setErrors({ trade_job_id: tm.trade_job_required }); return; }

    const payload = { trade_job_id: Number(form.trade_job_id) };
    if (form.client_id)             payload.client_id      = Number(form.client_id);
    if (form.amount !== "")         payload.amount         = Number(form.amount);
    if (form.vat_rate !== "")       payload.vat_rate       = Number(form.vat_rate);
    if (form.due_date)              payload.due_date       = form.due_date;
    if (form.payment_method.trim()) payload.payment_method = form.payment_method.trim();

    setLoading(true);
    try {
      await apiCreateClientInvoice(token, payload);
      onSuccess();
    } catch (err) {
      if (err.data?.error === "amount_required") {
        setErrors({ amount: ti.errors.amount_required });
      } else {
        const fieldErrors = err.data?.errors
          ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
          : {};
        setErrors({ ...fieldErrors, submit: clientInvoiceErrorMessage(err, ti, t.billing.fields) || t.common.unexpected_error });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
    }`;
  const selectClass = (field) => `${inputClass(field)} bg-white`;
  const label = "block text-xs font-medium text-gray-600 mb-1.5";
  const fieldError = (field) => errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tm.create_title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>{tm.trade_job} <span className="text-red-400">*</span></label>
          <select
            value={form.trade_job_id}
            onChange={handleChange("trade_job_id")}
            disabled={tjLoading}
            className={selectClass("trade_job_id")}
          >
            <option value="">{tjLoading ? tm.trade_jobs_loading : tm.trade_job_placeholder}</option>
            {availableJobs.map((tj) => (
              <option key={tj.id} value={tj.id}>{tradeJobLabel(tj)}</option>
            ))}
          </select>
          {tjError && <p className="text-red-500 text-xs mt-1">{tjError}</p>}
          {!tjLoading && !tjError && availableJobs.length === 0 && (
            <p className="text-amber-600 text-xs mt-1">{tm.no_trade_jobs}</p>
          )}
          {fieldError("trade_job_id")}
        </div>

        <div>
          <label className={label}>{tm.client}</label>
          <select value={form.client_id} onChange={handleChange("client_id")} className={selectClass("client_id")}>
            <option value="">{tm.client_none}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">{tm.client_hint}</p>
          {fieldError("client_id")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>{tm.amount}</label>
            <input
              type="number" min="0" step="0.01"
              value={form.amount}
              onChange={handleChange("amount")}
              placeholder={tm.amount_placeholder}
              className={inputClass("amount")}
            />
            {fieldError("amount")}
          </div>
          <div>
            <label className={label}>{tm.vat_rate}</label>
            <input
              type="number" min="0" max="100" step="0.01"
              value={form.vat_rate}
              onChange={handleChange("vat_rate")}
              placeholder="20"
              className={inputClass("vat_rate")}
            />
            {fieldError("vat_rate")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>{tm.due_date}</label>
            <input type="date" value={form.due_date} onChange={handleChange("due_date")} className={inputClass("due_date")} />
            {fieldError("due_date")}
          </div>
          <div>
            <label className={label}>{tm.payment_method}</label>
            <input
              type="text"
              list="create-client-invoice-payment-methods"
              value={form.payment_method}
              onChange={handleChange("payment_method")}
              placeholder={tm.payment_method_placeholder}
              maxLength={50}
              className={inputClass("payment_method")}
            />
            <datalist id="create-client-invoice-payment-methods">
              {PAYMENT_METHOD_SUGGESTIONS.map((m) => <option key={m} value={m} />)}
            </datalist>
            {fieldError("payment_method")}
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            disabled={loading || tjLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {loading ? tm.submitting : tm.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientInvoiceModal;
