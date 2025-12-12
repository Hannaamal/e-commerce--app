"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchProfile,
  updateProfile,
  updateProfileImage,
} from "@/redux/profileSlice";

import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

export default function EditProfile() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading } = useSelector((state: RootState) => state.profile);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load profile
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Set form values when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Update profile handler
  const handleSave = () => {
    dispatch(updateProfile({ name, phone }));
  };

  // Upload image handler
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) dispatch(updateProfileImage(file));
  };

  if (loading || !user)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      maxWidth="500px"
      mx="auto"
      mt={5}
      p={3}
      border="1px solid #ddd"
      borderRadius="12px"
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Edit Profile
      </Typography>

      {/* Avatar Image */}
      <Box textAlign="center" mb={3}>
        <Avatar
          src={user.image ? `${process.env.NEXT_PUBLIC_API_URL}/${user.image}` : ""}
          sx={{ width: 100, height: 100, margin: "0 auto" }}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>
      </Box>

      {/* Name */}
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Email (read-only) */}
      <TextField
        label="Email"
        fullWidth
        value={user.email}
        disabled
        sx={{ mb: 2 }}
      />

      {/* Phone */}
      <TextField
        label="Phone"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}
