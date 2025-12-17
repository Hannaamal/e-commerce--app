"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // your store types
import { listProducts, setSelectedCategory } from "@/redux/productsSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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

type Props = {
  searchParams: {
    category?: string;
  };
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
   const searchParams = useSearchParams();

  /* ✅ READ CATEGORY SAFELY */
//   const categoryFromUrl = searchParams?.category;
  const categoryFromUrl = searchParams.get("category");

  const products = useSelector(
    (state: RootState) => state.products.products || []
  );

  const selectedCategory = useSelector(
    (state: RootState) => state.products.selectedCategory
  );

  const categories = useSelector(
    (state: RootState) => state.categories.list
  );

  const [page, setPage] = useState(1);
  const limit = 6;

  /* ✅ SYNC URL → REDUX */
//   useEffect(() => {
//     if (categoryFromUrl) {
//       dispatch(setSelectedCategory(categoryFromUrl));
//     }
//   }, [categoryFromUrl, dispatch]);

   useEffect(() => {
    dispatch(setSelectedCategory(categoryFromUrl || null));
  }, [categoryFromUrl, dispatch]);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
    dispatch(listProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  const totalPages = Math.ceil(products.length / limit);
  const paginatedProducts = products.slice(
    (page - 1) * limit,
    page * limit
  );
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
      <Categories
        data={categories || []}
        onSelectCategory={(categoryId) => {
          router.push(`/products?category=${categoryId}`);
        }}
      />

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
