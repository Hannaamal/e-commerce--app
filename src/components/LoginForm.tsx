"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/authSlice";
import { AppDispatch } from "@/redux/store";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser(form)).unwrap();

      alert("Login successful!");

      if (result.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      alert(error || "Login failed");
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
            <TextField fullWidth label="Email" name="email" onChange={handleChange} />
            <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} />

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
