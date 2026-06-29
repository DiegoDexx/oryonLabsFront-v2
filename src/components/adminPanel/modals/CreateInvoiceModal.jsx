import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiCreateInvoice } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const TYPE_KEYS = ["setup", "monthly", "extra"];

const EMPTY = { clientId: "", subscriptionId: "", type: "", amount: "", dueDate: "", invoiceNumber: "" };

const CreateInvoiceModal = ({ isOpen, onClose, clients, subscriptions, token, invoices, onSuccess }) => {
  const { t } = useAdminT();
  const mi = t.modal_invoice;

  const [form, setForm]      = useState(EMPTY);
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const next = `ORY-${String((invoices?.length || 0) + 1).padStart(3, "0")}`;
      setForm((f) => ({ ...f, invoiceNumber: next }));
    }
  }, [isOpen, invoices]);

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "clientId") next.subscriptionId = "";
      return next;
    });
  };

  const clientSubs = subscriptions.filter((s) => s.client_id === parseInt(form.clientId));

  const validate = () => {
    const e = {};
    if (!form.clientId)                               e.clientId      = mi.client_required;
    if (!form.type)                                   e.type          = mi.type_required;
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount        = mi.amount_required;
    if (!form.dueDate)                                e.dueDate       = mi.due_date_required;
    if (!form.invoiceNumber.trim())                   e.invoiceNumber = mi.invoice_number_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => { setForm(EMPTY); setErrors({}); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSub(true);
    try {
      await apiCreateInvoice(token, {
        client_id:       parseInt(form.clientId),
        subscription_id: form.subscriptionId ? parseInt(form.subscriptionId) : null,
        invoice_number:  form.invoiceNumber,
        amount:          parseFloat(form.amount),
        type:            form.type,
        status:          "pending",
        due_date:        form.dueDate,
      });
      reset();
      onSuccess();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSub(false);
    }
  };

  const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";
  const err = "text-red-500 text-xs mt-1";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mi.title}>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className={lbl}>{mi.client} *</label>
          <select className={inp} value={form.clientId} onChange={set("clientId")}>
            <option value="">{mi.select_client}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </select>
          {errors.clientId && <p className={err}>{errors.clientId}</p>}
        </div>

        <div>
          <label className={lbl}>
            {mi.subscription} <span className="text-gray-400 font-normal">{mi.subscription_optional}</span>
          </label>
          <select className={inp} value={form.subscriptionId} onChange={set("subscriptionId")} disabled={!form.clientId}>
            <option value="">{mi.no_subscription}</option>
            {clientSubs.map((s) => (
              <option key={s.id} value={s.id}>{s.plan} — €{s.monthly_fee}/mes</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{mi.type} *</label>
            <select className={inp} value={form.type} onChange={set("type")}>
              <option value="">{mi.select_type}</option>
              {TYPE_KEYS.map((key) => (
                <option key={key} value={key}>{mi.types[key]}</option>
              ))}
            </select>
            {errors.type && <p className={err}>{errors.type}</p>}
          </div>
          <div>
            <label className={lbl}>{mi.amount} *</label>
            <input type="number" min="0.01" step="0.01" className={inp} value={form.amount} onChange={set("amount")} placeholder="0.00" />
            {errors.amount && <p className={err}>{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{mi.invoice_number} *</label>
            <input type="text" className={inp} value={form.invoiceNumber} onChange={set("invoiceNumber")} />
            {errors.invoiceNumber && <p className={err}>{errors.invoiceNumber}</p>}
          </div>
          <div>
            <label className={lbl}>{mi.due_date} *</label>
            <input type="date" className={inp} value={form.dueDate} onChange={set("dueDate")} />
            {errors.dueDate && <p className={err}>{errors.dueDate}</p>}
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
            {submitting ? mi.submitting : mi.submit}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateInvoiceModal;
