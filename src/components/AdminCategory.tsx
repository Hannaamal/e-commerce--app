"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/redux/categorySlice";

export default function CategoryAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.list);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Category>({
    _id: "",
    title: "",
    image: "",
  });

  const [form, setForm] = useState({
    title: "",
    image: "",
  });

  // Load categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Add Category
  const handleAdd = async () => {
    if (!form.title || !form.image) return;
    await dispatch(addCategory(form));
    setOpenAdd(false);
    setForm({ title: "", image: "" });
  };

  // Open Edit Modal
  const openEditModal = (row: Category) => {
    setEditData(row);
    setOpenEdit(true);
  };

  // Update Category
  const handleUpdate = async () => {
    if (!editData.title || !editData.image) return;
    await dispatch(updateCategory({ id: editData._id, data: editData }));
    setOpenEdit(false);
  };

  // Delete Category
  const handleDelete = async (id: string) => {
    await dispatch(deleteCategory(id));
  };

  // Table Columns
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="category"
          style={{ width: 50, height: 50, borderRadius: 8 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => openEditModal(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 5 }}>
      <h1 className="text-3xl font-bold mb-5">📁 Category Management</h1>

      <Button variant="contained" onClick={() => setOpenAdd(true)}>
        ➕ Add Category
      </Button>

      <Box sx={{ height: 500, mt: 3 }}>
        <DataGrid rows={categories} columns={columns} getRowId={(row) => row._id} />
      </Box>

      {/* ADD CATEGORY MODAL */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT CATEGORY MODAL */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={editData.image}
            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
