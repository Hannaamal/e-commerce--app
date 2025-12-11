"use client";

import { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logoutUser } from "@/redux/authSlice";

export default function NavbarProfileDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatarLetter, setAvatarLetter] = useState("S");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.name) setAvatarLetter(user.name.charAt(0).toUpperCase());
  }, [user]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    handleClose();
    router.push("/login");
  };

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <Avatar>{avatarLetter}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={goToProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
