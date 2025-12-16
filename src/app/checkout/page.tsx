"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { createOrder } from "@/redux/orderSlice";
import { clearCartAPI } from "@/redux/cartSlice";
import { AppDispatch } from "@/redux/store";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const delivery = cartItems.length ? 10 : 0;
  const totalAmount = subtotal + delivery;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.house || !form.city) return alert("Fill all fields");

    const orderPayload = {
      items: cartItems.map((item) => ({
       productId: item.product_id,
        productName: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      address: form,
      paymentMethod: form.paymentMethod,
      totalAmount,
    };

    const result = await dispatch(createOrder(orderPayload));
    if (createOrder.fulfilled.match(result)) {
    dispatch(clearCartAPI()); // <-- clear cart here
    router.replace("/order-success");
  } else {
    alert(result.payload || "Order failed");
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="space-y-2">
        <input name="fullName" placeholder="Full Name" className="border p-2 w-full" onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="border p-2 w-full" onChange={handleChange} />
        <input name="house" placeholder="House / Apartment" className="border p-2 w-full" onChange={handleChange} />
        <input name="street" placeholder="Street" className="border p-2 w-full" onChange={handleChange} />
        <input name="city" placeholder="City" className="border p-2 w-full" onChange={handleChange} />
        <input name="state" placeholder="State" className="border p-2 w-full" onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" className="border p-2 w-full" onChange={handleChange} />
        <select name="paymentMethod" className="border p-2 w-full" onChange={handleChange}>
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online Payment</option>
        </select>
      </div>

      <div className="mt-4 p-4 border">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Delivery: ${delivery.toFixed(2)}</p>
        <p className="font-bold">Total: ${totalAmount.toFixed(2)}</p>
      </div>

      <button onClick={handlePlaceOrder} className="mt-4 w-full p-3 bg-black text-white">Place Order</button>
    </div>
  );
}
