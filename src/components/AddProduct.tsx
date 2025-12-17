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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
  ];
  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
  const [appliedFilters, setAppliedFilters] = useState<{
    q?: string;
    category?: string;
  }>({});
  useEffect(() => {
    const categoryParam =
      appliedFilters.category && isValidObjectId(appliedFilters.category)
        ? appliedFilters.category
        : undefined;
    dispatch(
      listProducts({
        skip: page * pageSize,
        limit: pageSize,
        q: appliedFilters.q?.trim() || "",
        category: categoryParam,
      })
    );
  }, [dispatch, page, pageSize, appliedFilters]);
  const handleView = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/${id}`);
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
    fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/list")
      .then((res) => res.json())
      .then((data) => {
        console.log("CATEGORY API RESPONSE", data); // <-- tell me this output
        setCategories(data.data || data); // AUTO FIX
      })
      .catch((err) => console.error("Category Fetch Error:", err));
  }, []);

  // Add Product
  const handleAddProduct = () => {
    if (
      !formData.product_name ||
      !formData.price ||
      !formData.stock ||
      !formData.category
    ) {
      alert("Please fill all required fields");
      return;
    }

    const fd = new FormData();

    fields.forEach((field) => {
      if (formData[field] !== null && formData[field] !== undefined) {
        fd.append(field, String(formData[field]));
      }
    });

    // 🔥 Add category manually as its _id
    fd.append("category", formData.category);

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
      category: "",
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



  const validateEditProduct = (product: Product | null) => {
  if (!product) return "Invalid product";

  if (!product.product_name?.trim())
    return "Product name is required";

  if (!product.category)
    return "Category is required";

  if (product.price <= 0)
    return "Price must be greater than 0";

  if (product.stock < 0)
    return "Stock cannot be negative";

  if (product.rating < 0 || product.rating > 5)
    return "Rating must be between 0 and 5";

  return null; // ✅ valid
};

  // Save Edit
  const handleEditSave = () => {
    if (!editingProduct) return;
    const error = validateEditProduct(editingProduct);
  if (error) {
    alert(error);
    return;
  }


    const fd = new FormData();

    // Use editingProduct, not formData
    fields.forEach((field) => {
      if (
        editingProduct[field] !== undefined &&
        editingProduct[field] !== null
      ) {
        fd.append(field, String(editingProduct[field]));
      }
    });

    // Append category
    if (editingProduct?.category) {
      fd.append("category", editingProduct.category);
    }

    // Append image if exists
    if (editingProduct.image instanceof File) {
      fd.append("image", editingProduct.image);
    }

    dispatch(editProduct({ id: (editingProduct as any)._id, productData: fd }))
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
            onClick={async () => {
              // Fetch full product from backend
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/${params.row.id}`
              );
              const data = await res.json();
              setEditingProduct(data.data || data); // now it has all fields
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile
            sm: "1fr 1fr", // tablet
            md: "1fr 1fr 1fr 1fr", // desktop
          },
          gap: 2,
          mb: 4,
          pt: 1,
          alignItems: "center",
        }}
      >
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
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              image: e.target.files?.[0] || null,
            })
          }
        />

        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        {/* Search by Name */}
        <TextField
          label="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        {/* Category Filter
        <TextField
          select
          label="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: 200 }}
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </TextField> */}

        {/* Min Price
        <TextField
          label="Min Price"
          type="number"
          value={filterPriceRange.min ?? ""}
          onChange={(e) =>
            setFilterPriceRange({
              ...filterPriceRange,
              min: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          sx={{ minWidth: 100 }}
        /> */}

        {/* Max Price
        <TextField
          label="Max Price"
          type="number"
          value={filterPriceRange.max ?? ""}
          onChange={(e) =>
            setFilterPriceRange({
              ...filterPriceRange,
              max: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          sx={{ minWidth: 100 }}
        /> */}

        {/* Apply Filters */}
        <Button
          variant="contained"
          onClick={() => {
            const filters: { q?: string; category?: string } = {};
            if (searchTerm.trim() !== "") filters.q = searchTerm.trim();
            if (filterCategory && isValidObjectId(filterCategory))
              filters.category = filterCategory;

            setAppliedFilters(filters);
            setPage(0); // Reset pagination
          }}
        >
          Apply
        </Button>

        {/* Reset Filters */}
        <Button
          variant="outlined"
          onClick={() => {
            setSearchTerm("");
            setFilterCategory("");
            dispatch(listProducts({ skip: page * pageSize, limit: pageSize }));
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Products Table */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={(products || []).map((p: any) => {
            const categoryObj = categories.find((c) => c._id === p.category);
            return {
              id: p._id,
              ...p,
              category: categoryObj ? categoryObj.title : "Unknown", // show name instead of ID
            };
          })}
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
          {/* CATEGORY DROPDOWN */}
          <select
            style={{
              minWidth: 200,
              height: 55,
              padding: "10px",
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
            value={editingProduct?.category || ""}
            onChange={(e) =>
              setEditingProduct(
                editingProduct
                  ? { ...editingProduct, category: e.target.value }
                  : null
              )
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          {/* CURRENT IMAGE */}
          {editingProduct?.image &&
            typeof editingProduct.image === "string" && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">Current Image:</Typography>
                <img
                  src={
                    editingProduct.image.startsWith("http")
                      ? editingProduct.image
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${editingProduct.image}`
                  }
                  alt="Current Product"
                  style={{
                    width: 150,
                    borderRadius: 5,
                    objectFit: "cover",
                    marginTop: 5,
                  }}
                />
              </Box>
            )}

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
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${viewProduct.image}`
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
