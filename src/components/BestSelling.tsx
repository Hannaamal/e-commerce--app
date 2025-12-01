"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BestSelling() {
  const router = useRouter();

  const items = [
    { id: 1, name: "Winter Jacket", price: "$260", oldPrice: "$330", img: "/images/photo-1547887537-6158d64c35b3.png" },
    { id: 2, name: "Gucci Bag", price: "$960", oldPrice: "$1160", img: "/images/photo-1608571423902-eed4a5ad8108.png" },
    { id: 3, name: "RGB CPU Cooler", price: "$160", oldPrice: "$190", img: "/images/premium_photo-1670537994863-5ad53a3214e0.png" },
    { id: 4, name: "Small Bookshelf", price: "$360", oldPrice: "$400", img: "/images/photo-1608571423902-eed4a5ad8108.png" },
    { id: 5, name: "Modern Lamp", price: "$120", oldPrice: "$150", img: "/images/premium_photo-1739831741770-008b9a494e32.png" },
  ];

  const handleSelectProduct = (product: any) => {
    // Store the selected product in localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    // Navigate to products page
    router.push("/products");
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">

        {/* HEADER */}
        <div className="flex justify-between px-2 pb-4">
          <h2 className="text-2xl font-bold">⭐ Best Selling Products</h2>
          <Link href="/products">
            <button className="px-4 py-2 border rounded bg-red-600 text-white hover:bg-red-700">
              View All
            </button>
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="flex gap-5 overflow-x-auto pb-3">
          {items.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelectProduct(p)}
              className="border rounded-lg p-4 w-56 bg-white shadow hover:shadow-xl cursor-pointer transition no-underline"
            >
              <div className="w-full h-36 flex justify-center items-center overflow-hidden">
                <img src={p.img} className="h-full object-contain" alt={p.name} />
              </div>

              <p className="font-semibold mt-2">{p.name}</p>
              <p className="text-red-600 font-bold">{p.price}</p>
              <p className="line-through text-gray-500 text-sm">{p.oldPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
