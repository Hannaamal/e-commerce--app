"use client";

import { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logoutUser } from "@/redux/authSlice";
import Cookies from "js-cookie";

export default function NavbarProfileDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatarLetter, setAvatarLetter] = useState("S");
  const open = Boolean(anchorEl);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, token } = useSelector((state: RootState) => state.auth);
  const loggedIn = !!token || !!Cookies.get("token");

  useEffect(() => {
    if (loggedIn && user?.name) {
      setAvatarLetter(user.name.charAt(0).toUpperCase());
    } else {
      setAvatarLetter("S");
    }
  }, [user, loggedIn]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  

  const handleClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const goToSignup = () => {
    handleClose();
    router.push("/signup");
  };

 const handleLogout = async () => {
  Cookies.remove("token");
  Cookies.remove("auth_token");
  Cookies.remove("role");
  await dispatch(logoutUser());
  router.push("/");
};

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <Avatar>{loggedIn ? avatarLetter : "S"}</Avatar>
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
        {loggedIn ? (
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
