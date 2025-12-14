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
  selectedCategory: "All"
}

// 📌 Initial State
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  isRefresh: false,
  selectedCategory: "All",
};

 // --------------------------------------API Thunks -------------------------------------//


//  List all products


export const listProducts = createAsyncThunk(
  "products/fetch",
  async (category: string) => {
    const query = category && category !== "All" ? `?category=${category}` : "";
    const res = await api.get(`/api/customer/products${query}`);
    return res.data.data;
  }
);





//  Get single product
export const getProduct = createAsyncThunk('products/get', async (id: string) => {
  const res = await api.get(`/api/customer/products/${id}`);
  return res.data;
});


//  Slice -----------------------------------------
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
    state.selectedCategory = action.payload;
  },
  resetRefresh(state) {
    state.isRefresh = false;
  }
},
  extraReducers: builder => {
    builder
      //  LIST
      .addCase(listProducts.pending, state => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
       
       
        
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

export const { resetRefresh,setSelectedCategory, } = productSlice.actions;
export default productSlice.reducer;
