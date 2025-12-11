"use client";

import AdminNavbar from "@/components/AdminNavbar";
import AdminCategory from "@/components/AdminCategory";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: 24, padding: 20, width: "100%" }}>
        <AdminCategory />
      </div>
    </div>
  );
}
