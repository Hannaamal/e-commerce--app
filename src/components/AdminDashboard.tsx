"use client";

import { useState,useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";

import api from "@/lib/api";

import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import TopSellingProducts from "@/components/TopSellingProducts";
import SatisfactionPie from "@/components/SatisfactionPie";

export default function AdminDashboard() {
  const [products] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
   const [topSelling, setTopSelling] = useState<any[]>([]);
   const[totalOrder,setTotalOrders]=useState(0);

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

useEffect(() => {
  const fetchTotalOrders = async () => {
    try {
      const res = await api.get("/api/total-orders");
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

  const revenueData = [
    { day: "Sun", revenue: 1200 },
    { day: "Mon", revenue: 1800 },
    { day: "Tue", revenue: 900 },
    { day: "Wed", revenue: 2200 },
    { day: "Thu", revenue: 1600 },
    { day: "Fri", revenue: 2900 },
    { day: "Sat", revenue: 2400 },
  ];

  const satisfactionData = [
    { name: "Satisfied", value: 96.99 },
    { name: "Others", value: 3.01 },
  ];


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Dashboard
      </Typography>

      {/* Stat Cards - 1 column on xs, 3 columns on md+ */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        }}
      >
        <Box>
        <StatCard label="Total Products" value={totalProducts} />
        </Box>

        <Box>
            <StatCard label="Total Stock Count" value={totalStock} />
        </Box>

        <Box>
          <StatCard
            label="Total Orders" value={totalOrder}/>
            
        </Box>
      </Box>

      {/* Charts - stack vertically on small screens, side-by-side on md+ */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          mt: 4,
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, // revenue wider than pie on md+
          alignItems: "start",
        }}
      >
        {/* Revenue chart container with fixed height */}
        <Box sx={{ height: { xs: 300, md: 420 }, width: "100%" }}>
          <RevenueChart data={revenueData} />
        </Box>

        {/* Right column: pie (and any other small widgets) */}
        <Box sx={{ display: "grid", gap: 3 }}>
          <Box sx={{ height: { xs: 220, md: 420 }, width: "100%" }}>
            <SatisfactionPie data={satisfactionData} />
          </Box>

          {/* Example small stat card or other widget area (optional) */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {/* <StatCard label="Extra Metric" value={"—"} /> */}
          </Box>
        </Box>
      </Box>

      {/* Top Selling Products (full width) */}
      <Box sx={{ mt: 4 }}>
        <TopSellingProducts products={topSelling} />
      </Box>
    </Box>
  );
}
