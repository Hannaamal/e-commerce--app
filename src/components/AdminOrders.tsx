"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "@/redux/adminorderSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Box, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from "@mui/material";

export default function AdminOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, status: string) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Box className="p-4">
      <Typography variant="h4" mb={3}>All Orders</Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.userId?.name} ({order.userId?.email})</TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>
                  <Select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {["Pending","Confirmed","Shipped","Delivered","Cancelled"].map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{order.paymentMethod} ({order.paymentStatus})</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
