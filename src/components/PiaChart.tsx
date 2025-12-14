"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardPieChartProps {
  totalUsers: number;
  totalOrders: number;
}

const COLORS = ["#8884d8", "#82ca9d"]; // purple for users, green for orders

export default function DashboardPieChart({ totalUsers, totalOrders }: DashboardPieChartProps) {
  const data = [
    { name: "Users", value: totalUsers },
    { name: "Orders", value: totalOrders },
  ];

  return (
    <Card sx={{ boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Users vs Orders
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
