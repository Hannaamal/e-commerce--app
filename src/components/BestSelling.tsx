"use client";

export default function BestSelling() {
  const items = [
    { name: "Winter Jacket", price: "$260", oldPrice: "$330", img: "images/Screenshot 2025-11-09 221118.png" },
    { name: "Gucci Bag", price: "$960", oldPrice: "$1160", img: "images/Screenshot 2025-11-09 221118.png" },
    { name: "RGB CPU Cooler", price: "$160", oldPrice: "$190", img: "images/Screenshot 2025-11-09 221118.png" },
    { name: "Small Bookshelf", price: "$360", oldPrice: "$400", img: "images/Screenshot 2025-11-09 221118.png" },
    { name: "Small Bookshelf", price: "$360", oldPrice: "$400", img: "images/Screenshot 2025-11-09 221118.png" },
  ];

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
    <div className="px-10 py-10">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-3">⭐ Best Selling Products</h2>
        <button className="px-4 py-2 border rounded bg-red-600 text-white">
          View All
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-3">
        {items.map((p, i) => (
          <div key={i} className="border rounded-lg p-4 w-56 bg-white shadow">
            <img src={p.img} className="h-32 mx-auto mb-3" />
            <p className="font-semibold">{p.name}</p>
            <p className="text-red-500 font-bold">{p.price}</p>
            <p className="line-through text-gray-500">{p.oldPrice}</p>
          </div>
        ))}
      </div>
    </div>
    </div>




    
     </div>

     
  );
}



