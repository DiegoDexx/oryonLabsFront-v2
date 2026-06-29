import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiSubmitLeadForm } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const CHANNEL_KEYS = ["manual", "whatsapp", "phone", "email", "instagram", "form"];
const INITIAL = { name: "", company: "", email: "", phone: "", channel: "manual", language: "es" };

const CreateLeadModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useAdminT();
  const ml = t.modal_lead;

  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = ml.name_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apiSubmitLeadForm({ ...form, status: "new" });
      setForm(INITIAL);
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || t.common.unexpected_error });
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
    }`;
  const lbl = "block text-xs font-medium text-gray-600 mb-1.5";
  const sel = "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition bg-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ml.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{ml.name} <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={handleChange("name")}
              placeholder={t.common.name_placeholder} className={inp("name")} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={lbl}>{ml.company}</label>
            <input type="text" value={form.company} onChange={handleChange("company")}
              placeholder={t.common.company_placeholder} className={inp("company")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{ml.email}</label>
            <input type="email" value={form.email} onChange={handleChange("email")}
              placeholder={t.common.email_placeholder} className={inp("email")} />
          </div>
          <div>
            <label className={lbl}>{ml.phone}</label>
            <input type="text" value={form.phone} onChange={handleChange("phone")}
              placeholder={t.common.phone_placeholder} className={inp("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{ml.channel}</label>
            <select value={form.channel} onChange={handleChange("channel")} className={sel}>
              {CHANNEL_KEYS.map((key) => (
                <option key={key} value={key}>{ml.channels[key]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>{ml.client_language}</label>
            <select value={form.language} onChange={handleChange("language")} className={sel}>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-sm font-semibold transition">
            {loading ? ml.submitting : ml.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLeadModal;
