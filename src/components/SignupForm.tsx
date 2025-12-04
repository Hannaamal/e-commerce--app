"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/api";
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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", form);

      alert("Registration successful!");
      router.push("/");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration failed");
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
            Create Account ✨
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              variant="outlined"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              type="number"
              variant="outlined"
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-2 py-3 rounded-lg"
            >
              Register
            </Button>
          </form>

          <Box className="text-center mt-4">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-semibold">
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
