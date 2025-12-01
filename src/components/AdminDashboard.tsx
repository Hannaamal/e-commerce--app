"use client";

import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";

import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import TopSellingProducts from "@/components/TopSellingProducts";
import SatisfactionPie from "@/components/SatisfactionPie";

export default function AdminDashboard() {
  const [products] = useState<any[]>([]);

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

  const topSelling = products.slice(0, 3);

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
          <StatCard label="Total Products" value={products.length} />
        </Box>

        <Box>
          <StatCard
            label="Total Stock Count"
            value={products.reduce((a, b) => a + (b.stock || 0), 0)}
          />
        </Box>

        <Box>
          <StatCard
            label="Total Orders"
            value={JSON.parse(localStorage.getItem("Orders") || "[]").length}
          />
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
