"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Categories from "@/components/Categories";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  stock?: number;
  category?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1); // current page
  const limit = 6; // products per page
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchProducts = async (pageNumber: number) => {
    try {
      const skip = (pageNumber - 1) * limit;
      const response = await fetch(`/api/products?skip=${skip}&limit=${limit}`);
      const data = await response.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("products");
    const allProducts = stored ? JSON.parse(stored) : [];

    setTotal(allProducts.length);

    const start = (page - 1) * limit;
    const end = start + limit;

    setProducts(allProducts.slice(start, end));
  }, [page]);

  const totalPages = Math.ceil(total / limit);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
  <Container
    className="py-16"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // centers container content horizontally
    }}
  >

    {/* Page Title */}
    <Typography variant="h3" align="center" sx={{ mb: 12, fontWeight: "bold" }}>
      Products
    </Typography>

    <Categories onSelectCategory={(category) => {
        setSelectedCategory(category);
        setPage(1);        // reset pagination
        }}  />

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
          gap: 5,             // spacing between items
          justifyContent: "center", // center all items
        }}
      >
       {filteredProducts.map((product) => (
          <Box key={product.id} sx={{ width: 300 }}>
            <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
              <Card className="shadow-lg rounded-xl" sx={{ height: 350 }}>
                <CardMedia
                  component="img"
                  image={product.image}
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
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="textSecondary">${product.price}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
        ))}
      </Box>
    )}

    {/* Pagination */}
    {totalPages > 1 && (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 8, flexWrap: "wrap" }}>
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