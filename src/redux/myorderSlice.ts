import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
 async (userId: string, { rejectWithValue }) => {
    try {
     const { data } = await api.get(`/api/order/my-orders`);
      return data.orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

interface OrderState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const myorderSlice = createSlice({
  name: "myorders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default myorderSlice.reducer;
