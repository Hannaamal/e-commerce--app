"use client";
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

    return res.data.cartItem;
  }
);

// Fetch cart items from API
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, thunkAPI) => {
    // get token from Redux state
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    const res = await api.get("/api/cart/list", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅ Add token here
      },
      withCredentials: true, // ⬅ If you use cookies also
    });

    console.log("Cart API response:", res.data);
    return res.data || [];
  }
);

// UPDATE cart item quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, qty }: { id: string; qty: number }, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    const res = await api.put(
      `/api/cart/update/${id}`,
      { quantity: qty },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    return res.data.cartItem;
  }
);

// DELETE single cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async (id: string, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    await api.delete(`/api/cart/remove/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return id; // return the deleted item's ID to update Redux state
  }
);

// CLEAR entire cart
export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    await api.delete("/api/cart/clear", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return true;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
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

        const data = Array.isArray(action.payload) ? action.payload : [];
        console.log("CART API RESPONSE:", action.payload);

        state.items = data.map((item: any) => ({
          product_id: item.product_id?._id,
          cart_id: item._id,    
          product_name: item.product_id?.product_name,
          image:
            item.product_id?.image?.replace("\\", "/") || "/placeholder.png",
          brand: item.product_id?.brand,
          price: Number(item.price),
          quantity: item.quantity,
        }));
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cart";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const updated = action.payload;
        const item = state.items.find(
          (i) => i.product_id === updated.product_id
        );
        if (item) item.quantity = updated.quantity;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.product_id !== action.payload
        );
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
