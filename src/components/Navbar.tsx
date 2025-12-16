"use client";

import { AppBar, Toolbar, IconButton, Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCartItems } from "@/redux/cartSlice";
import NavbarProfileDropdown from "./NavbarProfileDropdown";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/Context/AuthContext"; // ✅ using auth context
import { fetchWishlist } from "@/redux/wishlistSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();

  // 👇 useAuth for login detection
  const { user, token, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const loggedIn = isAuthenticated || !!token;
  const role = user?.role;
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const cartCount = cartItems?.length || 0;
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const wishlistCount = wishlistItems?.length || 0;

  // Load wishlist from localStorage safely
  useEffect(() => {
    if (loggedIn) {
      dispatch(fetchCartItems());
      dispatch(fetchWishlist());
    }
  }, [loggedIn, dispatch]);

  const handleCartOpen = async () => {
    if (loggedIn) {
      await dispatch(fetchCartItems());
    }
  };
  const NavButton = ({
    href,
    label,
    pathname,
  }: {
    href: string;
    label: string;
    pathname: string;
  }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
      <Button
        component={Link}
        href={href}
        sx={{
          backgroundColor: isActive ? "black" : "transparent",
          color: isActive ? "white" : "gray",
          fontWeight: isActive ? "bold" : "normal",
          "&:hover": {
            backgroundColor: isActive ? "black" : "#f5f5f5",
          },
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      className="border-b border-gray-200"
    >
      <Toolbar className="flex justify-between">
        <Link href="/">
          <div className="text-xl font-bold cursor-pointer">MyShop</div>
        </Link>

        <div className="flex items-center gap-4">
          <NavButton href="/" label="Home" pathname={pathname} />
          <NavButton href="/products" label="Products" pathname={pathname} />
          <NavButton href="/contact" label="Contact Us" pathname={pathname} />

          {/* CUSTOMER ONLY: Cart + Wishlist */}
          {loggedIn && isCustomer && (
            <>
              <Link href="/wishlist">
                <IconButton
                  sx={{
                    color: pathname === "/wishlist" ? "black" : "gray",
                    backgroundColor:
                      pathname === "/wishlist" ? "#847070ff" : "transparent",
                  }}
                >
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Link>

              <Link href="/cart">
                <IconButton
                  onClick={handleCartOpen}
                  sx={{
                    color: pathname === "/cart" ? "black" : "gray",
                    backgroundColor:
                      pathname === "/cart" ? "#816e6eff" : "transparent",
                  }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </>
          )}

          {loggedIn ? (
            <NavbarProfileDropdown />
          ) : (
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
