"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Feedback, ExitToApp, AdminPanelSettings } from "@mui/icons-material";
import { logout } from "@/lib/auth-service";

export function DashboardHeader({ user, isAdmin = false }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      handleMenuClose();
    }
  };
  

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1} >
          <Feedback color="primary" />
          <Typography variant="h6" component="div" fontWeight="bold">
            Feedback App
          </Typography>
          {isAdmin && (
            <Typography variant="caption" color="primary" ml={1}>
              Admin
            </Typography>
          )}
        </Box>

        {user ? (
          <>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <Box px={2} py={1}>
                <Typography>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              {!isAdmin && user.role === "admin" && (
                <MenuItem
                  onClick={() => {
                    router.push("/admin");
                    handleMenuClose();
                  }}
                >
                  <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                {isLoggingOut ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Logging out...
                  </Box>
                ) : (
                  "Logout"
                )}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button variant="contained" size="small">
              Login
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}