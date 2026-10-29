import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiCreateQuote } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const INITIAL = { lead_id: "", amount_mode: "fixed", amount_fixed: "", amount_min: "", amount_max: "" };

const CreateQuoteModal = ({ isOpen, onClose, token, leads, onSuccess }) => {
  const { t } = useAdminT();
  const mq = t.modal_quote || {};

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.lead_id) e.lead_id = mq.lead_required || "Lead is required";
    if (form.amount_mode === "fixed" && !form.amount_fixed)
      e.amount_fixed = mq.amount_required || "Amount is required";
    if (form.amount_mode === "range" && !form.amount_min && !form.amount_max)
      e.amount_range = mq.range_required || "Set at least a min or a max";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { lead_id: Number(form.lead_id) };
      if (form.amount_mode === "fixed") {
        payload.amount_fixed = parseFloat(form.amount_fixed);
      } else {
        if (form.amount_min) payload.amount_min = parseFloat(form.amount_min);
        if (form.amount_max) payload.amount_max = parseFloat(form.amount_max);
      }
      await apiCreateQuote(token, payload);
      onSuccess();
      setForm(INITIAL);
      setErrors({});
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || t.common.unexpected_error });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
    }`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mq.title || "New quote"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {mq.lead || "Lead"} <span className="text-red-400">*</span>
          </label>
          <select value={form.lead_id} onChange={handleChange("lead_id")} className={inputClass("lead_id")}>
            <option value="">{mq.lead_placeholder || "Select a lead…"}</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                #{l.id} · {l.name || l.email || l.phone || "—"}
              </option>
            ))}
          </select>
          {errors.lead_id && <p className="text-red-500 text-xs mt-1">{errors.lead_id}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{mq.amount_type || "Amount type"}</label>
          <div className="grid grid-cols-2 gap-2">
            {["fixed", "range"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleChange("amount_mode")({ target: { value: mode } })}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                  form.amount_mode === mode
                    ? "border-cyan bg-cyan/10 text-cyan"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {mode === "fixed" ? (mq.fixed || "Fixed amount") : (mq.range || "Range (min–max)")}
              </button>
            ))}
          </div>
        </div>

        {form.amount_mode === "fixed" ? (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {mq.amount_fixed || "Amount"} <span className="text-red-400">*</span>
            </label>
            <input
              type="number" min="0" step="0.01"
              value={form.amount_fixed}
              onChange={handleChange("amount_fixed")}
              placeholder="0.00"
              className={inputClass("amount_fixed")}
            />
            {errors.amount_fixed && <p className="text-red-500 text-xs mt-1">{errors.amount_fixed}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{mq.amount_min || "Min"}</label>
              <input
                type="number" min="0" step="0.01"
                value={form.amount_min}
                onChange={handleChange("amount_min")}
                placeholder="0.00"
                className={inputClass("amount_min")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{mq.amount_max || "Max"}</label>
              <input
                type="number" min="0" step="0.01"
                value={form.amount_max}
                onChange={handleChange("amount_max")}
                placeholder="0.00"
                className={inputClass("amount_max")}
              />
            </div>
          </div>
        )}
        {errors.amount_range && <p className="text-red-500 text-xs -mt-2">{errors.amount_range}</p>}

        {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-xs font-semibold transition"
          >
            {loading ? (mq.submitting || "Creating…") : (mq.submit || "Create quote")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateQuoteModal;
