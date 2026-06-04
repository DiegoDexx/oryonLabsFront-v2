import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

const ClientsTable = ({ clients }) => {
  if (!clients || clients.length === 0) {
    return <p>No hay clientes disponibles.</p>;
  }

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phone", headerName: "Teléfono", flex: 1 },
    {
      field: "projects",
      headerName: "Proyectos",
      flex: 2,
      renderCell: (params) =>
        params.row.projects?.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {params.row.projects.map((project) => (
              <Chip
                key={project.id}
                label={project.name}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        ) : (
          <em>Sin proyectos</em>
        ),
    },
  ];

  // 🔥 Normalizamos los datos
  const rows = clients.map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone || "N/A",
    projects: client.projects ?? [],
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
      />
    </Box>
  );
};

export default ClientsTable;
