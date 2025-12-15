import AdminNavbar from "@/components/AdminNavbar";
import AdminOrders from "@/components/AdminOrders";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: 24, padding: 20, width: "100%" }}>
        <AdminOrders />
      </div>
    </div>
  );
}
