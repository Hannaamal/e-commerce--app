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
import {
  listProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "@/redux/adminSlice";

// Fix Type (MongoDB IDs are strings)
type Product = {
  id: string;
  product_name: string;
  discription: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  image?: string | File | null; // <-- IMPORTANT
  is_deleted: boolean;
};

export default function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: any) => state.products);

  // Convert MongoDB _id → id for DataGrid
  const rows = products.map((item: any) => ({
    id: item._id,
    ...item,
  }));

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  // Edit Dialog States
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Product
  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("brand", brand);

    if (image) {
      formData.append("image", image);
    }

    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        dispatch(listProducts()); // 🔥 Refresh grid immediately
      });

    setProductName("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");
    setBrand("");
    setRating("");
    setImage(null);
  };

  // Delete Product
  const handleDelete = (_id: string) => {
    dispatch(deleteProduct(_id))
      .unwrap()
      .then(() => dispatch(listProducts()));
  };

  // Open Edit Dialog
  const handleEditOpen = (product: Product) => {
    setEditingProduct(product);
    setEditOpen(true);
  };

  // Save Edited Product
  const handleEditSave = () => {
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append("product_name", editingProduct.product_name);
    formData.append("description", editingProduct.discription);
    formData.append("price", editingProduct.price.toString());
    formData.append("stock", editingProduct.stock.toString());
    formData.append("brand", editingProduct.brand);
    formData.append("rating", editingProduct.rating.toString());
    formData.append("category", editingProduct.category);

    if (editingProduct.image instanceof File) {
      formData.append("image", editingProduct.image);
    }

    dispatch(editProduct({ id: editingProduct.id, productData: formData }))
      .unwrap()
      .then(() => {
        dispatch(listProducts()); // 🔥 immediate refresh
      });

    setEditOpen(false);
  };

  // Table Columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "product_name", headerName: "Name", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "rating", headerName: "Rating", width: 100 },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{ display: "flex", gap: 1, pt:1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 5,
        width: "100%",
        padding: 0,
        marginLeft: 0,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Add Product
      </Typography>

      {/* Add Product Form */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 5,
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          type="number"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          type="number"
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          label="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          type="number"
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          style={{ marginTop: "10px" }}
        />

        <Button
          variant="contained"
          onClick={handleAddProduct}
          sx={{ height: 40 }}
        >
          ADD PRODUCT
        </Button>
      </Box>

      {/* Products Table */}
      <Box
        sx={{
          height: 650,
          width: "100%",
          maxWidth: "100%",
          marginLeft: 0,
          bgcolor: "#fff",
          p: 2,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
      </Box>

      {/* Edit Product Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        PaperProps={{
          sx: {
            width: "450px",
            p: 2,
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Product</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Product Name"
            value={editingProduct?.product_name || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, product_name: e.target.value }
                  : null
              )
            }
          />

          <TextField
            label="Category"
            value={editingProduct?.category || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, category: e.target.value }
                  : null
              )
            }
          />

          <TextField
            label="Price"
            type="number"
            value={editingProduct?.price || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, price: Number(e.target.value) }
                  : null
              )
            }
          />

          <TextField
            label="Stock"
            type="number"
            value={editingProduct?.stock || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, stock: Number(e.target.value) }
                  : null
              )
            }
          />

          <TextField
            label="Description"
            value={editingProduct?.discription || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, discription: e.target.value }
                  : null
              )
            }
          />

          <TextField
            label="Brand"
            value={editingProduct?.brand || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, brand: e.target.value }
                  : null
              )
            }
          />
          <TextField
            label="Rating"
            type="number"
            value={editingProduct?.rating || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, rating: Number(e.target.value) }
                  : null
              )
            }
          />

          {/* Existing Image Preview */}
          {editingProduct?.image &&
            typeof editingProduct.image === "string" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Current Image:
                </Typography>
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${editingProduct.image}`}
                  alt="Current product"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}

          {/* New Image Upload */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Change Image:
            </Typography>
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
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#125ea8" },
              px: 3,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
