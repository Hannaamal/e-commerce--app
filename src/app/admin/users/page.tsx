"use client";

import AdminNavbar from "@/components/AdminNavbar";
import UserList from "@/components/UserList";

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