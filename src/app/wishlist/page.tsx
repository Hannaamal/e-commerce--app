"use client";

import { useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchWishlist, removeWishlist } from "@/redux/wishlistSlice";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: wishlist } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id: string) => {
    dispatch(removeWishlist(id));
  };

  if (!wishlist.length) {
    return (
      <Box className="max-w-5xl mx-auto p-6">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          My Wishlist ❤️
        </Typography>
        <Typography sx={{ color: "gray", textAlign: "center", mt: 10 }}>
          No items in wishlist.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="max-w-5xl mx-auto p-6">
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        My Wishlist ❤️
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 3,
        }}
      >
        {wishlist.map((item) => (
          <Card key={item.wishlist_id} sx={{ borderRadius: 3 }}>
            <CardMedia
              component="img"
              image={item.image}
              alt={item.name}
              sx={{ height: 180, objectFit: "contain", background: "#f3f4f6" }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Typography sx={{ color: "#2563eb", fontWeight: "bold", mt: 1 }}>
                ${item.price}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => router.push(`/viewproduct/${item.product_id}`)}
                >
                  View
                </Button>
                <IconButton onClick={() => handleRemove(item.wishlist_id)}>
                  <DeleteIcon sx={{ color: "#dc2626" }} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
