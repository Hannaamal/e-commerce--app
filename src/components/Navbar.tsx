"use client";

import { AppBar, Toolbar, IconButton, Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";


export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200">
      <Toolbar className="flex justify-between">
        <div className="text-xl font-bold">MyShop</div>
        <div className="flex items-center gap-4">
           <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/products">Products</Button>
          <Button color="inherit" component={Link} href="/contact">Contact Us</Button>
          <Button color="inherit" component={Link} href="/login">Login</Button>
          <Link href="/cart">
            <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
        </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}
