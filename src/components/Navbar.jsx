// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const getUserRole = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role;
    } catch (error) {
      return null;
    }
  };

  const userRole = getUserRole();
  const isCustomer = isLoggedIn && userRole === "customer";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setOpenMenu(false);

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#28DF99",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "text.primary",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "70px",
            }}
          >
            {/* Logo */}
            <Link to="/" className="no-underline text-inherit">
              <Box className="flex items-center gap-2">
                <ShoppingCartIcon color="primary" />

                <Typography variant="h6" fontWeight={700}>
                  Shopping Cart
                </Typography>
              </Box>
            </Link>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={NavLink}
                  to={link.path}
                  sx={{
                    color: "text.primary",
                    textTransform: "none",
                    fontWeight: 600,
                    "&.active": {
                      color: "primary.main",
                    },
                  }}
                >
                  {link.name}
                </Button>
              ))}

              {/* Customer only My Account button */}
              {isCustomer && (
                <Button
                  component={Link}
                  to="/customer/profile"
                  startIcon={<AccountCircleIcon />}
                  sx={{
                    color: "text.primary",
                    textTransform: "none",
                    fontWeight: 700,
                    ml: 1,
                    "&:hover": {
                      backgroundColor: "#e6fdf4",
                      color: "primary.main",
                    },
                  }}
                >
                  My Account
                </Button>
              )}

              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    ml: 1,
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    ml: 1,
                  }}
                >
                  Login
                </Button>
              )}

              {/* Cart icon - right side last */}
              {isCustomer && (
                <Tooltip title="My Cart">
                  <IconButton
                    component={Link}
                    to="/customer/cart"
                    sx={{
                      ml: 1,
                      backgroundColor: "#e6fdf4",
                      color: "primary.main",
                      width: 44,
                      height: 44,
                      "&:hover": {
                        backgroundColor: "#d1fae5",
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Mobile Burger Menu */}
            <IconButton
              onClick={() => setOpenMenu(true)}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: 260 }}>
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 2,
            }}
          >
            <Link
              to="/"
              onClick={() => setOpenMenu(false)}
              className="no-underline text-inherit"
            >
              <Box className="flex items-center gap-2">
                <ShoppingCartIcon color="primary" />

                <Typography fontWeight={700}>Shopping Cart</Typography>
              </Box>
            </Link>

            <IconButton onClick={() => setOpenMenu(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Mobile Nav Links */}
          <List sx={{ px: 1.5, py: 2 }}>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={link.path}
                  onClick={() => setOpenMenu(false)}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    color: "text.primary",

                    "&.active": {
                      backgroundColor: "#e6fdf4",
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.name}
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Mobile customer only My Cart */}
            {isCustomer && (
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/customer/cart"
                  onClick={() => setOpenMenu(false)}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    color: "text.primary",

                    "&.active": {
                      backgroundColor: "#e6fdf4",
                      color: "primary.main",
                    },
                  }}
                >
                  <ShoppingCartIcon fontSize="small" sx={{ mr: 1.5 }} />

                  <ListItemText
                    primary="My Cart"
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {/* Mobile customer only My Account */}
            {isCustomer && (
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/customer/profile"
                  onClick={() => setOpenMenu(false)}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    color: "text.primary",

                    "&.active": {
                      backgroundColor: "#e6fdf4",
                      color: "primary.main",
                    },
                  }}
                >
                  <AccountCircleIcon fontSize="small" sx={{ mr: 1.5 }} />

                  <ListItemText
                    primary="My Account"
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          {/* Login / Logout Button */}
          <Box sx={{ px: 2, mt: 1 }}>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                onClick={() => setOpenMenu(false)}
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;