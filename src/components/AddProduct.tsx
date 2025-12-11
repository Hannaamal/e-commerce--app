"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  listProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "@/redux/adminSlice";
import { fetchCategories } from "@/redux/categorySlice"; // <-- make sure this path is the actual slice file (see notes below)

type Product = {
  id: string;
  product_name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  image?: string | File | null;
  is_deleted: boolean;
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // // IMPORTANT: ensure this matches the key used in your store combineReducers
  // // If your reducer is registered under `admin`, use state.admin. If under `products`, use state.products.
  // // Example debug log to confirm:
  // const fullState = useSelector((s: any) => s); console.log('FULL STATE', fullState)
  const { products = [], total = 0 } = useSelector(
    (state: any) => state.adminProducts || {}
  ); // safer default

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<
    Partial<Product> & { image?: File | null }
  >({
    product_name: "",
    category: "",
    price: 0,
    stock: 0,
    rating: 0,
    description: "",
    brand: "",
    image: null,
  });

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fields: (keyof Product)[] = [
    "product_name",
    "price",
    "stock",
    "rating",
    "description",
    "brand",
    "image",
  ];

  useEffect(() => {
    dispatch(listProducts({ skip: page * pageSize, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/product/${id}`);
      const data = await res.json();

      console.log("VIEW DATA:", data);

      // if backend returns { product: {...} }
      setViewProduct(data.data || data);

      setViewOpen(true);
    } catch (error) {
      console.error("View Error:", error);
    }
  };

  const [categories, setCategories] = useState<any[]>([]);

 useEffect(() => {
  fetch("http://localhost:5000/api/category/list")
    .then((res) => res.json())
    .then((data) => {
      console.log("CATEGORY API RESPONSE", data);  // <-- tell me this output
      setCategories(data.data || data);           // AUTO FIX
    })
    .catch((err) => console.error("Category Fetch Error:", err));
}, []);

  // Add Product
  const handleAddProduct = () => {
    const fd = new FormData();
    fields.forEach((field) => {
      if (formData[field] !== null && formData[field] !== undefined) {
        fd.append(field, formData[field]!.toString());
      }
    });
    if (formData.image) fd.append("image", formData.image);

    dispatch(addProduct(fd))
      .unwrap()
      .then(() =>
        dispatch(listProducts({ skip: page * pageSize, limit: pageSize }))
      );

    setFormData({
      product_name: "",
      price: 0,
      stock: 0,
      rating: 0,
      description: "",
      brand: "",
      image: null,
    });
  };

  // Delete Product
  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() =>
        dispatch(listProducts({ skip: page * pageSize, limit: pageSize }))
      );
    setOpenDeleteDialog(true);
  };
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedId) return;

    dispatch(deleteProduct(selectedId))
      .unwrap()
      .then(() =>
        dispatch(listProducts({ skip: page * pageSize, limit: pageSize }))
      )
      .catch((err) => console.error("Delete Error:", err));

    setOpenDeleteDialog(false);
  };

  const handleCancel = () => {
    setOpenDeleteDialog(false);
  };

  // Save Edit
  const handleEditSave = () => {
    if (!editingProduct) return;

    const fd = new FormData();
    fields.forEach((field) => {
      const value = editingProduct[field];
      if (value !== null && value !== undefined)
        fd.append(field, value.toString());
    });
    if (editingProduct.image instanceof File)
      fd.append("image", editingProduct.image);

    dispatch(editProduct({ id: editingProduct.id, productData: fd }))
      .unwrap()
      .then(() =>
        dispatch(listProducts({ skip: page * pageSize, limit: pageSize }))
      );

    setEditOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "product_name", headerName: "Name", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "rating", headerName: "Rating", width: 100 },

    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
          {/* View Button */}
          <Button
            variant="text"
            size="small"
            onClick={() => handleView(params.row.id)}
          >
            <VisibilityIcon color="primary" />
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setEditingProduct(params.row);
              setEditOpen(true);
            }}
          >
            <EditIcon color="action" />
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon color="error" />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Add Product Form */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, pt: 1 }}>
        {fields.map((field) => (
          <TextField
            key={field}
            label={field.replace("_", " ").toUpperCase()}
            type={
              ["price", "stock", "rating"].includes(field) ? "number" : "text"
            }
            value={formData[field] ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field]: ["price", "stock", "rating"].includes(field)
                  ? Number(e.target.value)
                  : e.target.value,
              })
            }
            sx={{ minWidth: 200 }}
          />
        ))}
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files?.[0] || null })
          }
        />
        {/* CATEGORY DROPDOWN */}
        <select
          style={{
            minWidth: 200,
            height: 55,
            padding: "10px",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={(products || []).map((p: any) => ({ id: p._id, ...p }))}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={total || 0}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          {fields.map((field) => (
            <TextField
              key={field}
              label={field.replace("_", " ").toUpperCase()}
              type={
                ["price", "stock", "rating"].includes(field) ? "number" : "text"
              }
              value={editingProduct?.[field] ?? ""}
              onChange={(e) =>
                setEditingProduct(
                  editingProduct
                    ? {
                        ...editingProduct,
                        [field]: ["price", "stock", "rating"].includes(field)
                          ? Number(e.target.value)
                          : e.target.value,
                      }
                    : null
                )
              }
            />
          ))}
          <input
            type="file"
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, image: e.target.files?.[0] || null }
                  : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Product Details</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {viewProduct ? (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" }, // Responsive
              }}
            >
              {/* LEFT SIDE — IMAGE */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                {viewProduct.image && (
                  <img
                    src={
                      viewProduct.image?.startsWith("http")
                        ? viewProduct.image
                        : `http://localhost:5000/${viewProduct.image}`
                    }
                    alt="Product"
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>

              {/* RIGHT SIDE — TEXT */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography>
                  <strong>Name:</strong> {viewProduct.product_name}
                </Typography>
                <Typography>
                  <strong>Category:</strong> {viewProduct.category}
                </Typography>
                <Typography>
                  <strong>Brand:</strong> {viewProduct.brand}
                </Typography>
                <Typography>
                  <strong>Price:</strong> ₹{viewProduct.price}
                </Typography>
                <Typography>
                  <strong>Stock:</strong> {viewProduct.stock}
                </Typography>
                <Typography>
                  <strong>Rating:</strong> {viewProduct.rating}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {viewProduct.description}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
