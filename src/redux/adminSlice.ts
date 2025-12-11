"use client";
import api from "@/lib/api";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const getAuthToken = () =>
  Cookies.get("auth_token") || Cookies.get("token");

// 📦 State Type
interface ProductState {
  products: any[];
  product: any | null;
   total: number;  
  loading: boolean;
  error: string | null;
  isRefresh: boolean;
}

// 📌 Initial State
const initialState: ProductState = {
  products: [],
  product: null,
   total: 0,  
  loading: false,
  error: null,
  isRefresh: false,
};

// --------------------------------------API Thunks -------------------------------------//

//  List all products
export const listProducts = createAsyncThunk(
  "admin/listProducts",
  async (params: { skip?: number; limit?: number } = {}) => {
    const { skip = 0, limit = 10 } = params;

    const { data } = await api.get(
      `/api/products?skip=${skip}&limit=${limit}`
    );

    console.log(data);
    return data;
  }
);


//  Get single product
export const getProduct = createAsyncThunk(
  "products/get",
  async (id: string) => {
    const res = await api.get(`/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return res.data;
  }
);
//  Add product
export const addProduct = createAsyncThunk("products/add", async (formData: FormData) => {
const token = getAuthToken();
if (!token) console.log("WARNING: token missing");


const res = await api.post("/api/product", formData, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data",
},
});
return res.data; // expected shape: { data: product }
});


export const editProduct = createAsyncThunk(
"products/edit",
async ({ id, productData }: { id: string; productData: any }) => {
const token = getAuthToken();
if (!token) console.log("WARNING: token missing");


const res = await api.put(`/api/product/${id}`, productData, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data",
},
});
return res.data;
}
);


export const deleteProduct = createAsyncThunk("products/delete", async (id: string) => {
const token = getAuthToken();
if (!token) console.log("WARNING: token missing");


const res = await api.put(
`/api/product/restore/${id}`,
{},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);


// backend returns deleted product in res.data.data
// return the id to let reducer filter products by id
const returnedId = res?.data?.data?._id || id;
return returnedId;
});


//  Slice -----------------------------------------
const adminproductSlice = createSlice({
  name: "adminproducts",
  initialState,
  reducers: {
    resetRefresh(state) {
      state.isRefresh = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //  LIST
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      });
    builder
      .addCase(listProducts.fulfilled, (state, action) => {
        state.products = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load products";
      })

      //  GET
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load product";
      })

      //  ADD
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.data);
        state.isRefresh = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })

      //  EDIT
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product._id === action.payload.data._id
            ? action.payload.data
            : product
        );
        state.isRefresh = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })

      //  DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { resetRefresh } = adminproductSlice.actions;
export default adminproductSlice.reducer;