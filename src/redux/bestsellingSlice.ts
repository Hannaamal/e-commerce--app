// redux/bestsellingSlice.ts
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

interface ProductState {
  bestSelling: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  bestSelling: [],
  loading: false,
  error: null,
};

// Fetch best-selling products
export const fetchBestSellingProducts = createAsyncThunk(
  "products/fetchBestSelling",
  async () => {
    const res = await api.get("/api/best-selling");
    return res.data.data; // matches backend
  }
);

const bestsellingSlice = createSlice({
  name: "bestSelling",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSelling = action.payload;
      })
      .addCase(fetchBestSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load products";
      });
  },
});

export default bestsellingSlice.reducer;
