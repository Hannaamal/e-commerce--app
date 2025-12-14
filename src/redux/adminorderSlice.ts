import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Async thunk
export const fetchTotalOrders = createAsyncThunk(
  "orders/fetchTotalOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/total-orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("auth_token")}`,
        },
      });

      const data = await res.json();
      if (!data.status) throw new Error(data.message);

      return data.totalOrders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "admintotalOrders",
  initialState: {
    totalOrders: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.totalOrders = action.payload;
      })
      .addCase(fetchTotalOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
