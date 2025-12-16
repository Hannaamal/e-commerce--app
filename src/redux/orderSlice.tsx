"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";


type CreateOrderPayload = {
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  address: {
    fullName: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
  };
  paymentMethod: string;
  totalAmount: number;
};




const getAuthToken = () => Cookies.get("auth_token") || Cookies.get("token");

export const createOrder = createAsyncThunk<
  any,
  CreateOrderPayload
>(
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

export const fetchMyOrders = createAsyncThunk<
  any,
  void
>(
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
  initialState: { loading: false, order: null, error: null as string | null, success: false },
  reducers: {
    clearOrderState: (state) => ({
      ...state,
      loading: false,
      orders: [] as any[],
       
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
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload; // you might want to rename 'order' to 'orders' array
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
         state.error = action.payload as string;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
