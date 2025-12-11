"use client";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
export default function NavbarWrapper() {
  const pathname = usePathname();
   const isAdminRoute = pathname.startsWith("/admin");
if (isAdminRoute) return null;

  return <Navbar/>;
}
