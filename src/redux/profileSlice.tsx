"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Profile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface ProfileState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

// Fetch profile
export const fetchProfile = createAsyncThunk("profile/fetch", async () => {
  const res = await api.get("/api/users/profile");
  return res.data.data;
});

// Update profile
export const updateProfile = createAsyncThunk(
  "profile/update",
  async (profile: Partial<Profile>) => {
    const res = await api.put("/api/users/profile", profile);
    return res.data.data;
  }
);

// Update image
export const updateProfileImage = createAsyncThunk(
  "profile/updateImage",
  async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.put("/api/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.user = {
          ...action.payload,
          image: action.payload.image || "uploads/default.png",
        };
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.user = {
          ...action.payload,
          image: action.payload.image || "uploads/default.png",
        };
      })
      .addCase(updateProfileImage.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.user = {
          ...action.payload,
          image: action.payload.image || "uploads/default.png",
        };
      });
  },
});

export default profileSlice.reducer;
