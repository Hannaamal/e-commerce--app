"use client";

import AdminNavbar from "@/components/Admin/AdminNavbar";
import ReportsPage from "@/components/Report";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: 24, padding: 20, width: "100%" }}>
        <ReportsPage />
      </div>
    </div>
  );
}
