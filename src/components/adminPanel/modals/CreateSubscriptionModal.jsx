import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiCreateSubscription } from "../../../api/apiActions";
import { notifySubscriptionCreated } from "../../../api/webhookCalls";
import { useAdminT } from "../../../context/AdminLangContext";

// Internal `value`s are shared with the backend/CRM (suggested_plan enum) —
// do not rename them. Only `label` (what admin users see) follows the
// public rename: old "Pro" → "Growth", old "Professional" → "Pro",
// old "Voice AI" → "Business".
const PLANS = [
  { value: "starter",      label: "Starter" },
  { value: "pro",          label: "Growth" },
  { value: "professional", label: "Pro" },
  { value: "voice_ai",     label: "Business" },
];

const EMPTY = { clientId: "", plan: "", setupFee: "", monthlyFee: "", startDate: "", nextBillingDate: "", notes: "" };

const CreateSubscriptionModal = ({ isOpen, onClose, clients, token, onSuccess }) => {
  const { t } = useAdminT();
  const ms = t.modal_subscription;

  const [form, setForm]      = useState(EMPTY);
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.clientId)                                         e.clientId   = ms.client_required;
    if (!form.plan)                                             e.plan       = ms.plan_required;
    if (form.setupFee === "" || parseFloat(form.setupFee) < 0) e.setupFee   = ms.setup_required;
    if (!form.monthlyFee || parseFloat(form.monthlyFee) <= 0)  e.monthlyFee = ms.monthly_required;
    if (!form.startDate)                                        e.startDate  = ms.start_required;
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
    <Modal isOpen={isOpen} onClose={handleClose} title={ms.title}>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className={lbl}>{ms.client} *</label>
          <select className={inp} value={form.clientId} onChange={set("clientId")}>
            <option value="">{ms.select_client}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </select>
          {errors.clientId && <p className={err}>{errors.clientId}</p>}
        </div>

        <div>
          <label className={lbl}>{ms.plan} *</label>
          <select className={inp} value={form.plan} onChange={set("plan")}>
            <option value="">{ms.select_plan}</option>
            {PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {errors.plan && <p className={err}>{errors.plan}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{ms.setup_fee} *</label>
            <input type="number" min="0" step="0.01" className={inp} value={form.setupFee} onChange={set("setupFee")} placeholder="0.00" />
            {errors.setupFee && <p className={err}>{errors.setupFee}</p>}
          </div>
          <div>
            <label className={lbl}>{ms.monthly_fee} *</label>
            <input type="number" min="0.01" step="0.01" className={inp} value={form.monthlyFee} onChange={set("monthlyFee")} placeholder="0.00" />
            {errors.monthlyFee && <p className={err}>{errors.monthlyFee}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{ms.start_date} *</label>
            <input type="date" className={inp} value={form.startDate} onChange={set("startDate")} />
            {errors.startDate && <p className={err}>{errors.startDate}</p>}
          </div>
          <div>
            <label className={lbl}>{ms.next_billing}</label>
            <input type="date" className={inp} value={form.nextBillingDate} onChange={set("nextBillingDate")} />
          </div>
        </div>

        <div>
          <label className={lbl}>{ms.notes}</label>
          <textarea className={inp} rows={3} value={form.notes} onChange={set("notes")} placeholder={ms.notes_placeholder} />
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan text-white text-sm font-semibold hover:bg-cyan-medium disabled:opacity-50 transition">
            {submitting ? ms.submitting : ms.submit}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateSubscriptionModal;
