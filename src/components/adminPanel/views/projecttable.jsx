import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useAdminT } from "../../../context/AdminLangContext";

const ProjectsTable = ({ projects }) => {
  const { t } = useAdminT();
  const tp = t.projects;

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
  );
};

export default ProjectsTable;
