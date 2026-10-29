import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiUpdateProject } from "../../../api/apiActions";
import { useAdminT } from "../../../context/AdminLangContext";
import { PROJECT_PRIORITIES } from "../shared";

const toForm = (project) => ({
  name:     project?.name     ?? "",
  category: project?.category ?? "",
  priority: project?.priority ?? "",
});

// Stage is intentionally not edited here: it goes through PATCH /projects/{id}/stage
// (selector in the table) so the backend logs the stage-change Activity.
const EditProjectModal = ({ isOpen, onClose, token, project, onSuccess }) => {
  const { t } = useAdminT();
  const mp = t.modal_project;

  const [form, setForm]       = useState(toForm(project));
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(toForm(project)); setErrors({}); }
  }, [isOpen, project]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name     = mp.name_required;
    if (form.name.length > 255)    e.name     = mp.name_too_long;
    if (!form.category.trim())     e.category = mp.category_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name:     form.name.trim(),
        category: form.category.trim(),
        priority: form.priority || null,
      };
      await apiUpdateProject(token, project.id, payload);
      onSuccess(project.id, payload);
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
    <Modal isOpen={isOpen} onClose={onClose} title={mp.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {mp.name} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {mp.category} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.category}
            onChange={handleChange("category")}
            className={inputClass("category")}
          />
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{mp.priority}</label>
          <select
            value={form.priority}
            onChange={handleChange("priority")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition bg-white"
          >
            <option value="">{mp.priority_none}</option>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>{mp.priorities[p]}</option>
            ))}
          </select>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

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
            {loading ? mp.submitting : mp.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProjectModal;
