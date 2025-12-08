"use client";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchBestSellingProducts } from "@/redux/bestsellingSlice";
import { useRouter } from "next/navigation";

export default function BestSelling() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { bestSelling, loading, error } = useSelector(
    (state: RootState) => state.bestSelling
  );

  useEffect(() => {
    dispatch(fetchBestSellingProducts());
  }, [dispatch]);

  if (loading) return <p>Loading best-selling products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
        <h2 className="text-2xl font-bold mb-3">🔥 Best Selling</h2>
        <div className="flex gap-5 overflow-x-auto pb-3">
          {bestSelling.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 w-56 bg-white shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/products/${p._id}`)}
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
          <Button color="error" onClick={() => router.push("/products")}>
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
}
