"use client";

import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full flex justify-center py-10">
      <div className="max-w-7xl w-full px-4">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        {/* GRID LAYOUT ALWAYS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE — CART ITEMS */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-xl"
                >
                  {/* IMAGE */}
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt="product"
                    width={110}
                    height={110}
                    className="rounded-lg"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 ml-5">
                    <h2 className="font-semibold text-lg">{item.product_name}</h2>

                    <p className="text-sm text-gray-500">
                      Brand: {item.brand}
                    </p>

                    <p className="font-semibold mt-1">${item.price}</p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-lg"
                      >
                        −
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
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

          {/* RIGHT — ORDER SUMMARY BOX ALWAYS */}
          <div className="border rounded-xl p-6 bg-white shadow-sm h-fit sticky top-10">
            <h2 className="text-xl font-bold mb-5">Order Summary</h2>

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span className="font-semibold">
                ${subtotal.toFixed(2)}
              </span>
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
                $
                {(
                  subtotal + (cartItems.length === 0 ? 0 : 12.99)
                ).toFixed(2)}
              </span>
            </div>

            {/* CHECKOUT BUTTON */}
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

            {/* Clear cart only if items exist */}
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
