import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiCreateQuote } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";
import { clientInvoiceErrorMessage } from "../billing";

const EMPTY = { lead_id: "", amount_mode: "fixed", amount_fixed: "", amount_min: "", amount_max: "", notes: "", expires_at: "" };

const CreateQuoteModal = ({ isOpen, onClose, token, leads = [], onSuccess }) => {
  const { t } = useAdminT();
  const tq = t.quotes;
  const tm = tq.modal;

  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setErrors({}); }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.lead_id) errs.lead_id = tm.lead_required;

    if (form.amount_mode === "fixed" && form.amount_fixed !== "") {
      if (Number(form.amount_fixed) < 0) errs.amount_fixed = tm.amount_positive;
    }
    if (form.amount_mode === "range") {
      if (form.amount_min !== "" && Number(form.amount_min) < 0) errs.amount_min = tm.amount_positive;
      if (form.amount_max !== "" && Number(form.amount_max) < 0) errs.amount_max = tm.amount_positive;
    }

    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = { lead_id: Number(form.lead_id) };
    if (form.amount_mode === "fixed" && form.amount_fixed !== "") {
      payload.amount_fixed = Number(form.amount_fixed);
    }
    if (form.amount_mode === "range") {
      if (form.amount_min !== "") payload.amount_min = Number(form.amount_min);
      if (form.amount_max !== "") payload.amount_max = Number(form.amount_max);
    }
    if (form.notes.trim())    payload.notes      = form.notes.trim();
    if (form.expires_at)      payload.expires_at  = form.expires_at;

    setLoading(true);
    try {
      await apiCreateQuote(token, payload);
      onSuccess();
    } catch (err) {
      const fieldErrors = err.data?.errors
        ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
        : {};
      setErrors({
        ...fieldErrors,
        submit: clientInvoiceErrorMessage(err, tq, t.billing?.fields) || err.message || t.common.unexpected_error,
      });
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
          <label className={label}>{tm.lead} <span className="text-red-400">*</span></label>
          <select value={form.lead_id} onChange={handleChange("lead_id")} className={selectClass("lead_id")}>
            <option value="">{tm.lead_placeholder}</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.name}{l.email ? ` (${l.email})` : ""}</option>
            ))}
          </select>
          {fieldError("lead_id")}
        </div>

        <div>
          <label className={label}>{tm.amount_mode}</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input type="radio" name="amount_mode" value="fixed" checked={form.amount_mode === "fixed"} onChange={handleChange("amount_mode")} />
              {tm.amount_fixed_label}
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input type="radio" name="amount_mode" value="range" checked={form.amount_mode === "range"} onChange={handleChange("amount_mode")} />
              {tm.amount_range_label}
            </label>
          </div>
        </div>

        {form.amount_mode === "fixed" && (
          <div>
            <label className={label}>{tm.amount_fixed_field}</label>
            <input
              type="number" min="0" step="0.01"
              value={form.amount_fixed}
              onChange={handleChange("amount_fixed")}
              placeholder="0.00"
              className={inputClass("amount_fixed")}
            />
            {fieldError("amount_fixed")}
          </div>
        )}

        {form.amount_mode === "range" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>{tm.amount_min}</label>
              <input
                type="number" min="0" step="0.01"
                value={form.amount_min}
                onChange={handleChange("amount_min")}
                placeholder="0.00"
                className={inputClass("amount_min")}
              />
              {fieldError("amount_min")}
            </div>
            <div>
              <label className={label}>{tm.amount_max}</label>
              <input
                type="number" min="0" step="0.01"
                value={form.amount_max}
                onChange={handleChange("amount_max")}
                placeholder="0.00"
                className={inputClass("amount_max")}
              />
              {fieldError("amount_max")}
            </div>
          </div>
        )}

        <div>
          <label className={label}>{tm.notes}</label>
          <textarea
            value={form.notes}
            onChange={handleChange("notes")}
            rows={3}
            placeholder={tm.notes_placeholder}
            className={inputClass("notes")}
          />
        </div>

        <div>
          <label className={label}>{tm.expires_at}</label>
          <input type="date" value={form.expires_at} onChange={handleChange("expires_at")} className={inputClass("expires_at")} />
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
            {loading ? tm.submitting : tm.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateQuoteModal;
