"use client";

import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  title: string;
  image: string;
};

type CategoriesProps = {
  data: Category[];
  onSelectCategory: (category: string) => void;
};

export default function Categories({
  data = [],
  onSelectCategory,
}: CategoriesProps) {
  const [active, setActive] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
  if (categoryFromUrl) {
    setActive(categoryFromUrl);
  }
}, [categoryFromUrl]);

  return (
    <Box sx={{ width: "100%", mb: 5 }}>
      <Typography
        sx={{
          fontWeight: "bold",
          mb: 3,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        🍪 Browse By Category
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {data.map((cat) => (
          <Card
            key={cat._id}
            onClick={() => {
              setActive(cat._id);
              onSelectCategory(cat._id); // ✅ SEND ObjectId
            }}
            sx={{
              width: active === cat._id ? 130 : 180,
              height: active === cat._id ? 200 : 180,
              cursor: "pointer",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow:
                active === cat._id
                  ? "0px 4px 5px rgba(0,0,0,0.25)"
                  : "0px 3px 5px rgba(0,0,0,0.15)",
              transition: "0.25s",
              transform: active === cat._id ? "scale(1.05)" : "scale(1)",
              "&:hover": {
                transform: active === cat._id ? "scale(1.08)" : "scale(1.05)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${cat.image}`}
              alt={cat.title}
              sx={{
                height: 120,
                width: "100%",
                objectFit: "cover",
              }}
            />

            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {cat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
