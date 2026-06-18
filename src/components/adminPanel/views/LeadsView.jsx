import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Modal from "../../ui/Modal";
import { apiUpdateLeadStatus, apiConvertLead, apiDeleteLead } from "../../../api/apiActions";

const LEAD_STATUS_BADGE = {
  new:       "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-orange-100 text-orange-700",
  converted: "bg-green-100 text-green-700",
  discarded: "bg-red-100 text-red-700",
};

const CHANNEL_BADGE = {
  form:     "bg-cyan/10 text-cyan",
  chatbot:  "bg-purple-100 text-purple-700",
  whatsapp: "bg-green-100 text-green-700",
  phone:    "bg-blue-100 text-blue-700",
  manual:   "bg-gray-100 text-gray-600",
};

const STATUSES = ["new", "contacted", "qualified", "converted", "discarded"];

const ChevronIcon = () => (
  <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

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

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value || "—"}</p>
  </div>
);

const SectionBlock = ({ label, value, color = "gray" }) => {
  const colors = {
    orange: "bg-orange-50 border-orange-100 text-orange-800",
    blue:   "bg-blue-50 border-blue-100 text-blue-800",
    gray:   "bg-gray-50 border-gray-100 text-gray-700",
  };
  const accent = {
    orange: "bg-orange-400",
    blue:   "bg-blue-400",
    gray:   "bg-gray-300",
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-1 h-4 rounded-full ${accent[color]}`} />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-sm leading-relaxed rounded-lg p-3.5 border ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
};

const LeadsView = ({ leads, token, onRefresh, onStatusChange, onConvert, onDelete }) => {
  const [openStatusId, setOpenStatusId] = useState(null);
  const [dropdownPos, setDropdownPos]   = useState({ top: 0, left: 0 });
  const [converting, setConverting]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [viewTarget, setViewTarget]     = useState(null);
  const [refreshing, setRefreshing]     = useState(false);

  const newCount       = leads.filter((l) => l.status === "new").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  useEffect(() => {
    if (!openStatusId) return;
    const close = (e) => {
      if (!e.target.closest("[data-dropdown]")) setOpenStatusId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openStatusId]);

  const toggleStatus = (e, id) => {
    if (openStatusId === id) { setOpenStatusId(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setOpenStatusId(id);
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try { await onRefresh(); }
    finally { setRefreshing(false); }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setOpenStatusId(null);
    try {
      await apiUpdateLeadStatus(token, leadId, newStatus);
      onStatusChange(leadId, newStatus);
    } catch (err) {
      console.error("Error updating lead status:", err.message);
    }
  };

  const handleConvert = async (lead) => {
    setConverting(lead.id);
    try {
      await apiConvertLead(token, lead.id);
      onConvert(lead.id);
    } catch (err) {
      console.error("Error converting lead:", err.message);
    } finally {
      setConverting(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteLead(token, deleteTarget.id);
      onDelete(deleteTarget.id);
    } catch (err) {
      console.error("Error deleting lead:", err.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: "Total leads",  value: leads.length,  color: "text-navy" },
          { label: "New",          value: newCount,       color: "text-blue-600" },
          { label: "Converted",    value: convertedCount, color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 flex items-center gap-3 shadow-sm">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500 font-medium">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Channel</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Challenge</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Urgency</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No leads registered yet.
                  </td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-sm text-navy">{lead.name}</div>
                    {lead.email && <div className="text-xs text-gray-400 mt-0.5">{lead.email}</div>}
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm hidden sm:table-cell">{lead.company || "—"}</td>

                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${CHANNEL_BADGE[lead.channel] || "bg-gray-100 text-gray-600"}`}>
                      {lead.channel || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500 text-xs max-w-[140px] truncate hidden lg:table-cell" title={lead.challenge}>
                    {lead.challenge || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm hidden lg:table-cell">{lead.urgency || "—"}</td>

                  {/* Status — portal dropdown */}
                  <td className="px-5 py-4">
                    <button
                      data-dropdown
                      onClick={(e) => toggleStatus(e, lead.id)}
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-75 transition ${LEAD_STATUS_BADGE[lead.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {lead.status || "—"}
                      <ChevronIcon />
                    </button>
                  </td>

                  <td className="px-5 py-4 text-gray-400 text-xs hidden sm:table-cell">{formatDate(lead.created_at)}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewTarget(lead)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalles"
                      >
                        <EyeIcon />
                      </button>
                      {lead.status !== "converted" && (
                        <button
                          onClick={() => handleConvert(lead)}
                          disabled={converting === lead.id}
                          className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg transition whitespace-nowrap hidden sm:block"
                        >
                          {converting === lead.id ? "..." : "Convert"}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget({ id: lead.id, name: lead.name })}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete lead"
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
          className="w-36 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(openStatusId, s)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition"
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_BADGE[s]}`}>
                {s}
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* ── Lead detail modal ── */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Detalle del Lead">
        {viewTarget && (
          <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-base flex-shrink-0">
                {viewTarget.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy text-base leading-tight truncate">{viewTarget.name}</p>
                <p className="text-sm text-gray-400 truncate mt-0.5">{viewTarget.email || "—"}</p>
              </div>
              <span className={`flex-shrink-0 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${LEAD_STATUS_BADGE[viewTarget.status] || "bg-gray-100 text-gray-600"}`}>
                {viewTarget.status}
              </span>
            </div>

            {/* Información de contacto */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Información de contacto</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                <DetailField label="Empresa"  value={viewTarget.company} />
                <DetailField label="Teléfono" value={viewTarget.phone} />
                <DetailField label="Canal"    value={viewTarget.channel} />
                <DetailField label="Idioma"   value={viewTarget.language} />
                <DetailField label="Urgencia" value={viewTarget.urgency} />
                <DetailField label="Fecha"    value={formatDate(viewTarget.created_at)} />
              </div>
            </div>

            {/* El reto — siempre visible */}
            <SectionBlock
              label="El reto"
              value={viewTarget.challenge || "Sin información sobre el reto."}
              color="orange"
            />

            {/* Resumen comercial — solo si existe */}
            {viewTarget.commercial_summary ? (
              <SectionBlock
                label="Resumen comercial"
                value={viewTarget.commercial_summary}
                color="blue"
              />
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 rounded-full bg-blue-200" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resumen comercial</p>
                </div>
                <p className="text-sm text-gray-400 italic bg-gray-50 border border-gray-100 rounded-lg p-3.5">
                  Sin resumen comercial registrado.
                </p>
              </div>
            )}

            {/* Notas — solo si existen */}
            {viewTarget.notes && (
              <SectionBlock
                label="Notas"
                value={viewTarget.notes}
                color="gray"
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setViewTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
              {viewTarget.status !== "converted" && (
                <button
                  onClick={() => { handleConvert(viewTarget); setViewTarget(null); }}
                  disabled={converting === viewTarget.id}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                >
                  {converting === viewTarget.id ? "Convirtiendo..." : "Convertir a cliente"}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar lead">
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
          </div>
          <div className="text-center space-y-2">
            <p className="font-semibold text-navy text-lg">
              ¿Eliminar a <span className="text-red-500">{deleteTarget?.name}</span>?
            </p>
            <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition">
              {deleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LeadsView;
