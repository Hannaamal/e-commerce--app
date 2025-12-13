"use client";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchMyOrders } from "@/redux/orderSlice";



export default function OrderHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders = [], loading, error } = useSelector(
    (state: RootState) => state.order
  ); // default to empty array

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Order ID: {order._id}</Typography>
              <Typography>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>Status: {order.orderStatus}</Typography>
              <Typography>Total: ₹{order.totalAmount}</Typography>

              <Divider sx={{ my: 2 }} />

              {order.items.map((item: any) => (
                <Box key={item.productId} sx={{ mb: 1 }}>
                  <Typography>
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography>₹{item.price}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
