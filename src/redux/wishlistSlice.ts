"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";

// ------------------------------
// 🧩 Types
// ------------------------------

export interface WishlistProduct {
  _id: string;
  product_name: string;
  price: number;
  brand?: string;
  image: string;
}

export interface WishlistItem {
  wishlist_id: string;
  product_id: string;
  name?: string;
  price?: number;
  brand?: string;
  image?: string;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

// ------------------------------
// ⭐ Initial State
// ------------------------------

const initialState: WishlistState = {
  items: [],
  loading: false,
};

// ------------------------------
// ⭐ ADD WISHLIST
// ------------------------------

export const addWishlist = createAsyncThunk(
  "wishlist/add",
  async (product_id, thunkAPI) => {
    const token = Cookies.get("auth_token");

    try {
      await api.post(
        "/api/wishlist/add",
        { product_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await api.get("/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // send full populated list
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ------------------------------
// ⭐ FETCH WISHLIST
// ------------------------------

export const fetchWishlist = createAsyncThunk<WishlistItem[]>(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    const token = Cookies.get("auth_token");

    try {
      const res = await api.get("/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // backend returns array
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ------------------------------
// ⭐ REMOVE WISHLIST
// ------------------------------

export const removeWishlist = createAsyncThunk<
  string, // return removed ID
  string // argument id
>("wishlist/remove", async (id, thunkAPI) => {
  const token = Cookies.get("auth_token");

  try {
    await api.delete(`/api/wishlist/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// ------------------------------
// ⭐ SLICE
// ------------------------------

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(
      fetchWishlist.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.items = action.payload.map((w: any) => ({
          wishlist_id: w._id,
          product_id: w.product_id?._id,
          name: w.product_id?.product_name,
          price: w.product_id?.price,
          brand: w.product_id?.brand,
           image: w.product_id?.image
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${w.product_id.image.replace(/\\/g, "/")}`
      : "/placeholder.png",
  }));
      }
    );

    // ADD
    builder.addCase(
      addWishlist.fulfilled,
      (state, action: PayloadAction<any>) => {
        const w = action.payload;

        state.items.push({
          wishlist_id: w._id,
          product_id: w.product_id?._id || w.product_id,
          name: w.product_id?.product_name,
          price: w.product_id?.price,
          brand: w.product_id?.brand,
          image: w.product_id?.image,
        });
      }
    );

    // REMOVE
    builder.addCase(
      removeWishlist.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (i) => i.wishlist_id !== action.payload
        );
      }
    );
  },
});

export default wishlistSlice.reducer;
