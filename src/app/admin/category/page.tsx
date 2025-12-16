"use client";

import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminCategory from "@/components/Admin/AdminCategory";

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
