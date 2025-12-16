"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "@/redux/adminorderSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
} from "@mui/material";

export default function AdminOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.adminOrders
  );
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, status: string) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Box className="p-4">
      <Typography variant="h4" mb={3}>
        All Orders
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0); // reset page on filter change
          }}
          size="small"
        >
          <MenuItem value="All">All</MenuItem>
          {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            )
          )}
        </Select>
      </Box>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
              {paginatedOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    {order.userId?.name} ({order.userId?.email})
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      {[
                        "Pending",
                        "Confirmed",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {order.paymentMethod} ({order.paymentStatus})
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      )}
    </Box>
  );
}
