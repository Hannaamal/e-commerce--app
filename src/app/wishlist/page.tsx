"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(stored);
  }, []);

  const handleRemove = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <Box className="max-w-5xl mx-auto p-6">
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        My Wishlist ❤️
      </Typography>

      {wishlist.length === 0 && (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 10 }}>
          No items in wishlist.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 3,
        }}
      >
        {wishlist.map((item) => (
          <Card
            key={item.id}
            sx={{
              width: "100%",
              height: 350, // FIXED CARD HEIGHT
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              transition: "0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            {/* FIXED IMAGE CONTAINER */}
            <Box
              sx={{
                width: "100%",
                height: 180, // FIXED IMAGE HEIGHT
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // keeps aspect ratio
                  padding: 1,
                }}
              />
            </Box>

            <CardContent sx={{ paddingBottom: "16px" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>

              <Typography sx={{ color: "#2563eb", fontWeight: "bold", mt: 1 }}>
                ${item.price}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    background: "#2563eb",
                    "&:hover": { background: "#1e40af" },
                  }}
                  onClick={() => router.push(`/viewproduct/${item.id}`)}
                >
                  View
                </Button>

                <IconButton
                  onClick={() => handleRemove(item.id)}
                  sx={{
                    background: "#fee2e2",
                    "&:hover": { background: "#fecaca" },
                  }}
                >
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
