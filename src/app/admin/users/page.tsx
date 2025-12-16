"use client";

import AdminNavbar from "@/components/Admin/AdminNavbar";
import UserList from "@/components/Admin/UserList";

export default function AdminUsersPage() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: 5, padding: 20, width: "100%" }}>
        <UserList />
      </div>
    </div>
  );
}