"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";






const getAuthToken = () => Cookies.get("auth_token") || Cookies.get("token");

export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("No token found");

      const res = await api.post("/api/order/create", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Order creation failed"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      
      const token = getAuthToken();
      if (!token) return rejectWithValue("No token found");

      const res = await api.get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load orders"
      );
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState: { loading: false, order: null, error: null, success: false },
  reducers: {
    clearOrderState: (state) => ({
      ...state,
      loading: false,
      orders: [] as any[],
      error: null,
      success: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // you might want to rename 'order' to 'orders' array
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
