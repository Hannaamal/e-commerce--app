"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { fetchRevenueData } from "@/redux/adminreportSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export default function RevenueChart() {
  const dispatch = useDispatch<AppDispatch>();
  const { revenueData, loading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchRevenueData());
  }, [dispatch]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" variant="body1">
        {error}
      </Typography>
    );

  if (!revenueData || revenueData.length === 0)
    return <Typography>No revenue data available.</Typography>;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "background.paper",
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Revenue Over Time
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₹${value}`} />
          <Legend />
          <Line type="monotone" dataKey="totalRevenue" stroke="#1976d2" strokeWidth={3} activeDot={{ r: 6 }} name="Revenue" />
          <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" strokeWidth={3} name="Orders" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
