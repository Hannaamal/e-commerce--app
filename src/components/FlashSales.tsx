"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FlashSales() {
  const router = useRouter();

  const products = [
    {
      id: "p1",
      name: "HAVIT HV-G92 Gamepad",
      price: "$120",
      oldPrice: "$160",
      off: "40%",
      img: "images/photo-1547887537-6158d64c35b3.png",
    },
    {
      id: "p2",
      name: "AK-900 Wired Keyboard",
      price: "$960",
      oldPrice: "$1160",
      off: "35%",
      img: "images/premium_photo-1739831741770-008b9a494e32.png",
    },
    {
      id: "p3",
      name: "IPS LCD Gaming Monitor",
      price: "$370",
      oldPrice: "$400",
      off: "25%",
      img: "images/photo-1608571423902-eed4a5ad8108.png",
    },
    {
      id: "p4",
      name: "HAVIT HV-G92 Gamepad",
      price: "$120",
      oldPrice: "$160",
      off: "40%",
      img: "images/premium_photo-1670537994863-5ad53a3214e0.png",
    },
    {
      id: "p5",
      name: "AK-900 Wired Keyboard",
      price: "$960",
      oldPrice: "$1160",
      off: "35%",
      img: "images/Screenshot 2025-11-09 220929.png",
    },
  ];

  const handleClickProduct = (productId: string) => {
    // Save the clicked product ID
    localStorage.setItem("selectedProductId", productId);

    // Navigate to products page
    router.push("/products");
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
        <div className="px-10 py-10">
          <h2 className="text-2xl font-bold mb-3">🔥 Flash Sales</h2>

          {/* Cards */}
          <div className="flex gap-5 overflow-x-auto pb-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 w-56 bg-white shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => handleClickProduct(p.id)}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-70 h-40 object-cover mb-3"
                />
                <p className="font-semibold">{p.name}</p>
                <p className="text-red-500 font-bold">{p.price}</p>
                <p className="line-through text-gray-500">{p.oldPrice}</p>
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                  {p.off} OFF
                </span>
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
