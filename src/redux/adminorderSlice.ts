import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@/lib/api";

// Get auth token
const getToken = () => Cookies.get("auth_token");

// Async thunks

export const fetchTotalOrders = createAsyncThunk(
  "orders/fetchTotalOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/total-orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      if (!data.status) throw new Error(data.message);

      return data.totalOrders;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await api.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async (
    { orderId, status }: { orderId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const token = getToken();
      const res = await api.patch(
        `/api/admin/${orderId}/status`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.order;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
interface AdminOrdersState {
  orders: any[];
  totalOrders: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrdersState = {
  orders: [],
  totalOrders: 0,
  loading: false,
  error: null,
};

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Total orders
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
        state.error = action.payload as string;
      })

      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
