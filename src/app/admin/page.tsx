"use client";

import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminDashboard from "@/components/Admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />

      {/* Main content area */}
      <div style={{ marginLeft: 5, padding: 20, width: "100%" }}>
        <AdminDashboard />
      </div>
    </div>
  );
}
