// redux/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";

// Cart item type
interface CartItem {
  _id: string;
  product_name: string;
  image: string;
  price: number;
  quantity: number;
  brand: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// ADD TO CART (POST)
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await api.post(
      "/api/cart/add",
      { productId, quantity },
      { withCredentials: true }
    );
    return res.data.item;
  }
);

// Fetch cart items from API
export const fetchCartItems = createAsyncThunk("cart/fetch", async () => {
  const token = Cookies.get("auth_token");
  const res = await api.get("/api/cart"); // replace with your endpoint
  return res.data.items; // assuming API returns { items: [] }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantity(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.quantity = qty;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        const added = action.payload;

        // Check if the product already exists in cart state
        const exists = state.items.find((i) => i._id === added._id);

        if (exists) {
          exists.quantity = added.quantity;
        } else {
          state.items.push(added);
        }
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1,
          price: Number(item.price),
        }));
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cart";
      });
  },
});

export const { updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
