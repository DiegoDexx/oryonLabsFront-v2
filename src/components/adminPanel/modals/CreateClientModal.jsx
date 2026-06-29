import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiCreateClient } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";

const INITIAL = { name: "", company: "", email: "", phone: "", status: "active" };

const CreateClientModal = ({ isOpen, onClose, token, onSuccess }) => {
  const { t } = useAdminT();
  const mc = t.modal_client;

  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name)  e.name  = mc.name_required;
    if (!form.email) e.email = mc.email_required;
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
      await apiCreateClient(token, form);
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
    <Modal isOpen={isOpen} onClose={onClose} title={mc.title}>
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{mc.status_label}</label>
          <select
            value={form.status}
            onChange={handleChange("status")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition bg-white"
          >
            <option value="active">{mc.status_active}</option>
            <option value="inactive">{mc.status_inactive}</option>
          </select>
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
            {loading ? mc.submitting : mc.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;
