import { useState } from "react";
import Modal from "../../ui/Modal";
import { apiSubmitLeadForm } from "../../../api/apiActions";

const CHANNELS = [
  { value: "manual",    label: "Manual" },
  { value: "whatsapp",  label: "WhatsApp" },
  { value: "phone",     label: "Teléfono" },
  { value: "email",     label: "Email" },
  { value: "instagram", label: "Instagram" },
  { value: "form",      label: "Formulario web" },
];

const INITIAL = { name: "", company: "", email: "", phone: "", channel: "manual", language: "es" };

const CreateLeadModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio.";
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
      setErrors({ submit: err.message || "Error inesperado." });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo lead manual">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Nombre <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={handleChange("name")}
              placeholder="Nombre completo" className={inp("name")} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={lbl}>Empresa</label>
            <input type="text" value={form.company} onChange={handleChange("company")}
              placeholder="Nombre de la empresa" className={inp("company")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Email</label>
            <input type="email" value={form.email} onChange={handleChange("email")}
              placeholder="cliente@empresa.com" className={inp("email")} />
          </div>
          <div>
            <label className={lbl}>Teléfono</label>
            <input type="text" value={form.phone} onChange={handleChange("phone")}
              placeholder="+34 600 000 000" className={inp("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Canal</label>
            <select value={form.channel} onChange={handleChange("channel")} className={sel}>
              {CHANNELS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>Idioma del cliente</label>
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
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-sm font-semibold transition">
            {loading ? "Creando..." : "Crear lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLeadModal;
