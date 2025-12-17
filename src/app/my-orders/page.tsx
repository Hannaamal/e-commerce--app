"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/redux/myorderSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export default function MyOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: any) => state.myorder);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order: any) => (
        <div key={order._id} className="border rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex justify-between mb-2">
           
            <span className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p>
            Status: <b>{order.orderStatus}</b>
          </p>
          <p>
            Payment: {order.paymentMethod} ({order.paymentStatus})
          </p>
          <p>Total: ₹{order.totalAmount}</p>

          <hr className="my-3" />

          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex gap-4 mb-2">
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`} // adjust your base URL
                alt={item.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.productName}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
