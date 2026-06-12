import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { apiCreateInvoice } from "../../api/apiActions";

const TYPES = [
  { value: "setup",   label: "Setup" },
  { value: "monthly", label: "Mensual" },
  { value: "extra",   label: "Extra" },
];

const EMPTY = { clientId: "", subscriptionId: "", type: "", amount: "", dueDate: "", invoiceNumber: "" };

const CreateInvoiceModal = ({ isOpen, onClose, clients, subscriptions, token, invoices, onSuccess }) => {
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
    if (!form.clientId)                               e.clientId      = "Selecciona un cliente.";
    if (!form.type)                                   e.type          = "Selecciona un tipo.";
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount        = "Importe requerido (> 0).";
    if (!form.dueDate)                                e.dueDate       = "Fecha de vencimiento requerida.";
    if (!form.invoiceNumber.trim())                   e.invoiceNumber = "Número de factura requerido.";
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva factura">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className={lbl}>Cliente *</label>
          <select className={inp} value={form.clientId} onChange={set("clientId")}>
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </select>
          {errors.clientId && <p className={err}>{errors.clientId}</p>}
        </div>

        <div>
          <label className={lbl}>Suscripción <span className="text-gray-400 font-normal">(opcional)</span></label>
          <select className={inp} value={form.subscriptionId} onChange={set("subscriptionId")} disabled={!form.clientId}>
            <option value="">Sin suscripción asociada</option>
            {clientSubs.map((s) => (
              <option key={s.id} value={s.id}>{s.plan} — €{s.monthly_fee}/mes</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Tipo *</label>
            <select className={inp} value={form.type} onChange={set("type")}>
              <option value="">Selecciona tipo</option>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {errors.type && <p className={err}>{errors.type}</p>}
          </div>
          <div>
            <label className={lbl}>Importe (€) *</label>
            <input type="number" min="0.01" step="0.01" className={inp} value={form.amount} onChange={set("amount")} placeholder="0.00" />
            {errors.amount && <p className={err}>{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Nº Factura *</label>
            <input type="text" className={inp} value={form.invoiceNumber} onChange={set("invoiceNumber")} />
            {errors.invoiceNumber && <p className={err}>{errors.invoiceNumber}</p>}
          </div>
          <div>
            <label className={lbl}>Vencimiento *</label>
            <input type="date" className={inp} value={form.dueDate} onChange={set("dueDate")} />
            {errors.dueDate && <p className={err}>{errors.dueDate}</p>}
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
            {submitting ? "Generando..." : "Generar factura"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateInvoiceModal;
