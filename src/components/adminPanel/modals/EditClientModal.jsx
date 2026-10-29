import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiUpdateClient } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const toForm = (client) => ({
  name:     client?.name     ?? "",
  company:  client?.company  ?? "",
  email:    client?.email    ?? "",
  phone:    client?.phone    ?? "",
  status:   client?.status   ?? "active",
  language: client?.language ?? "es",
});

const EditClientModal = ({ isOpen, onClose, token, client, onSuccess }) => {
  const { t } = useAdminT();
  const mc = t.modal_client;

  const [form, setForm]       = useState(toForm(client));
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(toForm(client)); setErrors({}); }
  }, [isOpen, client]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = mc.name_required;
    if (!form.email.trim()) e.email = mc.email_required;
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = mc.email_invalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apiUpdateClient(token, client.id, {
        name:     form.name.trim(),
        company:  form.company.trim() || null,
        email:    form.email.trim(),
        phone:    form.phone.trim() || null,
        status:   form.status,
        language: form.language,
      });
      onSuccess();
      onClose();
    } catch (err) {
      // 422 → map Laravel field errors onto the inputs (e.g. duplicated email).
      const fieldErrors = err.data?.errors
        ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
        : {};
      setErrors({ ...fieldErrors, submit: err.message || t.common.unexpected_error });
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

  const selectClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition bg-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mc.edit_title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {mc.name} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder={t.common.name_placeholder}
              className={inputClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{mc.company}</label>
            <input
              type="text"
              value={form.company}
              onChange={handleChange("company")}
              placeholder={t.common.company_placeholder}
              className={inputClass("company")}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {mc.email} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder={t.common.email_placeholder}
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{mc.phone}</label>
          <input
            type="text"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder={t.common.phone_placeholder}
            className={inputClass("phone")}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{mc.status_label}</label>
            <select value={form.status} onChange={handleChange("status")} className={selectClass}>
              <option value="active">{mc.status_active}</option>
              <option value="inactive">{mc.status_inactive}</option>
              <option value="churned">{mc.status_churned}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{mc.language}</label>
            <select value={form.language} onChange={handleChange("language")} className={selectClass}>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

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
            {loading ? mc.saving : mc.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClientModal;
