"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NavbarProfileDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  // Example user data (replace with your auth state)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    loggedIn: true, // or false
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    handleClose();
    router.push("/profile"); // your profile page route
  };

  const goToSignup = () => {
    handleClose();
    router.push("/signup"); // signup page route
  };

  const handleLogout = () => {
    handleClose();
    // Add your logout logic here
    console.log("User logged out");
    router.push("/"); // redirect after logout
  };

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <Avatar src={user.avatar} alt={user.name} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user.loggedIn ? (
          <>
            <MenuItem onClick={goToProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={goToSignup}>Sign Up</MenuItem>
        )}
      </Menu>
    </>
  );
}
