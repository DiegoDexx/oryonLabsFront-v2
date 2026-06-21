import { useState } from "react";
import { useSelector } from "react-redux";
import { apiDeleteUser } from "../../../api/apiActions";
import UserModal from "../modals/UserModal";

const ROLE_STYLES = {
  admin: "bg-navy/10 text-navy font-semibold",
  user:  "bg-gray-100 text-gray-600",
};

const ROLE_LABELS = {
  admin: "Administrador",
  user:  "Usuario",
};

const initials = (name) =>
  name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

const UsersView = ({ users, token, onRefresh }) => {
  const currentUser = useSelector((state) => state.auth.user);

  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await apiDeleteUser(token, deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      setDeleteError(err.message || "Error al eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Usuarios del panel{" "}
              <span className="text-gray-400 font-normal">({users.length})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Acceso al panel de administración · Roles: admin / usuario
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* Table */}
        {users.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No hay usuarios registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3">Usuario</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Rol</th>
                  <th className="text-right px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const role   = u.roles?.[0] ?? null;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy/10 text-navy text-xs font-bold flex items-center justify-center flex-shrink-0 select-none">
                            {initials(u.name)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{u.name}</span>
                            {isSelf && (
                              <span className="text-xs bg-cyan/10 text-cyan px-1.5 py-0.5 rounded-full font-medium">
                                tú
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{u.email}</td>
                      <td className="px-6 py-3.5">
                        {role ? (
                          <span className={`text-xs px-2.5 py-1 rounded-full ${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[role] ?? role}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">Sin rol</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(u)}
                            className="text-xs text-gray-500 hover:text-navy transition px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-navy/30 hover:bg-navy/5"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(u); setDeleteError(""); }}
                            disabled={isSelf}
                            title={isSelf ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                            className="text-xs text-red-500 hover:text-red-700 transition px-2.5 py-1.5 rounded-lg border border-red-100 hover:border-red-300 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Note about plan limits */}
      <p className="text-xs text-gray-400 px-1">
        El número máximo de usuarios depende del plan contratado. El backend devolverá un error si se supera el límite.
      </p>

      {/* Edit modal */}
      <UserModal
        isOpen={!!editTarget}
        user={editTarget}
        token={token}
        onClose={() => setEditTarget(null)}
        onSuccess={() => { setEditTarget(null); onRefresh(); }}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">¿Eliminar usuario?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Vas a eliminar a <strong className="text-gray-700">{deleteTarget.name}</strong>. Sus sesiones activas se cerrarán y no podrá acceder al panel.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-600 text-xs">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(""); }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
