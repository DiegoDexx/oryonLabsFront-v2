import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiCreateInvoice } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

// Crea client_invoices (documento fiscal con PDF + SES). El número de factura
// lo genera el backend (DocumentNumberService por vertical); sin trade_job_id
// el importe es obligatorio — facturación directa a cliente.
const EMPTY = { clientId: "", amount: "", dueDate: "" };

const CreateInvoiceModal = ({ isOpen, onClose, clients, token, onSuccess }) => {
  const { t } = useAdminT();
  const mi = t.modal_invoice;

  const [form, setForm]      = useState(EMPTY);
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (!form.clientId)                               e.clientId = mi.client_required;
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount   = mi.amount_required;
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
        client_id: parseInt(form.clientId),
        amount:    parseFloat(form.amount),
        ...(form.dueDate ? { due_date: form.dueDate } : {}),
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className={lbl}>{mi.amount} *</label>
            <input type="number" min="0.01" step="0.01" className={inp} value={form.amount} onChange={set("amount")} placeholder="0.00" />
            {errors.amount && <p className={err}>{errors.amount}</p>}
          </div>
          <div>
            <label className={lbl}>
              {mi.due_date} <span className="text-gray-400 font-normal">({mi.optional || "opcional"})</span>
            </label>
            <input type="date" className={inp} value={form.dueDate} onChange={set("dueDate")} />
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 py-2 rounded-lg bg-navy text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition">
            {submitting ? mi.submitting : mi.submit}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateInvoiceModal;
