"use client";

import { TextField, Button, Typography, Box } from "@mui/material";
import Link from "next/link";

export default function SignupPage() {
  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          Create Account
        </Typography>

        <form className="flex flex-col gap-4">
          <TextField label="Full Name" fullWidth />
          <TextField label="Email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
          <TextField label="Confirm Password" type="password" fullWidth />

          <Button variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>

          <Typography className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 underline">
              Sign in
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}
