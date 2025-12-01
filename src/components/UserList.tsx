"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string; // Active / Inactive
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
     { id: 3, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
    { id: 4, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
     { id: 5, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
    { id: 6, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
     { id: 7, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
    { id: 8, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
  ]);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editUser) return;
    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditOpen(false);
  };

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
      )
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Box sx={{ display: "flex", gap: 1, pt:1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditOpen(params.row)}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            size="small"
            color={params.row.status === "Active" ? "warning" : "success"}
            onClick={() => handleToggleStatus(params.row.id)}
          >
            {params.row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
            rows={users}
            columns={columns}
            pagination
            pageSizeOptions={[5]}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
            />
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={editUser?.name || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, name: e.target.value } : null)
            }
          />
          <TextField
            label="Email"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, email: e.target.value } : null)
            }
          />
          <TextField
            label="Role"
            value={editUser?.role || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, role: e.target.value } : null)
            }
          />
          <TextField
            label="Status"
            value={editUser?.status || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, status: e.target.value } : null)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
