
"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";
     

// Cart item type
interface CartItem {
  product_id: string;
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
  async ({
    product_id,
    quantity,
  }: {
    product_id: string;
    quantity: number;
  }) => {
    const token = Cookies.get("auth_token"); // get JWT token from cookie

    const res = await api.post(
      "/api/cart/add",
      { product_id, quantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- set JWT here
        },
        withCredentials: true, // needed if backend uses cookies
      }
    );

    return res.data.item;
  }
);

// Fetch cart items from API
export const fetchCartItems = createAsyncThunk("cart/fetch", async () => {
  const token = Cookies.get("auth_token");
  const res = await api.get("/api/cart/list");
  return res.data.items || []; // assuming API returns { items: [] }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantity(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.product_id === id);
      if (item) item.quantity = qty;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product_id !== action.payload);
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
        const exists = state.items.find(
          (i) => i.product_id === added.product_id
        );

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
          product_id: item.product_id || item._id, // use _id if API returns it
          product_name: item.product_name || item.name, // fallback if different key
          image: item.image || "/placeholder.png",
          price: Number(item.price || item.cost || 0),
          quantity: item.quantity || 1,
          brand: item.brand || "N/A",
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
