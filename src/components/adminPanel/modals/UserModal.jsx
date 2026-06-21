import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { apiCreateUser, apiUpdateUser } from "../../../api/apiActions";

const INITIAL = { name: "", email: "", password: "", role: "user" };

// Handles both create (user=null) and edit (user=object) modes
const UserModal = ({ isOpen, onClose, token, onSuccess, user = null }) => {
  const isEdit = !!user;
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: "", role: user.roles?.[0] ?? "user" });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio.";
    if (!form.email)       e.email = "El email es obligatorio.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Email inválido.";
    if (!isEdit && !form.password)           e.password = "La contraseña es obligatoria.";
    if (form.password && form.password.length < 8) e.password = "Mínimo 8 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role || null };
      if (form.password) payload.password = form.password;

      if (isEdit) {
        await apiUpdateUser(token, user.id, payload);
      } else {
        await apiCreateUser(token, { ...payload, password: form.password });
      }
      onSuccess();
      setForm(INITIAL);
    } catch (err) {
      if (err.status === 403) {
        setErrors({ submit: `Límite de usuarios alcanzado para tu plan. ${err.message}` });
      } else {
        setErrors({ submit: err.message || "Error inesperado." });
      }
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Editar usuario" : "Nuevo usuario"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nombre completo"
              className={inputClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Rol</label>
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition bg-white"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="usuario@empresa.com"
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Contraseña{!isEdit && <span className="text-red-400"> *</span>}
            {isEdit && (
              <span className="text-gray-400 font-normal"> (dejar vacío para no cambiar)</span>
            )}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder={isEdit ? "••••••••" : "Mínimo 8 caracteres"}
            autoComplete="new-password"
            className={inputClass("password")}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-navy hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {loading
              ? isEdit ? "Guardando..." : "Creando..."
              : isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
