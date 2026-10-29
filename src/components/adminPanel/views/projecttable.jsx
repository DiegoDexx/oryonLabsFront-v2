import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useAdminT } from "../../../context/AdminLangContext";
import { apiDeleteProject } from "../../../api/apiActions";
import Modal from "../../ui/Modal";
import EditProjectModal from "../modals/EditProjectModal";
import { PROJECT_STAGES } from "../shared";

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ProjectsTable = ({
  projects, loading, error, token,
  onRetry, onDeleteProject, onStageChange, onProjectUpdated,
}) => {
  const { t } = useAdminT();
  const tp = t.projects;
  const cd = t.confirm_delete;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [stageSaving, setStageSaving]   = useState(null);
  const [stageError, setStageError]     = useState(null);

  const handleStage = async (id, stage) => {
    setStageSaving(id);
    setStageError(null);
    try {
      await onStageChange(id, stage);
    } catch (err) {
      setStageError(err.message || t.common.unexpected_error);
    } finally {
      setStageSaving(null);
    }
  };

  const openDelete  = (id, name) => { setDeleteError(null); setDeleteTarget({ id, name }); };
  const closeDelete = () => { setDeleteTarget(null); setDeleteError(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiDeleteProject(token, deleteTarget.id);
      onDeleteProject(deleteTarget.id);
      closeDelete();
    } catch (err) {
      setDeleteError(err.message || t.common.unexpected_error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        {tp.loading}
      </div>
    );
  }

  // A failed load (401/403/500…) must never look like "no projects".
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
        <p className="text-sm font-semibold text-red-700">{tp.load_error}</p>
        <p className="text-xs text-red-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-medium hover:bg-red-100 transition"
          >
            {tp.retry}
          </button>
        )}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        {tp.empty}
      </div>
    );
  }

  const columns = [
    { field: "projectName",  headerName: tp.headers.project,      flex: 1 },
    { field: "category",     headerName: tp.headers.category,     flex: 1 },
    { field: "clientName",   headerName: tp.headers.client,       flex: 1 },
    { field: "clientEmail",  headerName: tp.headers.client_email, flex: 1.5 },
    {
      field: "stage",
      headerName: tp.headers.stage,
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <select
          className="text-xs border border-gray-200 rounded px-1.5 py-1 text-gray-700 bg-white disabled:opacity-50"
          value={params.row.stage ?? ""}
          disabled={stageSaving === params.row.id}
          onChange={(e) => handleStage(params.row.id, e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {!params.row.stage && <option value="" disabled>—</option>}
          {PROJECT_STAGES.map((s) => (
            <option key={s} value={s}>{tp.stages[s] ?? s}</option>
          ))}
        </select>
      ),
    },
    {
      field: "priority",
      headerName: tp.headers.priority,
      width: 100,
      valueFormatter: (value) => (value ? t.modal_project.priorities[value] ?? value : "—"),
    },
    {
      field: "requirements",
      headerName: tp.headers.requirements,
      flex: 2,
      renderCell: (params) =>
        params.row.requirements?.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {params.row.requirements.map((req, idx) => (
              <Chip
                key={req.field_id || idx}
                label={`${req.label}: ${
                  req.field_value === "1"
                    ? tp.yes
                    : req.field_value === "0"
                    ? tp.no
                    : req.field_value
                }`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        ) : (
          <em>{tp.no_requirements}</em>
        ),
    },
    {
      field: "actions",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditTarget(params.row.raw)}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
            title={tp.edit_btn}
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => openDelete(params.row.id, params.row.projectName)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title={tp.delete_btn}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  const rows = projects.map((item, idx) => ({
    // id estable: Math.random() regeneraba las keys en cada render
    id:           item.project?.id ?? `missing-${idx}`,
    projectName:  item.project?.name     ?? tp.no_name,
    category:     item.project?.category ?? tp.no_category,
    clientName:   item.client?.name      ?? tp.no_client,
    clientEmail:  item.client?.email     ?? "N/A",
    stage:        item.project?.stage    ?? null,
    priority:     item.project?.priority ?? null,
    requirements: item.requirements      ?? [],
    raw:          item.project,
  }));

  return (
    <>
      {stageError && (
        <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-red-600 text-xs">{stageError}</p>
        </div>
      )}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
          getRowHeight={() => "auto"}
        />
      </Box>

      <Modal isOpen={!!deleteTarget} onClose={closeDelete} title={cd.title}>
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-navy text-lg">
                {cd.prefix} <span className="text-red-500">{deleteTarget.name}</span>?
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-600 text-xs">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeDelete}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deleting ? cd.deleting : cd.confirm}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <EditProjectModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        token={token}
        project={editTarget}
        onSuccess={onProjectUpdated}
      />
    </>
  );
};

export default ProjectsTable;
