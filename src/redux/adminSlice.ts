"use client"
import api from '@/lib/api';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';



// 📦 State Type
interface ProductState {
  products: any[];
  product: any | null;
  loading: boolean;
  error: string | null;
  isRefresh: boolean;
}

// 📌 Initial State
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  isRefresh: false,
};

 // --------------------------------------API Thunks -------------------------------------//


//  List all products
export const listProducts = createAsyncThunk('products/list', async () => {
  const res = await api.get('/api/products');
  console.log(res.data); 
  return res.data;
});

//  Get single product
export const getProduct = createAsyncThunk('products/get', async (id: string) => {
  const res = await api.get(`/api/product/${id}`);
  return res.data;
});

//  Add product
export const addProduct = createAsyncThunk(
  "products/add",
  async (formData: FormData) => {
    const token = Cookies.get("auth_token");  // your JWT from cookie / localStorage
    const role = Cookies.get("role");

    const res = await api.post("/api/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,   // <-- ADD THIS
      },
      withCredentials: true,
    });

    return res.data;
  }
);


//  Edit product
export const editProduct = createAsyncThunk(
  'products/edit',
  async ({ id, productData }: { id: string; productData: any }) => {
    const token = Cookies.get("auth_token");  // your JWT from cookie / localStorage
    const role = Cookies.get("role");
  
    const res = await api.put(`/api/product/${id}`, productData,{
        headers: {
        "Authorization": `Bearer ${token}`,   // <-- ADD THIS
         "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    });

    return res.data;
  }
);

//  Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (id: string) => {

  await api.put(`/api/product/restore/${id}`);
  return id;
});

//  Slice -----------------------------------------
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetRefresh(state) {
      state.isRefresh = false;
    },
  },
  extraReducers: builder => {
    builder
      //  LIST
      .addCase(listProducts.pending, state => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
       
        
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load products';
      })

      //  GET
      .addCase(getProduct.pending, state => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load product';
      })

      //  ADD
      .addCase(addProduct.pending, state => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.data);
        state.isRefresh = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add product';
      })

      //  EDIT
      .addCase(editProduct.pending, state => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map(product =>
          product._id === action.payload.data._id ? action.payload.data : product
        );
        state.isRefresh = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })

      //  DELETE
      .addCase(deleteProduct.pending, state => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { resetRefresh } = productSlice.actions;
export default productSlice.reducer;
