import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
} from "@mui/material";

interface Product {
  id: string | number;
  product_name: string;
  price: number;
  stock?: number;
  image: string;
}

interface TopSellingProductsProps {
  products: Product[];
}

export default function TopSellingProducts({
  products,
}: TopSellingProductsProps) {
  return (
    <Card sx={{ boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Top Selling Products
        </Typography>

        {products.length === 0 ? (
          <Typography>No products found</Typography>
        ) : (
          <Stack spacing={2}>
            {products.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: 1,
                  borderColor: "divider",
                  pb: 1,
                  pt: 1,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={
                      p.image
                        ? p.image.startsWith("http")
                          ? p.image
                          : `http://localhost:5000/${p.image}` // prepend backend URL
                        : "" // fallback if no image
                    }
                    alt={p.product_name}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {p.product_name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      ${p.price}
                    </Typography>
                  </Box>
                </Stack>
                <Typography>{p.stock || 0} in stock</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
