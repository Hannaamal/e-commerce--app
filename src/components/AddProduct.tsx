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
  stock: number;
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
  formData.append("description", description);
  formData.append("brand", brand);

  if (image) {
    formData.append("image", image);
  }

  dispatch(addProduct(formData));

  setProductName("");
  setCategory("");
  setPrice("");
  setStock("");
  setDescription("");
  setBrand("");
  setImage(null);
};


  // Delete Product
  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  // Open Edit Dialog
  const handleEditOpen = (product: Product) => {
    setEditingProduct(product);
    setEditOpen(true);
  };

  // Save Edited Product
  const handleEditSave = () => {
    if (!editingProduct) return;

    dispatch(
      editProduct({
        id: editingProduct.id,
        productData: {
          product_name: editingProduct.product_name,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
        },
      })
    );

    setEditOpen(false);
  };

  // Table Columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "product_name", headerName: "Name", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{ display: "flex", gap: 1 }}>
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>

      {/* Add Product Form */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          type="number"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          type="number"
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <Box sx={{ height: 400 }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
      </Box>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
