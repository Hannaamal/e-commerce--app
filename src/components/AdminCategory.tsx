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
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editData, setEditData] = useState<Category>({
    _id: "",
    title: "",
    image: "",
  });

  const [form, setForm] = useState({
    title: "",
    image: null as File | null,
  });

  // Load categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Add Category
  const handleAdd = async () => {
    if (!form.title || !form.image) return;
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.image) formData.append("image", form.image);

    await dispatch(addCategory(formData));
    setOpenAdd(false);
    setForm({ title: "", image: null });
  };

  // Open Edit Modal
  const openEditModal = (row: Category) => {
    setEditData(row);
    setNewImage(null); // reset
    setOpenEdit(true);
  };

  // Update Category
  const handleUpdate = async () => {
    await dispatch(
      updateCategory({
        id: editData._id,
        data: {
          title: editData.title,
          image: newImage,
        },
      })
    );
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
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.row.image}`}
              alt={params.row.title}
              style={{
                height: 120,
                width: "100%",
                objectFit: "cover",
              }}
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

          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 5 }}>
      <h1 className="text-3xl font-bold mb-5">Category Management</h1>

      <Button variant="contained" onClick={() => setOpenAdd(true)}>
        ➕ Add Category
      </Button>

      <Box sx={{ height: 500, mt: 3 }}>
        <DataGrid
          rows={categories}
          columns={columns}
          getRowId={(row) => row._id}
        />
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
            style={{ marginTop: "20px" }}
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
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
          <img
            src={
              newImage
                ? URL.createObjectURL(newImage)
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${editData.image}`
            }
            style={{ width: 80, height: 80, borderRadius: 8, marginTop: 10 }}
          />
          {/* Choose New Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setNewImage(file); // <<< YOU FORGOT THIS!!
                setEditData({ ...editData, image: file });
              }
            }}
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
