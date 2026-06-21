import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiCreateSubscription } from "../../../api/apiActions";
import { notifySubscriptionCreated } from "../../../api/webhookCalls";


const PLANS = [
  { value: "starter",      label: "Starter" },
  { value: "pro",          label: "Pro" },
  { value: "professional", label: "Professional" },
  { value: "voice_ai",     label: "Voice AI" },
];

const EMPTY = { clientId: "", plan: "", setupFee: "", monthlyFee: "", startDate: "", nextBillingDate: "", notes: "" };

const CreateSubscriptionModal = ({ isOpen, onClose, clients, token, onSuccess }) => {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [submitting, setSub]  = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.clientId)                                         e.clientId   = "Selecciona un cliente.";
    if (!form.plan)                                             e.plan       = "Selecciona un plan.";
    if (form.setupFee === "" || parseFloat(form.setupFee) < 0)  e.setupFee   = "Setup fee requerido (≥ 0).";
    if (!form.monthlyFee || parseFloat(form.monthlyFee) <= 0)   e.monthlyFee = "Mensualidad requerida (> 0).";
    if (!form.startDate)                                        e.startDate  = "Fecha de inicio requerida.";
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
      await apiCreateSubscription(token, {
        client_id:         parseInt(form.clientId),
        plan:              form.plan,
        setup_fee:         parseFloat(form.setupFee),
        monthly_fee:       parseFloat(form.monthlyFee),
        status:            "active",
        start_date:        form.startDate,
        next_billing_date: form.nextBillingDate || null,
        notes:             form.notes || null,
      });


      const client = clients.find(c => c.id === parseInt(form.clientId));

      notifySubscriptionCreated(
        {
          plan:              form.plan,
          setup_fee:         parseFloat(form.setupFee),
          monthly_fee:       parseFloat(form.monthlyFee),
          start_date:        form.startDate,
          next_billing_date: form.nextBillingDate || null,
          invoice_number:    `ORY-${String(Date.now()).slice(-4)}`,
        },
        {
          name:     client?.name     || "",
          company:  client?.company  || "",
          email:    client?.email    || "",
          phone:    client?.phone    || "",
          language: client?.language || "es",
        }
      ); 

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
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva suscripción">
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
          <label className={lbl}>Plan *</label>
          <select className={inp} value={form.plan} onChange={set("plan")}>
            <option value="">Selecciona un plan</option>
            {PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {errors.plan && <p className={err}>{errors.plan}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Setup fee (€) *</label>
            <input type="number" min="0" step="0.01" className={inp} value={form.setupFee} onChange={set("setupFee")} placeholder="0.00" />
            {errors.setupFee && <p className={err}>{errors.setupFee}</p>}
          </div>
          <div>
            <label className={lbl}>Mensualidad (€/mes) *</label>
            <input type="number" min="0.01" step="0.01" className={inp} value={form.monthlyFee} onChange={set("monthlyFee")} placeholder="0.00" />
            {errors.monthlyFee && <p className={err}>{errors.monthlyFee}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Fecha inicio *</label>
            <input type="date" className={inp} value={form.startDate} onChange={set("startDate")} />
            {errors.startDate && <p className={err}>{errors.startDate}</p>}
          </div>
          <div>
            <label className={lbl}>Próxima factura</label>
            <input type="date" className={inp} value={form.nextBillingDate} onChange={set("nextBillingDate")} />
          </div>
        </div>

        <div>
          <label className={lbl}>Notas</label>
          <textarea className={inp} rows={3} value={form.notes} onChange={set("notes")} placeholder="Notas internas..." />
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan text-white text-sm font-semibold hover:bg-cyan-medium disabled:opacity-50 transition">
            {submitting ? "Creando..." : "Crear suscripción"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateSubscriptionModal;
