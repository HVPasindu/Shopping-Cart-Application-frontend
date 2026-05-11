// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

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
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

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
      <Drawer
        anchor="left"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
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

                <Typography fontWeight={700}>
                  Shopping Cart
                </Typography>
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
          </List>

          {/* Login Button */}
          <Box sx={{ px: 2, mt: 1 }}>
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
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;