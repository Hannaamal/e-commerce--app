"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Product {
  _id: string;
  product_name: string;
  price: number;
  rating: number;
  image: string;
  stock: number;
  brand: string;
  category: string;
}

interface TopRatedState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: TopRatedState = {
  products: [],
  loading: false,
  error: null,
};

// ⭐ FETCH TOP 5 RATED PRODUCTS
export const fetchTopRatedProducts = createAsyncThunk(
  "products/fetchTopRated",
  async (_, { rejectWithValue }) => {
    try {
       const res = await api.get(`/api/product/top-rated`);
      return res.data.data; // because backend returns inside "data"
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

const topRatedSlice = createSlice({
  name: "topRated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopRatedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchTopRatedProducts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });
  },
});

export default topRatedSlice.reducer;
