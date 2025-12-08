"use client";

import { useState } from "react";

type CategoriesProps = {
  onSelectCategory: (category: string) => void;
};

const data = [
  { title: "All", icon: "🛒" },
  { title: "Beauty", icon: "💄" },
  { title: "fragrances", icon: "🌸" },
  { title: "Furniture", icon: "🛋️" },
  { title: "Groceries", icon: "🛍️" }
];

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handleClick = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-7xl w-full px-4">
        <div className="px-10 py-10">
          <h2 className="text-2xl font-bold mb-3">📦 Browse By Category</h2>

          <div className="flex gap-4 overflow-x-auto pb-3">
            {data.map((c, i) => {
              const isActive = c.title === activeCategory;
              return (
                <div
                  key={i}
                  className={`border rounded-lg px-10 py-7 text-center w-48 cursor-pointer 
                    transition 
                    ${isActive ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white"}`}
                  onClick={() => handleClick(c.title)}
                >
                  <div className="text-3xl">{c.icon}</div>
                  <p className="font-medium mt-2">{c.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
