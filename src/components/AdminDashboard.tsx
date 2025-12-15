"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import Cookies from "js-cookie";
import api from "@/lib/api";

import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import TopSellingProducts from "@/components/TopSellingProducts";
import { PieChart } from "recharts";
import DashboardPieChart from "./PiaChart";

export default function AdminDashboard() {
  const [products] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [topSelling, setTopSelling] = useState<any[]>([]);
   const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);



  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const res = await api.get("/api/count");
        setTotalProducts(res.data.total);
      } catch (err) {
        console.error("Error fetching total products:", err);
      }
    };
    fetchTotalProducts();
  }, []);

   useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get("auth_token");

      const res = await api.get("/api/admin/total-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalUsers(res.data.totalUsers);
      setTotalOrders(res.data.totalOrders);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const res = await api.get("/api/total-stock");
        setTotalStock(res.data.totalStock);
      } catch (err) {
        console.error("Error fetching total stock:", err);
      }
    };

    fetchTotalStock();
  }, []);


//   useEffect(() => {
//   const fetchTotals = async () => {
//     try {
//       const usersRes = await api.get("/api/users/total");
//       setTotalUsers(usersRes.data.totalUsers);

//       const ordersRes = await api.get("/api/orders/total");
//       setTotalOrders(ordersRes.data.totalOrders);
//     } catch (err) {
//       console.error("Error fetching totals:", err);
//     }
//   };

//   fetchTotals();
// }, []);


  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const res = await api.get("/api/admin/total-orders");
        setTotalOrders(res.data.totalOrders);
      } catch (err) {
        console.error("Error fetching total orders:", err);
      }
    };

    fetchTotalOrders();
  }, []);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const res = await api.get("/api/best-selling");
        if (res.data.status) {
          setTopSelling(res.data.data); // set the top-selling products state
        }
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
      }
    };

    fetchTopSelling();
  }, []);

  

  return (
  <Box sx={{ p: 4 }}>
  {/* Header */}
  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 6 }}>
    Dashboard
  </Typography>

  {/* Stat Cards */}
  <Box
    sx={{
      display: "grid",
      gap: 4,
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, // 2 cards in md+
      mb: 6, // space below stat cards
    }}
  >
    <Box sx={{ width: "100%", height: 220 }}>
      <StatCard label="Total Products" value={totalProducts} />
    </Box>

    <Box sx={{ width: "100%", height: 220 }}>
      <StatCard label="Total Stock Count" value={totalStock} />
    </Box>
  </Box>

  {/* Charts Section */}
  <Box
    sx={{
      display: "grid",
      gap: 4,
      gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
      mb: 6, // space below charts
    }}
  >
    <Box sx={{ height: 400 }}>
      <RevenueChart />
    </Box>
    <Box sx={{ mt: 4 }}>
  <DashboardPieChart totalUsers={totalUsers} totalOrders={totalOrders} />
</Box>
  </Box>

  {/* Top Selling Products */}
  <Box sx={{ mb: 6 }}>
    <TopSellingProducts products={topSelling} />
  </Box>
</Box>
  )
}
