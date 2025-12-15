"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueData } from "@/redux/adminreportSlice";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { AppDispatch } from "@/redux/store";

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { revenueData, loading } = useSelector((state) => state.reports);


  useEffect(() => {
    dispatch(fetchRevenueData());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  // Use revenueData directly in your charts
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalRevenue" fill="#1976d2" name="Revenue" />
        <Bar dataKey="totalOrders" fill="#82ca9d" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
}
