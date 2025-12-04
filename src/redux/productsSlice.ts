"use client"
import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



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

  },
});

export const { resetRefresh } = productSlice.actions;
export default productSlice.reducer;
