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
      return rejectWithValue(err?.response?.data?.message || "Order creation failed");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: { loading: false, order: null, error: null, success: false },
  reducers: { clearOrderState: (state) => ({ ...state, loading: false, order: null, error: null, success: false }) },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; state.success = true; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
