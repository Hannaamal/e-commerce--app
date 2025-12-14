"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getProduct } from "@/redux/productsSlice";
import { addToCart, fetchCartItems } from "@/redux/cartSlice";
import { addWishlist, removeWishlist } from "@/redux/wishlistSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

  const dispatch = useDispatch<AppDispatch>();
  
  const wishlistItems = useSelector((state: any) => state.wishlist.items);


  const { product, loading } = useSelector(
    (state: RootState) => state.products
  );



  //  dialog
  const [openDialog, setOpenDialog] = useState(false);
   const [isWishlisted, setIsWishlisted] = useState(false);

  // wishlist local state

 
  // -----------------------------------------
  // 🚀 Fetch product from Redux on page load
  // -----------------------------------------
  useEffect(() => {
    if (id) {
      dispatch(getProduct(id as string));
    }
  }, [id, dispatch]);

  // Wishlist from localStorage

   useEffect(() => {
    if (!product?._id || !wishlistItems) return;

    const exists = wishlistItems.some(
      (item: any) => String(item.product_id) === String(product._id)
    );

    setIsWishlisted(exists);
  }, [wishlistItems, product]);

  // ❤️ Wishlist Toggle (no changes)

  const handleWishlist = () => {
  if (!product?._id) return;

  if (isWishlisted) {
    // FIX: compare with i.product_id._id
    const item = wishlistItems.find(
      (i: any) => String(i.product_id?._id) === String(product._id)
    );

    if (item) {
      dispatch(removeWishlist(item._id));
    }

    setIsWishlisted(false);
  } else {
    dispatch(addWishlist(product._id));
    setIsWishlisted(true);
  }
};


  // 🛒 Add to Cart (no changes)

  const handleAddToCart = () => {
    const product_id = product?._id || product?.product_id || product?.id;

    if (!product_id) return;

    dispatch(addToCart({ product_id, quantity: 1 }))
      .unwrap()
      .then(() => {
        setOpenDialog(true);
        dispatch(fetchCartItems()); // refresh after success
      })
      .catch((err) => console.error("Failed to add to cart:", err));
  };

  // ⏳ Loading UI

  if (loading || !product) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>Loading...</Typography>
    );
  }

  // UI Markup

  return (
    <Box className="max-w-5xl mx-auto p-6">
      <Button variant="outlined" onClick={() => router.back()} sx={{ mb: 4 }}>
        ← Back
      </Button>

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
            image={`${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/${product.image.replace(/\\/g, "/")}`}
            alt={product.name}
            sx={{
              width: "100%",
              height: 350,
              objectFit: "contain",
              borderRadius: 3,
              background: "#f3f4f6",
              padding: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
        </Box>

        {/* DETAILS */}
        <Box sx={{ width: "55%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.product_name}
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 1 }}>
            Brand: {product.brand || "N/A"}
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 2 }}>
           Category: {product.category?.title || "N/A"}
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

          <Typography sx={{ mt: 2, color: "#111827" }}>
            Stock: {product.stock}
          </Typography>

          {/* BUTTONS */}
          <Box className="flex items-center gap-3 mt-5">
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
              }}
            >
              Add to Cart
            </Button>

            <IconButton
              onClick={handleWishlist}
              sx={{
                background: isWishlisted ? "#fee2e2" : "#f3f4f6",
                width: 50,
                height: 50,
                borderRadius: "12px",
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
                  {product.product_name} has been added to your cart
                  successfully!
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
