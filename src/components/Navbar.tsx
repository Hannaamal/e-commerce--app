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

import { useAuth } from "@/Context/AuthContext"; // ✅ using auth context

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();

  // 👇 useAuth for login detection
  const { user, token, isAuthenticated } = useAuth();

  const loggedIn = isAuthenticated || !!token;

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const cartCount = cartItems?.length || 0;

  const [wishlistCount, setWishlistCount] = useState(0);

  // Load wishlist from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(list.length);
    }
  }, []);

  const handleCartOpen = async () => {
    if (loggedIn) {
      await dispatch(fetchCartItems());
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200">
      <Toolbar className="flex justify-between">
        <div className="text-xl font-bold">MyShop</div>

        <div className="flex items-center gap-4">
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/products">Products</Button>
          <Button color="inherit" component={Link} href="/contact">Contact Us</Button>

          {/* Show Cart + Wishlist only when logged in */}
          {loggedIn && (
            <>
              <Link href="/wishlist">
                <IconButton color="inherit">
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Link>

              <Link href="/cart">
                <IconButton color="inherit" onClick={handleCartOpen}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </>
          )}

          {/* Profile Dropdown or Login */}
          {loggedIn ? (
            <NavbarProfileDropdown />
          ) : (
            <Button color="inherit" component={Link} href="/login">Login</Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
