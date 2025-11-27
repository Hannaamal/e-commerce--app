"use client";

import { Button } from "@mui/material";

export default function FlashSales() {
  const products = [
    {
      name: "HAVIT HV-G92 Gamepad",
      price: "$120",
      oldPrice: "$160",
      off: "40%",
      img: "images/Screenshot 2025-11-09 220929.png",
    },
    {
      name: "AK-900 Wired Keyboard",
      price: "$960",
      oldPrice: "$1160",
      off: "35%",
      img: "images/Screenshot 2025-11-09 220939.png",
    },
    {
      name: "IPS LCD Gaming Monitor",
      price: "$370",
      oldPrice: "$400",
      off: "25%",
      img: "images/Screenshot 2025-11-09 220939.png",
    },
    {
      name: "HAVIT HV-G92 Gamepad",
      price: "$120",
      oldPrice: "$160",
      off: "40%",
      img: "images/Screenshot 2025-11-09 220914.png",
    },
    {
      name: "AK-900 Wired Keyboard",
      price: "$960",
      oldPrice: "$1160",
      off: "35%",
      img: "images/Screenshot 2025-11-09 220929.png",
    },
  ];

  return (
     <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
    <div className="px-10 py-10">
      <h2 className="text-2xl font-bold mb-3">🔥 Flash Sales</h2>

      {/* Cards */}
      <div className="flex gap-5 overflow-x-auto pb-3">
        {products.map((p, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 w-56 bg-white shadow hover:shadow-lg transition"
          >
            <img src={p.img} className="h-32 mx-auto mb-3" />
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
        <Button variant="contained" color="error">View All Products</Button>
      </div>
    </div>
    </div>
    </div>
  );
}
