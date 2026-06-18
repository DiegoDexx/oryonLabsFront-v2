import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Modal from "../../ui/Modal";
import { apiDeleteClient, apiUpdateClient } from "../../../api/apiActions";

const CLIENT_STATUS = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-yellow-100 text-yellow-700",
  churned:  "bg-red-100 text-red-700",
};

const STATUSES = ["active", "inactive", "churned"];

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800 leading-relaxed">{value || "—"}</p>
  </div>
);

const CLOSED_STAGES = ["closed_won", "closed_lost"];

const ClientsTable = ({ clients, token, onDelete, onStatusChange, onRefresh }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);
  const [openStatusId, setOpenStatusId] = useState(null);
  const [dropdownPos, setDropdownPos]   = useState({ top: 0, left: 0 });
  const [viewTarget, setViewTarget]     = useState(null);
  const [refreshing, setRefreshing]     = useState(false);

  useEffect(() => {
    if (!openStatusId) return;
    const close = (e) => {
      if (!e.target.closest("[data-dropdown]")) setOpenStatusId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openStatusId]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try { await onRefresh(); }
    finally { setRefreshing(false); }
  };

  const toggleStatus = (e, id) => {
    if (openStatusId === id) { setOpenStatusId(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setOpenStatusId(id);
  };

  const openDeleteModal = (client) => {
    setDeleteError(null);
    setDeleteTarget({
      id:   client.id,
      name: client.name,
      activeSub:      client.subscriptions?.find(s => s.status === "active") ?? null,
      activeProjects: client.projects?.filter(p => !CLOSED_STAGES.includes(p.stage)) ?? [],
    });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiDeleteClient(token, deleteTarget.id);
      onDelete();
      closeDeleteModal();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    setOpenStatusId(null);
    try {
      await apiUpdateClient(token, clientId, { status: newStatus });
      onStatusChange(clientId, newStatus);
    } catch (err) {
      console.error("Error al actualizar estado:", err.message);
    }
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        No hay clientes disponibles.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500 font-medium">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            <RefreshIcon spinning={refreshing} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Empresa</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Idioma</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Proyectos</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-navy">{client.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 hidden sm:block">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm hidden sm:table-cell">{client.company || "—"}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{client.email}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">{client.phone || "—"}</td>

                  {/* Status — portal dropdown */}
                  <td className="px-6 py-4">
                    <button
                      data-dropdown
                      onClick={(e) => toggleStatus(e, client.id)}
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-75 transition ${CLIENT_STATUS[client.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {client.status || "—"}
                      <ChevronIcon />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-sm hidden md:table-cell">
                    {client.language === "en" ? "🇬🇧 EN" : "🇪🇸 ES"}
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">
                    {client.projects?.length > 0
                      ? client.projects.map((p) => p.name).join(", ")
                      : <em className="text-gray-400">Sin proyectos</em>
                    }
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewTarget(client)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalles"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => openDeleteModal(client)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar cliente"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portal: status dropdown */}
      {openStatusId && createPortal(
        <div
          data-dropdown
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
          className="w-32 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(openStatusId, s)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition"
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${CLIENT_STATUS[s]}`}>
                {s}
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Client detail modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Client Details">
        {viewTarget && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/20 to-cyan/40 flex items-center justify-center text-cyan font-bold text-sm flex-shrink-0">
                {viewTarget.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-navy truncate">{viewTarget.name}</p>
                <p className="text-xs text-gray-400 truncate">{viewTarget.email || "—"}</p>
              </div>
              <span className={`ml-auto flex-shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${CLIENT_STATUS[viewTarget.status] || "bg-gray-100 text-gray-600"}`}>
                {viewTarget.status || "—"}
              </span>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Empresa"  value={viewTarget.company} />
              <DetailField label="Teléfono" value={viewTarget.phone} />
              <DetailField label="Idioma"   value={viewTarget.language === "en" ? "🇬🇧 English" : "🇪🇸 Español"} />
              <DetailField label="Email"    value={viewTarget.email} />
            </div>

            {/* Projects */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Proyectos</p>
              {viewTarget.projects?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {viewTarget.projects.map((p) => (
                    <span key={p.id} className="text-xs bg-cyan/10 text-cyan font-medium px-2.5 py-1 rounded-full">
                      {p.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Sin proyectos</p>
              )}
            </div>

            <div className="pt-1">
              <button onClick={() => setViewTarget(null)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={closeDeleteModal} title="Eliminar cliente">
        {deleteTarget && (() => {
          const isBlocked = !!(deleteTarget.activeSub || deleteTarget.activeProjects.length > 0);
          return (
            <div className="space-y-4">

              {/* Client name row */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">
                  {deleteTarget.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-navy">{deleteTarget.name}</p>
              </div>

              {/* ── BLOCKED state ── */}
              {isBlocked && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-3">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-amber-800">
                      No se puede eliminar — resuelve lo siguiente primero:
                    </p>
                  </div>

                  {/* Active subscription blocker */}
                  {deleteTarget.activeSub && (
                    <div className="border border-orange-200 bg-orange-50 rounded-lg p-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Suscripción activa</p>
                      </div>
                      <p className="text-sm text-orange-800">
                        Plan <span className="font-semibold">{deleteTarget.activeSub.plan}</span>
                        {deleteTarget.activeSub.monthly_fee ? ` · €${deleteTarget.activeSub.monthly_fee}/mes` : ""}
                      </p>
                      <p className="text-xs text-orange-600">→ Ve a la pestaña <strong>Suscripciones</strong> y cancélala primero.</p>
                    </div>
                  )}

                  {/* Active projects blocker */}
                  {deleteTarget.activeProjects.length > 0 && (
                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                          {deleteTarget.activeProjects.length} proyecto{deleteTarget.activeProjects.length !== 1 ? "s" : ""} activo{deleteTarget.activeProjects.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ul className="space-y-0.5">
                        {deleteTarget.activeProjects.map(p => (
                          <li key={p.id} className="text-sm text-blue-800">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-blue-500 ml-1.5 text-xs">· {p.stage}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-blue-600">→ Ve a la pestaña <strong>Proyectos</strong> y ciérralos primero.</p>
                    </div>
                  )}

                  <button type="button" onClick={closeDeleteModal}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                    Entendido
                  </button>
                </div>
              )}

              {/* ── FREE TO DELETE state ── */}
              {!isBlocked && (
                <>
                  <div className="text-center space-y-2 py-2">
                    <div className="flex justify-center mb-3">
                      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-2xl">⚠️</div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Estás a punto de eliminar a <span className="font-semibold text-navy">{deleteTarget.name}</span>.
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  {/* API error fallback */}
                  {deleteError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700">{deleteError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeDeleteModal}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                      Cancelar
                    </button>
                    <button type="button" onClick={handleDelete} disabled={deleting}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition">
                      {deleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                  </div>
                </>
              )}

            </div>
          );
        })()}
      </Modal>
    </>
  );
};

export default ClientsTable;
