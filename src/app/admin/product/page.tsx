"use client";

import AdminNavbar from "@/components/Admin/AdminNavbar";
import AddProduct from "@/components/AddProduct";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: 24, padding: 20, width: "100%" }}>
        <AddProduct />
      </div>
    </div>
  );
}
