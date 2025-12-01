"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
} from "@mui/material";

export default function ProfilePage() {
  // Example user data (replace with your backend/fetch)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St, City, Country",
    avatar: "https://i.pravatar.cc/150?img=3",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you can send updated data to your backend
    console.log("Updated User:", user);
    setEditMode(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography color="textSecondary">{user.email}</Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />
        </Box>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {editMode ? (
            <>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

