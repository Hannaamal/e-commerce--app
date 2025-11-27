"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Typography, Box } from "@mui/material";

type FormData = {
  email: string;
  password: string;
};

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Login data:", data);
    // Call your login API here
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-50">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Typography variant="h4" className="mb-6 text-center font-bold">Sign In</Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" className="mt-4">
            Sign In
          </Button>

          <Typography variant="body2" className="text-center text-gray-500 mt-2">
            Don’t have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}
