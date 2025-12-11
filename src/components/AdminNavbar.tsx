"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import ListItemButton from "@mui/material/ListItemButton";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

import Link from "next/link";

export default function AdminNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };
  const handleLogout = async () => {
  // Clear HTTP cookies by overwriting them with empty values
  document.cookie = "auth_token=; path=/; max-age=0;";
  document.cookie = "role=; path=/; max-age=0;";

  // Redirect to home or login page
  window.location.href = "/";
};

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { label: "Products", icon: <ShoppingBagIcon />, path: "/admin/product" },
    {label: "Category", icon: <GroupIcon />, path: "/admin/category" },
    { label: "Reports", icon: <BarChartIcon />, path: "/admin/reports" },
    { label: "Users", icon: <GroupIcon />, path: "/admin/users" },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 2000,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* LEFT SIDEBAR - DESKTOP */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            borderRight: "1px solid #ddd",
            p: 2,
          },
        }}
      >
        {/* Profile Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              cursor: "pointer",
            }}
            onClick={openMenu}
          >
            A
          </Avatar>
          <Typography sx={{ mt: 1, fontWeight: "bold" }}>Admin User</Typography>
          <Typography variant="body2" color="gray">
            admin@gmail.com
          </Typography>
        </Box>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
          <MenuItem onClick={closeMenu}>Profile</MenuItem>
          <MenuItem onClick={closeMenu}>Settings </MenuItem>
          <Divider />
         <MenuItem
  onClick={() => {
    closeMenu();
    handleLogout();
  }}
>
  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
</MenuItem>
        </Menu>

        <Divider sx={{ my: 2 }} />

        {/* MENU LINKS */}
        <List>
          {navItems.map((item) => (
            <ListItem disablePadding key={item.label}>
              <Link
                href={item.path}
                style={{ width: "100%", textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton sx={{ display: "flex", gap: 2 }}>
                  {item.icon}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 2 }} />
      </Drawer>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": { width: 240, p: 2 },
        }}
      >
        {/* Profile */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{ width: 70, height: 70, mx: "auto", cursor: "pointer" }}
            onClick={openMenu}
          >
            A
          </Avatar>
          <Typography sx={{ mt: 1, fontWeight: "bold" }}>Admin User</Typography>
          <Typography variant="body2" color="gray">
            admin@gmail.com
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {navItems.map((item) => (
            <ListItem disablePadding key={item.label}>
              <Link
                href={item.path}
                style={{ width: "100%", textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton sx={{ display: "flex", gap: 2 }}>
                  {item.icon}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Divider />
      </Drawer>
    </>
  );
}
