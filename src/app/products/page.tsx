"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // your store types
import { listProducts } from "@/redux/productsSlice";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { fetchCategories } from "@/redux/categorySlice";
import Categories from "@/components/Categories";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.products.products || []
  );

  const [page, setPage] = useState(1); // current page
  const limit = 6; // products per page
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = useSelector((state: RootState) => state.categories.list);

  // Fetch products from Redux
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products whenever category changes
  useEffect(() => {
    dispatch(listProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Pagination AFTER filtering
  const total = products.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedProducts = products.slice(start, end);
  return (
    <Container
      className="py-16"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Page Title */}
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 12, fontWeight: "bold" }}
      >
        Products
      </Typography>
      <Categories data={categories} onSelectCategory={setSelectedCategory} />

      {/* Products */}
      {products.length === 0 ? (
        <Typography align="center" sx={{ py: 16 }}>
          No products found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "center",
          }}
        >
          {paginatedProducts.map((product) => (
            <Box key={product._id} sx={{ width: 300 }}>
              <Link
                href={`/products/${product._id}`}
                style={{ textDecoration: "none" }}
              >
                <Card className="shadow-lg rounded-xl" sx={{ height: 350 }}>
                  <CardMedia
                    component="img"
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}`}
                    alt={product.name}
                    sx={{
                      height: 180,
                      width: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.product_name}</Typography>
                    <Typography color="textSecondary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 8,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "contained" : "outlined"}
              color={page === i + 1 ? "primary" : "inherit"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="contained"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
}
