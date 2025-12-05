"use client";

import { AppBar, Toolbar, IconButton, Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import NavbarProfileDropdown from "./NavbarProfileDropdown";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth_token"); // check if token exists
    setIsLoggedIn(!!token);

    if (token) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setCartCount(cart.length);
      setWishlistCount(wishlist.length);
    }
  }, []);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      className="border-b border-gray-200"
    >
      <Toolbar className="flex justify-between">
        <div className="text-xl font-bold">MyShop</div>
        <div className="flex items-center gap-4">
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} href="/contact">
            Contact Us
          </Button>

          {isLoggedIn && (
            <>
              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <IconButton color="inherit">
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart">
                <IconButton color="inherit">
                  <Badge
                    badgeContent={
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50"></span>
                        <span className="relative inline-flex items-center justify-center h-6 w-6 rounded-full bg-sky-500 text-white font-bold">
                          {cartCount}
                        </span>
                      </span>
                    }
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </>
          )}

          {/* Profile Dropdown */}
          {isLoggedIn ? (
            <NavbarProfileDropdown />
          ) : (
            <>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
