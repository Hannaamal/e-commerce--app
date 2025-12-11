"use client";

import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

type Category = {
  _id: string;
  title: string;
  image: string;
};

type CategoriesProps = {
  data: Category[];
  onSelectCategory: (category: string) => void;
};

export default function Categories({ data = [], onSelectCategory }: CategoriesProps) {

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
            onClick={() => onSelectCategory(cat.title)}
            sx={{
              width: 180,
              height: 180,
              cursor: "pointer",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
              transition: "0.25s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 5px 18px rgba(0,0,0,0.25)",
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
