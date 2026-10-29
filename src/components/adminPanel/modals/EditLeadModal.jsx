import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiUpdateLead, apiUpdateLeadNotes, apiUpdateLeadStatus } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const STATUSES   = ["new", "contacted", "qualified", "converted", "discarded"];
const CHANNELS   = ["form", "chatbot", "whatsapp", "phone", "manual", "instagram_ads", "tiktok_ads"];
const PRIORITIES = ["low", "medium", "high"];

// LeadController@update solo valida estos campos (y descarta los null), así
// que no se pueden vaciar desde aquí. status y notes van por sus endpoints.
const PATCH_FIELDS = ["priority", "channel", "category", "project_name"];

// Datos de contacto: PATCH /api/leads/{id} no los acepta (se ignorarían en
// silencio), así que se muestran en solo lectura.
const READONLY_FIELDS = ["name", "company", "email", "phone", "language", "client_volume", "challenge"];

const toForm = (lead) => ({
  status:       lead?.status       ?? "new",
  priority:     lead?.priority     ?? "",
  channel:      lead?.channel      ?? "",
  category:     lead?.category     ?? "",
  project_name: lead?.project_name ?? "",
  notes:        lead?.notes        ?? "",
});

const EditLeadModal = ({ isOpen, onClose, token, lead, onSuccess }) => {
  const { t } = useAdminT();
  const te = t.leads.edit;

  const [form, setForm]       = useState(toForm(lead));
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(toForm(lead)); setErrors({}); }
  }, [isOpen, lead]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const original = toForm(lead);

    const patch = {};
    const fieldErrors = {};
    for (const k of PATCH_FIELDS) {
      const value = String(form[k]).trim();
      if (value === String(original[k]).trim()) continue;
      if (!value) { fieldErrors[k] = te.cannot_clear; continue; }
      patch[k] = value;
    }
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }

    const statusChanged = form.status !== original.status;
    const notesChanged  = form.notes !== original.notes;

    if (Object.keys(patch).length === 0 && !statusChanged && !notesChanged) { onClose(); return; }

    setLoading(true);
    try {
      if (Object.keys(patch).length > 0) await apiUpdateLead(token, lead.id, patch);
      if (statusChanged) await apiUpdateLeadStatus(token, lead.id, form.status);
      if (notesChanged)  await apiUpdateLeadNotes(token, lead.id, form.notes || null);
      onSuccess();
      onClose();
    } catch (err) {
      const apiErrors = err.data?.errors
        ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
        : {};
      setErrors({ ...apiErrors, submit: err.message || t.common.unexpected_error });
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
    <Modal isOpen={isOpen} onClose={onClose} title={te.title}>
      {lead && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Solo lectura */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3.5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {READONLY_FIELDS.map((k) => (
                <div key={k} className={k === "challenge" ? "col-span-2" : ""}>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{te.fields[k]}</p>
                  <p className="text-sm text-gray-700 break-words">{lead[k] || "—"}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">{te.readonly_hint}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>{te.fields.status}</label>
              <select value={form.status} onChange={handleChange("status")} className={selectClass("status")}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {fieldError("status")}
            </div>
            <div>
              <label className={label}>{te.fields.priority}</label>
              <select value={form.priority} onChange={handleChange("priority")} className={selectClass("priority")}>
                {!lead.priority && <option value="">—</option>}
                {PRIORITIES.map((p) => <option key={p} value={p}>{t.modal_project.priorities?.[p] ?? p}</option>)}
              </select>
              {fieldError("priority")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>{te.fields.channel}</label>
              <select value={form.channel} onChange={handleChange("channel")} className={selectClass("channel")}>
                {!lead.channel && <option value="">—</option>}
                {/* Conserva un canal que no esté en la lista conocida */}
                {lead.channel && !CHANNELS.includes(lead.channel) && <option value={lead.channel}>{lead.channel}</option>}
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {fieldError("channel")}
            </div>
            <div>
              <label className={label}>{te.fields.category}</label>
              <input type="text" maxLength={100} value={form.category} onChange={handleChange("category")} className={inputClass("category")} />
              {fieldError("category")}
            </div>
          </div>

          <div>
            <label className={label}>{te.fields.project_name}</label>
            <input type="text" maxLength={255} value={form.project_name} onChange={handleChange("project_name")} className={inputClass("project_name")} />
            {fieldError("project_name")}
          </div>

          <div>
            <label className={label}>{te.fields.notes}</label>
            <textarea rows={3} value={form.notes} onChange={handleChange("notes")} className={`${inputClass("notes")} resize-none`} />
            {fieldError("notes")}
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
              {loading ? te.saving : te.save}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditLeadModal;
