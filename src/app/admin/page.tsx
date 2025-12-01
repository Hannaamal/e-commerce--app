"use client";

import AdminNavbar from "@/components/AdminNavbar";
import AdminDashboard from "@/components/AdminDashboard";

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
