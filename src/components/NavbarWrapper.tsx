"use client";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname === "/not-authorized" ||
    pathname === "/admin/not-authorized";

  if (hideNavbar) return null;

  return <Navbar />;
}
