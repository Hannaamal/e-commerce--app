"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type CategoriesProps = {
  onSelectCategory: (category: string) => void;
};

type Category = {
  _id: string;
  title: string;
  image: string; // image URL from DB
};

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [categories, setCategories] = useState<Category[]>([]);

  // 🔥 Fetch categories from backend
  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories/list");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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

            {/* ⭐ Default ALL card */}
            <div
              className={`border rounded-lg px-10 py-7 text-center w-48 cursor-pointer transition 
                ${activeCategory === "All" ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white"}`}
              onClick={() => handleClick("All")}
            >
              <div className="text-3xl">🛒</div>
              <p className="font-medium mt-2">All</p>
            </div>

            {/* ⭐ Dynamic categories from DB */}
            {categories.map((cat) => {
              const isActive = cat.title === activeCategory;

              return (
                <div
                  key={cat._id}
                  className={`border rounded-lg px-10 py-7 text-center w-48 cursor-pointer transition 
                    ${isActive ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white"}`}
                  onClick={() => handleClick(cat.title)}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-12 h-12 mb-2 mx-auto object-contain"
                  />
                  <p className="font-medium mt-2">{cat.title}</p>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
