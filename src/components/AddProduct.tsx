"use client";

import { useState } from "react";
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

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function AddProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    if (!productName || !category || !price || !stock) return;

    const newProduct: Product = {
      id: products.length + 1,
      name: productName,
      category,
      price: Number(price),
      stock: Number(stock),
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setCategory("");
    setPrice("");
    setStock("");
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditOpen = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    setProducts(
      products.map((p) => (p.id === editProduct.id ? editProduct : p))
    );
    setEditOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
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
      <Box
        component="form"
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}
      >
        <TextField
          sx={{ flex: "1 1 45%" }}
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          sx={{ flex: "1 1 45%" }}
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          sx={{ flex: "1 1 45%" }}
          type="number"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          sx={{ flex: "1 1 45%" }}
          type="number"
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Products Table */}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pagination
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
      </Box>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 500,
            height: 300,
            gap: 4,
            mt: 5,
          }}
        >
          <TextField
            fullWidth
            label="Product Name"
            value={editProduct?.name || ""}
            onChange={(e) =>
              setEditProduct(
                editProduct ? { ...editProduct, name: e.target.value } : null
              )
            }
          />
          <TextField
            label="Category"
            value={editProduct?.category || ""}
            onChange={(e) =>
              setEditProduct(
                editProduct
                  ? { ...editProduct, category: e.target.value }
                  : null
              )
            }
          />
          <TextField
            label="Price"
            type="number"
            value={editProduct?.price || ""}
            onChange={(e) =>
              setEditProduct(
                editProduct
                  ? { ...editProduct, price: Number(e.target.value) }
                  : null
              )
            }
          />
          <TextField
            label="Stock"
            type="number"
            value={editProduct?.stock || ""}
            onChange={(e) =>
              setEditProduct(
                editProduct
                  ? { ...editProduct, stock: Number(e.target.value) }
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
