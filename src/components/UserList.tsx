import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchUsers,
  updateUser,
  toggleUserStatus,
  User,
} from "@/redux/userSlice";
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editUser) return;
    dispatch(updateUser(editUser));
    setEditOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    dispatch(toggleUserStatus({ id: user._id, status: newStatus }))
  .unwrap()
  .then(() => dispatch(fetchUsers()));
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 150 },
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
          <Button variant="outlined" size="small" onClick={() => handleEditOpen(params.row)}>Edit</Button>
          <Button
            variant="outlined"
            size="small"
            color={params.row.status === "Active" ? "warning" : "success"}
            onClick={() => handleToggleStatus(params.row)}
          >
            {params.row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Users Management</Typography>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pagination
          pageSizeOptions={[5]}
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Name" value={editUser?.name || ""} onChange={(e) => setEditUser(editUser ? { ...editUser, name: e.target.value } : null)} />
          <TextField label="Email" value={editUser?.email || ""} onChange={(e) => setEditUser(editUser ? { ...editUser, email: e.target.value } : null)} />
          <TextField label="Role" value={editUser?.role || ""} onChange={(e) => setEditUser(editUser ? { ...editUser, role: e.target.value } : null)} />
          <TextField label="Status" value={editUser?.status || ""} onChange={(e) => setEditUser(editUser ? { ...editUser, status: e.target.value as "Active" | "Inactive" } : null)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
