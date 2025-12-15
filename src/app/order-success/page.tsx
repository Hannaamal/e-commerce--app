"use client";

import Link from "next/link";

export default function OrderSuccess() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Order Placed Successfully 🎉</h1>
        <p className="text-gray-600">We will update you once your order is confirmed.</p>

        <Link href="/">
          <span className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg cursor-pointer">
            Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
}
