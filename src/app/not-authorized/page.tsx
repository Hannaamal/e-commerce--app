"use client";

import { Box, Button, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        🚫 403
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        You are not authorized to view this page
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Please contact the administrator if you think this is a mistake.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Go Home
      </Button>
    </Container>
  );
}
