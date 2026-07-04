import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useAdminT } from "../../../context/AdminLangContext";
import { apiDeleteProject } from "../../../api/apiActions";
import Modal from "../../ui/Modal";

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ProjectsTable = ({ projects, token, onDeleteProject }) => {
  const { t } = useAdminT();
  const tp = t.projects;
  const cd = t.confirm_delete;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

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

  if (!projects || projects.length === 0) {
    return <p className="text-gray-400 text-sm p-4">{tp.empty}</p>;
  }

  const columns = [
    { field: "projectName",  headerName: tp.headers.project,      flex: 1 },
    { field: "category",     headerName: tp.headers.category,     flex: 1 },
    { field: "clientName",   headerName: tp.headers.client,       flex: 1 },
    { field: "clientEmail",  headerName: tp.headers.client_email, flex: 1.5 },
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
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <button
          onClick={() => openDelete(params.row.id, params.row.projectName)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          title={tp.delete_btn}
        >
          <TrashIcon />
        </button>
      ),
    },
  ];

  const rows = projects.map((item) => ({
    id:           item.project?.id ?? Math.random(),
    projectName:  item.project?.name     ?? tp.no_name,
    category:     item.project?.category ?? tp.no_category,
    clientName:   item.client?.name      ?? tp.no_client,
    clientEmail:  item.client?.email     ?? "N/A",
    requirements: item.requirements      ?? [],
  }));

  return (
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
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
    </>
  );
};

export default ProjectsTable;
