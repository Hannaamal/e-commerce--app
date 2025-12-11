"use client";

import { useEffect } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchTopRatedProducts } from "@/redux/topRatedSlice";

export default function FlashSales() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { products } = useSelector((state: any) => state.topRated);

  // 🔥 Fetch all products using Redux Thunk
  useEffect(() => {
    dispatch(fetchTopRatedProducts());
  }, [dispatch]);

  // 🔥 Get top-rated 5 products (sorted by rating)
  const topRated = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const handleClickProduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
        <div className="px-10 py-10">
          <h2 className="text-2xl font-bold mb-3">🔥 Flash Sales (Top Rated)</h2>

          {/* Cards */}
          <div className="flex gap-5 overflow-x-auto pb-3">
            {topRated.map((p: any) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 w-56 bg-white shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => handleClickProduct(p._id)}
              >
                <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${p.image.replace(/\\/g, "/")}`}
                    alt={p.product_name}
                    style={{
                      height: 180,
                      width: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                />
                <p className="font-semibold">{p.product_name}</p>
                <p className="text-red-500 font-bold">${p.price}</p>
                <p className="text-yellow-600 text-sm">⭐ {p.rating}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button color="error" component={Link} href="/products">
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
