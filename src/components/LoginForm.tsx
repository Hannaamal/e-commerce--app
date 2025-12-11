"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import { useAuth } from "@/Context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    alert("Login successful!");

    // ⭐ THIS IS THE IMPORTANT LINE ⭐
    login(data.accessToken, data.data);

    // redirect based on role
    if (data.userRole === "admin") router.push("/admin");
    else router.push("/");
    
  } catch (error: any) {
    alert(error.message || "Login failed");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent>
          <Typography
            variant="h4"
            className="text-center font-bold mb-6"
            color="primary"
          >
            Welcome Back 👋
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
            />

            <Button type="submit" variant="contained" fullWidth size="large">
              Login
            </Button>
          </form>

          <Box className="text-center mt-4">
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold">
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
