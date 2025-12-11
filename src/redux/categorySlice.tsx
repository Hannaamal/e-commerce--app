"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";

export interface Category {
  _id: string;
  title: string;
  image: string;
}

interface CategoryState {
  list: Category[];
  loading: boolean;
  error: string | null;
}
const getAuthToken = () =>
  Cookies.get("auth_token") || Cookies.get("token");
// Fetch All
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const res = await api.get("/api/category/list");
    return res.data;
  }
);

// Add
export const addCategory = createAsyncThunk(
  "categories/add",
  async (formData: FormData) => {
    const token = getAuthToken();
    if (!token) console.log("WARNING: token missing");

    const res = await api.post("/api/category/add", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data; // expected shape: { data: category }
  }
);

// Update
export const updateCategory = createAsyncThunk<Category, { id: string; data: any }>(
  "categories/update",
  async ({ id, data }) => {
    const token = getAuthToken();
    const res = await api.put(`/api/category/update/${id}`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
);

// Delete
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id) => {
    const token = getAuthToken();
    await api.delete(`/api/category/delete/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return id;
  }
);

const initialState: CategoryState = {
  list: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      // Add
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const updated = action.payload;
        const index = state.list.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.list[index] = updated;
        }
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
