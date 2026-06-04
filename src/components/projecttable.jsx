import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

const ProjectsTable = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <p>No hay proyectos disponibles.</p>;
  }

  const columns = [
    { field: "projectName", headerName: "Proyecto", flex: 1 },
    { field: "category", headerName: "Categoría", flex: 1 },
    { field: "clientName", headerName: "Cliente", flex: 1 },
    { field: "clientEmail", headerName: "Email Cliente", flex: 1.5 },

   {
  field: "requirements",
  headerName: "Requisitos",
  flex: 2,
  renderCell: (params) =>
    params.row.requirements?.length > 0 ? (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {params.row.requirements.map((req, idx) => (
        
        <Chip
        key={req.field_id || idx}
        label={`${req.label}: ${
          req.field_value === "1"
            ? "Sí"
            : req.field_value === "0"
            ? "No"
            : req.field_value
        }`}
        variant="outlined"
        size="small"
      />
        ))}
      </Box>
    ) : (
      <em>Sin requisitos</em>
    ),
},

  ];

  // 🔥 Normalizamos los datos para DataGrid
  const rows = projects.map((item) => ({
    id: item.project?.id ?? Math.random(),
    projectName: item.project?.name ?? "Sin nombre",
    category: item.project?.category ?? "Sin categoría",
    clientName: item.client?.name ?? "Sin cliente",
    clientEmail: item.client?.email ?? "N/A",
    requirements: item.requirements ?? [],
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
        getRowHeight={() => 'auto'} // 👈 permite altura dinámica
      />
    </Box>
  );
};

export default ProjectsTable;
