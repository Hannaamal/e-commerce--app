"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  // ✅ Load items from localStorage safely
 useEffect(() => {
  if (typeof window !== "undefined") {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    const cleaned = stored.map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));
    setCartItems(cleaned);
  }
}, []);
const updateQty = (id: string, newQty: number) => {
  setCartItems((prev) => {
    let updated;
    if (newQty < 1) {
      // Remove item if quantity drops below 1
      updated = prev.filter((item) => item.id !== id);
    } else {
      // Update quantity normally
      updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      );
    }
    localStorage.setItem("cart", JSON.stringify(updated));
    return updated;
  });
};

  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated)); // 🔥 update localStorage
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

 const subtotal = cartItems.reduce((total, item) => {
  const price = Number(item.price) || 0;
  const qty = Number(item.quantity) || 1;
  return total + price * qty;
}, 0);


  return (
    <div className="w-full flex justify-center py-10">
      <div className="max-w-7xl w-full px-4">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                 key={item._id || item.product_name || Math.random()}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-xl"
                >
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt="product"
                    width={110}
                    height={110}
                    className="rounded-lg"
                  />

                  <div className="flex-1 ml-5">
                    <h2 className="font-semibold text-lg">
                      {item.product_name}
                    </h2>

                    <p className="text-sm text-gray-500">Brand: {item.brand}</p>

                    <p className="font-semibold mt-1">${item.price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-lg"
                      >
                        −
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 text-sm mt-3"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="text-lg font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border rounded-xl p-6 bg-white shadow-sm h-fit sticky top-10">
            <h2 className="text-xl font-bold mb-5">Order Summary</h2>

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Delivery</span>
              <span>${cartItems.length === 0 ? "0.00" : "12.99"}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Discount</span>
              <span>-</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
              <span>Total</span>
              <span>
                ${(subtotal + (cartItems.length === 0 ? 0 : 12.99)).toFixed(2)}
              </span>
            </div>

            <button
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-lg mt-5 
                ${
                  cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              Checkout
            </button>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full border border-red-500 text-red-600 py-2 rounded-lg mt-4 hover:bg-red-600 hover:text-white"
              >
                Clear Cart
              </button>
            )}

            <p className="text-sm text-gray-500 mt-3 underline text-center cursor-pointer">
              Use a promo code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
