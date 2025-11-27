"use client";

const data = [
  { title: "All", icon: "📱" },
  { title: "Beauty", icon: "💻" },
  { title: "Fragnance", icon: "⌚" },
  { title: "Furniture", icon: "📷" },
  { title: "Grocecies", icon: "🎧" },
  { title: "Grocecies", icon: "🎧" },
  { title: "Grocecies", icon: "🎧" }
];

export default function Categories() {
  return (
     <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
    <div className="px-10 py-10">
      <h2 className="text-2xl font-bold mb-3">📦 Browse By Category</h2>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {data.map((c, i) => (
          <div
            key={i}
            className="border rounded-lg px-6 py-4 text-center w-40 cursor-pointer 
                       hover:bg-red-500 hover:text-white transition"
          >
            <div className="text-3xl">{c.icon}</div>
            <p className="font-medium mt-2">{c.title}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
}
