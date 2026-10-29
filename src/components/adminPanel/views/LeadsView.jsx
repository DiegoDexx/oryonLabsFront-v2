import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Modal from "../../ui/Modal";
import { useAdminT } from "../../../context/AdminLangContext";
import {
  apiUpdateLeadStatus,
  apiUpdateLeadNotes,
  apiUpdateLead,
  apiConvertLead,
  apiDeleteLead,
} from "../../../api/apiActions";
import { SECTOR_IDS, SECTOR_BADGE, PLAN_CHOSEN_BADGE, getSectorLabel, getChosenPlan } from "../leadCapture";
import EditLeadModal from "../modals/EditLeadModal";

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
  instagram_ads: "bg-pink-100 text-pink-700",
  tiktok_ads:    "bg-fuchsia-100 text-fuchsia-700",
};

const STATUSES = ["new", "contacted", "qualified", "converted", "discarded"];
const CHANNELS = ["form", "chatbot", "whatsapp", "phone", "manual", "instagram_ads", "tiktok_ads"];

const PRIORITY_BADGE = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-gray-100 text-gray-500",
};

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

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value || "—"}</p>
  </div>
);

const SectionBlock = ({ label, value, color = "gray", badge = null, pre = false }) => {
  const colors = {
    orange: "bg-orange-50 border-orange-100 text-orange-800",
    blue:   "bg-blue-50 border-blue-100 text-blue-800",
    gray:   "bg-gray-50 border-gray-100 text-gray-700",
  };
  const accent = { orange: "bg-orange-400", blue: "bg-blue-400", gray: "bg-gray-300" };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-1 h-4 rounded-full ${accent[color]}`} />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        {badge}
      </div>
      <p className={`text-sm leading-relaxed rounded-lg p-3.5 border ${colors[color]} ${pre ? "whitespace-pre-wrap break-words" : ""}`}>{value}</p>
    </div>
  );
};

const LeadsView = ({ leads, token, onRefresh, onStatusChange, onConvert, onDelete, onLeadUpdate, onEdited, users = [] }) => {
  const { t, lang } = useAdminT();
  const ld   = t.leads.detail;
  const ldel = t.leads.delete;
  const ls   = t.leads.stats;
  const lt   = t.leads.table;
  const lc   = t.leads.capture;
  const lsec = t.leads.sectors;

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const locale = lang === "en" ? "en-GB" : "es-ES";
    return new Date(dateStr).toLocaleString(locale, {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const locale = lang === "en" ? "en-GB" : "es-ES";
    return new Date(dateStr).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  };

  const [openStatusId, setOpenStatusId] = useState(null);
  const [dropdownPos, setDropdownPos]   = useState({ top: 0, left: 0 });
  const [converting, setConverting]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [viewTarget, setViewTarget]     = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [refreshing, setRefreshing]     = useState(false);

  const [filterStatus,  setFilterStatus]  = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [filterSector,  setFilterSector]  = useState("");
  const [notesValue,  setNotesValue]  = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [assignedTo,    setAssignedTo]    = useState(null);
  const [savingAssign,  setSavingAssign]  = useState(false);

  useEffect(() => {
    if (viewTarget) {
      setNotesValue(viewTarget.notes ?? "");
      setAssignedTo(viewTarget.assigned_to ?? null);
    }
  }, [viewTarget?.id]);

  const filtered = leads.filter((l) => {
    if (filterStatus  && l.status  !== filterStatus)  return false;
    if (filterChannel && l.channel !== filterChannel) return false;
    if (filterSector === "none" && l.sector) return false;
    if (filterSector && filterSector !== "none" && l.sector !== filterSector) return false;
    return true;
  });

  const newCount       = leads.filter((l) => l.status === "new").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  useEffect(() => {
    if (!openStatusId) return;
    const close = (e) => { if (!e.target.closest("[data-dropdown]")) setOpenStatusId(null); };
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
      if (viewTarget?.id === leadId) setViewTarget((v) => ({ ...v, status: newStatus }));
    } catch (err) {
      console.error("Error updating lead status:", err.message);
    }
  };

  const handleConvert = async (lead) => {
    setConverting(lead.id);
    try {
      const result = await apiConvertLead(token, lead.id);
      onConvert(lead.id, result);
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

  const handleSaveNotes = async () => {
    if (!viewTarget) return;
    setSavingNotes(true);
    try {
      await apiUpdateLeadNotes(token, viewTarget.id, notesValue);
      const updated = { ...viewTarget, notes: notesValue };
      setViewTarget(updated);
      onLeadUpdate?.(viewTarget.id, { notes: notesValue });
    } catch (err) {
      console.error("Error saving notes:", err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAssignChange = async (userId) => {
    if (!viewTarget) return;
    const val = userId === "" ? null : Number(userId);
    setAssignedTo(val);
    setSavingAssign(true);
    try {
      await apiUpdateLead(token, viewTarget.id, { assigned_to: val });
      const updated = { ...viewTarget, assigned_to: val };
      setViewTarget(updated);
      onLeadUpdate?.(viewTarget.id, { assigned_to: val });
    } catch (err) {
      console.error("Error assigning lead:", err.message);
    } finally {
      setSavingAssign(false);
    }
  };

  return (
    <>
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: ls.total,     value: leads.length,  color: "text-navy" },
          { label: ls.new,       value: newCount,       color: "text-blue-600" },
          { label: ls.converted, value: convertedCount, color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 flex items-center gap-3 shadow-sm">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
          >
            <option value="">{lt.headers.status} — all</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
          >
            <option value="">{lt.headers.channel} — all</option>
            {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
          >
            <option value="">{t.leads.filters.sector_all}</option>
            {SECTOR_IDS.map((id) => <option key={id} value={id}>{lsec[id]}</option>)}
            <option value="none">{t.leads.filters.sector_none}</option>
          </select>
          {(filterStatus || filterChannel || filterSector) && (
            <button
              onClick={() => { setFilterStatus(""); setFilterChannel(""); setFilterSector(""); }}
              className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2"
            >
              {t.common.cancel}
            </button>
          )}

          <div className="ml-auto flex items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">
              {filtered.length} / {leads.length}
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              <RefreshIcon spinning={refreshing} />
              {refreshing ? t.common.refreshing : t.common.refresh}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{lt.headers.lead}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">{lt.headers.company}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{lt.headers.channel_source}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{lt.headers.sector}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{lt.headers.challenge}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{lt.headers.urgency}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{lt.headers.status}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">{lt.headers.date}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{lt.headers.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">
                    {lt.empty}
                  </td>
                </tr>
              ) : filtered.map((lead) => (
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
                    {lead.utm_source && (
                      <div
                        className="text-[11px] text-gray-400 mt-1 max-w-[170px] truncate"
                        title={[lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ")}
                      >
                        {[lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {lead.sector ? (
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full max-w-[160px] truncate ${SECTOR_BADGE[lead.sector] || SECTOR_BADGE.otro}`}>
                        {getSectorLabel(lead.sector, lead.sector_other, lsec)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                    {getChosenPlan(lead.plan) && (
                      <div className="mt-1.5">
                        <span
                          className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${PLAN_CHOSEN_BADGE}`}
                          title={lc.plan}
                        >
                          {lc.plan_short} · {getChosenPlan(lead.plan)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs max-w-[140px] truncate hidden lg:table-cell" title={lead.challenge}>
                    {lead.challenge || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm hidden lg:table-cell">{lead.urgency || "—"}</td>

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
                        title={ld.title}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => setEditTarget(lead)}
                        className="p-1.5 text-gray-400 hover:text-cyan hover:bg-cyan/10 rounded-lg transition"
                        title={t.leads.edit.edit_btn}
                      >
                        <PencilIcon />
                      </button>
                      {lead.status !== "converted" && (
                        <button
                          onClick={() => handleConvert(lead)}
                          disabled={converting === lead.id}
                          className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg transition whitespace-nowrap hidden sm:block"
                        >
                          {converting === lead.id ? ld.converting_btn : ld.convert_btn}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget({ id: lead.id, name: lead.name })}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title={ldel.title}
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

      {/* Lead detail modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={ld.title} size="lg">
        {viewTarget && (
          <div className="space-y-5">
            {/* Header — full width */}
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

            {/* 2-column layout on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

              {/* ── Left column ──────────────────────────────────────────────── */}
              <div className="space-y-5">
                {/* Contact info */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{ld.contact_info}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <DetailField label={ld.company}  value={viewTarget.company} />
                    <DetailField label={ld.phone}    value={viewTarget.phone} />
                    <DetailField label={ld.channel}  value={viewTarget.channel} />
                    <DetailField label={ld.language} value={viewTarget.language} />
                    <DetailField label={ld.urgency}  value={viewTarget.urgency} />
                    <DetailField label={ld.date}     value={formatDate(viewTarget.created_at)} />
                    {viewTarget.priority && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{ld.priority}</p>
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_BADGE[viewTarget.priority] || "bg-gray-100 text-gray-500"}`}>
                          {viewTarget.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned to */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 rounded-full bg-cyan" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{ld.assigned_to}</p>
                    {savingAssign && <span className="text-xs text-cyan animate-pulse ml-1">{ld.saving}</span>}
                  </div>
                  <select
                    value={assignedTo ?? ""}
                    onChange={(e) => handleAssignChange(e.target.value)}
                    disabled={savingAssign}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan disabled:opacity-50"
                  >
                    <option value="">{ld.unassigned}</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>

                {/* Challenge */}
                <SectionBlock
                  label={ld.challenge}
                  value={viewTarget.challenge || ld.no_challenge}
                  color="orange"
                  badge={viewTarget.challenge_id ? (
                    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      {t.leads.challenge_ids?.[viewTarget.challenge_id] || viewTarget.challenge_id}
                    </span>
                  ) : null}
                />
              </div>

              {/* ── Right column ─────────────────────────────────────────────── */}
              <div className="space-y-5">
                {/* Capture data */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{lc.title}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {viewTarget.sector && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{lc.sector}</p>
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${SECTOR_BADGE[viewTarget.sector] || SECTOR_BADGE.otro}`}>
                          {getSectorLabel(viewTarget.sector, viewTarget.sector_other, lsec)}
                        </span>
                      </div>
                    )}
                    {getChosenPlan(viewTarget.plan) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{lc.plan}</p>
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${PLAN_CHOSEN_BADGE}`}>
                          {getChosenPlan(viewTarget.plan)}
                        </span>
                      </div>
                    )}
                    {["utm_source", "utm_medium", "utm_campaign", "utm_content"].map((key) =>
                      viewTarget[key] ? <DetailField key={key} label={lc[key]} value={viewTarget[key]} /> : null
                    )}
                    {viewTarget.source_page && (
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{lc.source_page}</p>
                        <p className="text-sm text-gray-800 break-all">{viewTarget.source_page}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{lc.privacy}</p>
                      {viewTarget.privacy_accepted ? (
                        <p className="text-sm text-green-700">
                          <span aria-hidden="true">✓</span> {lc.privacy_accepted}
                          {viewTarget.privacy_accepted_at ? ` · ${formatDateTime(viewTarget.privacy_accepted_at)}` : ""}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          <span aria-hidden="true">✗</span> {lc.privacy_missing}
                        </p>
                      )}
                    </div>
                  </div>
                  {viewTarget.message && (
                    <div className="mt-4">
                      <SectionBlock label={lc.message} value={viewTarget.message} color="gray" pre />
                    </div>
                  )}
                </div>

                {/* Commercial summary */}
                {viewTarget.commercial_summary ? (
                  <SectionBlock label={ld.commercial_summary} value={viewTarget.commercial_summary} color="blue" />
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full bg-blue-200" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{ld.commercial_summary}</p>
                    </div>
                    <p className="text-sm text-gray-400 italic bg-gray-50 border border-gray-100 rounded-lg p-3.5">
                      {ld.no_summary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes — full width */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-gray-300" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{ld.notes}</p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes || notesValue === (viewTarget.notes ?? "")}
                  className="text-xs font-medium text-white bg-cyan hover:bg-cyan-medium disabled:opacity-40 px-3 py-1 rounded-lg transition"
                >
                  {savingNotes ? ld.saving : ld.save}
                </button>
              </div>
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                placeholder={`${ld.notes}…`}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
              />
            </div>

            {/* Actions — full width */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setViewTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                {t.common.close}
              </button>
              <button
                onClick={() => { setEditTarget(viewTarget); setViewTarget(null); }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-cyan/40 text-cyan text-sm font-semibold hover:bg-cyan/10 transition"
              >
                {t.leads.edit.edit_btn}
              </button>
              {viewTarget.status !== "converted" && (
                <button
                  onClick={() => { handleConvert(viewTarget); setViewTarget(null); }}
                  disabled={converting === viewTarget.id}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                >
                  {converting === viewTarget.id ? ld.converting_btn : ld.convert_btn}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <EditLeadModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        token={token}
        lead={editTarget}
        onSuccess={() => onEdited?.()}
      />

      {/* Confirm delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={ldel.title}>
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
          </div>
          <div className="text-center space-y-2">
            <p className="font-semibold text-navy text-lg">
              {ldel.confirm_prefix} <span className="text-red-500">{deleteTarget?.name}</span>?
            </p>
            <p className="text-sm text-gray-500">{ldel.warning}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              {t.common.cancel}
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition">
              {deleting ? ldel.deleting : ldel.confirm}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LeadsView;
