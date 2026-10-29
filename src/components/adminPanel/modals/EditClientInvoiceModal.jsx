import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiUpdateClientInvoice } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";
import { BILL_TO_FIELDS, PAYMENT_METHOD_SUGGESTIONS, clientInvoiceErrorMessage, toDateInput } from "../billing";

// Mismo fallback que ClientInvoiceController::resolveBillTo: cliente
// (billing_details + datos base) o, sin cliente, el trabajo/lead.
const derivedBillTo = (invoice, clients) => {
  const client = invoice?.client ?? clients.find((c) => c.id === invoice?.client_id);
  if (client) {
    const d = client.billing_details ?? {};
    return {
      legal_name:    d.legal_name    ?? client.name,
      vat_number:    d.vat_number    ?? null,
      address_line1: d.address_line1 ?? null,
      address_line2: d.address_line2 ?? null,
      city:          d.city          ?? null,
      postcode:      d.postcode      ?? null,
      country:       d.country       ?? null,
      email:         client.email,
      phone:         client.phone,
    };
  }
  const job  = invoice?.tradeJob ?? invoice?.trade_job;
  const lead = job?.lead;
  return {
    legal_name: lead?.name, address_line1: job?.address, postcode: job?.postcode,
    email: lead?.email, phone: lead?.phone,
  };
};

const toForm = (invoice, clients) => {
  const billTo = invoice?.bill_to ?? derivedBillTo(invoice, clients);
  return {
    amount:         invoice?.amount ?? "",
    vat_rate:       invoice?.vat_rate ?? "",
    due_date:       toDateInput(invoice?.due_date),
    payment_method: invoice?.payment_method ?? "",
    bill_to:        Object.fromEntries(BILL_TO_FIELDS.map((k) => [k, billTo?.[k] ?? ""])),
  };
};

const EditClientInvoiceModal = ({ isOpen, onClose, token, invoice, clients = [], onSuccess }) => {
  const { t } = useAdminT();
  const ti = t.client_invoices;
  const tm = ti.modal;
  const fl = t.billing.fields;

  const [form, setForm]                 = useState(() => toForm(invoice, clients));
  const [overrideBillTo, setOverride]   = useState(false);
  const [billToOpen, setBillToOpen]     = useState(false);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    if (!isOpen || !invoice) return;
    setForm(toForm(invoice, clients));
    setOverride(!!invoice.bill_to);
    setBillToOpen(!!invoice.bill_to);
    setErrors({});
    // clients se refresca en segundo plano; no debe pisar lo que se está editando.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, invoice]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBillToChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, bill_to: { ...prev.bill_to, [field]: e.target.value } }));
    if (errors[`bill_to.${field}`]) setErrors((prev) => ({ ...prev, [`bill_to.${field}`]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vat_rate:       form.vat_rate === "" ? null : Number(form.vat_rate),
      due_date:       form.due_date || null,
      payment_method: form.payment_method.trim() || null,
    };
    if (form.amount !== "") payload.amount = Number(form.amount);

    // Sin override, bill_to queda null y el backend lo resuelve al enviar
    // (datos vivos del cliente). Con override se congela lo escrito aquí.
    if (overrideBillTo) {
      payload.bill_to = Object.fromEntries(
        BILL_TO_FIELDS.map((k) => [k, String(form.bill_to[k] ?? "").trim() || null])
      );
    } else if (invoice.bill_to) {
      payload.bill_to = null;
    }

    setLoading(true);
    try {
      await apiUpdateClientInvoice(token, invoice.id, payload);
      onSuccess();
    } catch (err) {
      const fieldErrors = err.data?.errors
        ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
        : {};
      setErrors({ ...fieldErrors, submit: clientInvoiceErrorMessage(err, ti, fl) || t.common.unexpected_error });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-400 ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
    }`;
  const label = "block text-xs font-medium text-gray-600 mb-1.5";
  const fieldError = (field) => errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${tm.edit_title}${invoice?.invoice_number ? ` · ${invoice.invoice_number}` : ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>{tm.amount}</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={handleChange("amount")} className={inputClass("amount")} />
            {fieldError("amount")}
          </div>
          <div>
            <label className={label}>{tm.vat_rate}</label>
            <input type="number" min="0" max="100" step="0.01" value={form.vat_rate} onChange={handleChange("vat_rate")} placeholder="20" className={inputClass("vat_rate")} />
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
              list="edit-client-invoice-payment-methods"
              value={form.payment_method}
              onChange={handleChange("payment_method")}
              placeholder={tm.payment_method_placeholder}
              maxLength={50}
              className={inputClass("payment_method")}
            />
            <datalist id="edit-client-invoice-payment-methods">
              {PAYMENT_METHOD_SUGGESTIONS.map((m) => <option key={m} value={m} />)}
            </datalist>
            {fieldError("payment_method")}
          </div>
        </div>

        {/* Datos del destinatario (vía de escape B2C / clientes sin ficha completa) */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setBillToOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-navy"
          >
            {tm.bill_to_section}
            <svg className={`w-4 h-4 transition-transform ${billToOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {billToOpen && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideBillTo}
                  onChange={(e) => setOverride(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  {tm.bill_to_override}
                  <span className="block text-xs text-gray-400 mt-0.5">{tm.bill_to_hint}</span>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {BILL_TO_FIELDS.map((k) => (
                  <div key={k} className={k === "legal_name" || k === "address_line1" ? "col-span-2" : ""}>
                    <label className={label}>{fl[k]}</label>
                    <input
                      type={k === "email" ? "email" : "text"}
                      value={form.bill_to[k]}
                      onChange={handleBillToChange(k)}
                      disabled={!overrideBillTo}
                      className={inputClass(`bill_to.${k}`)}
                    />
                    {fieldError(`bill_to.${k}`)}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {loading ? tm.saving : tm.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClientInvoiceModal;
