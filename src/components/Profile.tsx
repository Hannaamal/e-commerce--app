"use client";

import { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, IconButton, Button } from "@mui/material";
import Link from "next/link";

export default function ProfileDropdown() {
  const [user, setUser] = useState<any>(null); // dynamic user
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // simulate fetching user from localStorage / API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleClose();
    alert("Logged out!");
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="large">
        <Avatar>{user ? user.name.charAt(0) : "G"}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {user ? (
          <>
            <MenuItem disabled>Hello, {user.name}</MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/profile">Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/profile/edit">Edit Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleClose}>
              <Link href="/login">Login</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/signup">Signup</Link>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
