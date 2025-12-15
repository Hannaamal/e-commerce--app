"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import axios from "@/lib/api"; // Your axios instance
import { useAuth } from "@/Context/AuthContext";

export default function SettingsPage() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const res = await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent>
          <Typography variant="h4" color="primary" className="text-center font-bold mb-6">
            Settings 🔧
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              variant="outlined"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              variant="outlined"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
