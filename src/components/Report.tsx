"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Sample Data
const ordersData = [
  { date: "2025-11-01", orders: 30, revenue: 1500 },
  { date: "2025-11-02", orders: 45, revenue: 2000 },
  { date: "2025-11-03", orders: 40, revenue: 1800 },
  { date: "2025-11-04", orders: 50, revenue: 2200 },
  { date: "2025-11-05", orders: 60, revenue: 3000 },
];

const topProducts = [
  { name: "Product A", sold: 120 },
  { name: "Product B", sold: 95 },
  { name: "Product C", sold: 80 },
];

export default function ReportsPage() {
  const totalOrders = ordersData.reduce((acc, curr) => acc + curr.orders, 0);
  const totalRevenue = ordersData.reduce((acc, curr) => acc + curr.revenue, 0);
  const topProduct = topProducts[0].name;

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Reports Dashboard
      </Typography>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
          mb: 5,
        }}
      >
        <Card sx={{ flex: "1 1 30%", textAlign: "center", p: 2 }}>
          <CardContent>
            <Typography variant="h6">Total Net Income</Typography>
            <Typography variant="h5" color="primary">
              ${totalRevenue.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 30%", textAlign: "center", p: 2 }}>
          <CardContent>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h5" color="secondary">
              {totalOrders}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 30%", textAlign: "center", p: 2 }}>
          <CardContent>
            <Typography variant="h6">Top Moving Product</Typography>
            <Typography variant="h5" color="success.main">
              {topProduct}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Graphs */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        <Card sx={{ flex: "1 1 48%", p: 2 }}>
          <Typography variant="h6" mb={2}>
            Orders Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card sx={{ flex: "1 1 48%", p: 2 }}>
          <Typography variant="h6" mb={2}>
            Revenue Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Container>
  );
}
