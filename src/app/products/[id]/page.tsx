"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Box,
  Button,
  Typography,
  CardMedia,
  Rating,
  Divider,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ViewProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  //  dialog
  const [openDialog, setOpenDialog] = useState(false);

  // wishlist local state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load product & wishlist
  useEffect(() => {
    const stored = localStorage.getItem("products");
    const products = stored ? JSON.parse(stored) : [];
    const found = products.find((p: any) => String(p.id) === String(id));
    setProduct(found);

    // Check wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some((p: any) => String(p.id) === String(id));
    setIsWishlisted(exists);
  }, [id]);

  // Toggle Wishlist Logic
  const handleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isWishlisted) {
      wishlist = wishlist.filter((p: any) => String(p.id) !== String(id));
    } else {
      wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    setOpenDialog(true); // show success dialog
  };

  if (!product) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>Loading...</Typography>
    );
  }

  return (
    <Box className="max-w-5xl mx-auto p-6">
      {/* Back Button */}
      <Button variant="outlined" onClick={() => router.back()} sx={{ mb: 4 }}>
        ← Back
      </Button>

      {/* Product Card */}
      <Box
        className="rounded-2xl"
        sx={{
          display: "flex",
          gap: 5,
          padding: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* IMAGE */}
        <Box sx={{ width: "45%" }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: 350,
              objectFit: "contain",
              borderRadius: 3,
              background: "#f3f4f6",
              padding: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "0.25s ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          />
        </Box>

        {/* DETAILS */}
        <Box sx={{ width: "55%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.name}
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 1 }}>
            Brand: {product.brand || "N/A"}
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 2 }}>
            Category: {product.category || "N/A"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ mt: 2, mb: 2, color: "#374151" }}>
            {product.description}
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#2563eb" }}
          >
            ${product.price}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating value={product.rating || 0} readOnly />
            <Typography sx={{ ml: 1 }}>({product.rating || 0})</Typography>
          </Box>

          <Typography sx={{ mt: 2, color: "#111827" }}>
            Stock: {product.stock || 0}
          </Typography>

          {/* BUTTONS */}
          <Box className="flex items-center gap-3 mt-5">
            {/* Add to Cart Button */}
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                background: "#2563eb",
                paddingX: 4,
                paddingY: 1.3,
                fontWeight: "600",
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                "&:hover": {
                  background: "#1e40af",
                },
              }}
            >
              Add to Cart
            </Button>

            {/* ❤️ Wishlist Button */}
            <IconButton
              onClick={handleWishlist}
              sx={{
                background: isWishlisted ? "#fee2e2" : "#f3f4f6",
                width: 50,
                height: 50,
                borderRadius: "12px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                "&:hover": {
                  background: isWishlisted ? "#fecaca" : "#e5e7eb",
                },
                transition: "0.25s ease",
              }}
            >
              {isWishlisted ? (
                <FavoriteIcon sx={{ color: "#dc2626", fontSize: 28 }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "#374151", fontSize: 28 }} />
              )}
            </IconButton>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Added to Cart 🎉</DialogTitle>

              <DialogContent>
                <Typography>
                  {product.name} has been added to your cart successfully!
                </Typography>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
                <Button
                  variant="contained"
                  onClick={() => setOpenDialog(false)}
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
