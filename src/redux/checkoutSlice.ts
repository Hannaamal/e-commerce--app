import api from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


interface Shipping {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CheckoutState {
  shipping: Shipping;
  paymentMethod: "COD" | "STRIPE";
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CheckoutState = {
  shipping: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  },
  paymentMethod: "COD",
  loading: false,
  error: null,
  success: false,
};

// Async thunk to place order
export const createOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (payload: { shipping: Shipping; cartItems: any[]; totalPrice: number }, { rejectWithValue }) => {
    try {
      const res = await api.post("http://localhost:5000/api/orders", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to place order");
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShipping: (state, action) => {
      state.shipping = { ...state.shipping, ...action.payload };
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetCheckout: (state) => {
      state.shipping = initialState.shipping;
      state.paymentMethod = "COD";
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShipping, setPaymentMethod, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
