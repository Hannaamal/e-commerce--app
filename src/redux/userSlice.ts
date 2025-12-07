"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const res = await api.get("/api/users");
  return res.data;
});

// Update user details
export const updateUser = createAsyncThunk(
  "users/update",
  async (user: User) => {
    const res = await api.put(`/api/users/${user._id}`, user);
    return res.data;
  }
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async ({ id, status }: { id: string; status: "Active" | "Inactive" }) => {
    const res = await api.put(`/api/users/${id}/status`, { status });
    return res.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })

      // Toggle status
     .addCase(toggleUserStatus.fulfilled, (state, action) => {
  const { id, status } = action.payload;

  const userIndex = state.users.findIndex((u) => u._id === id);
  if (userIndex !== -1) {
    state.users[userIndex].status = status;   // 🔥 Update UI immediately
    }
    });  

  }, 
});

export default userSlice.reducer;
