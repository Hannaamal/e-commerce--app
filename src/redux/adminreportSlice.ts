import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


// Async thunk to fetch revenue over time
export const fetchRevenueData = createAsyncThunk(
  "reports/fetchRevenueData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/report/revenue-over-time", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("auth_token")}`, // if using JWT
        },
      });
      const data = await res.json();
      if (!data.status) throw new Error(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    revenueData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
