// src/pages/customer/CustomerLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";

function CustomerLayout() {
  const menuItems = [
    {
      label: "Profile",
      path: "/customer/profile",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: "Cart",
      path: "/customer/cart",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      label: "Order History",
      path: "/customer/orders",
      icon: <HistoryIcon fontSize="small" />,
    },
    {
      label: "Notifications",
      path: "/customer/notifications",
      icon: <NotificationsIcon fontSize="small" />,
    },
  ];

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#16a66d" : "#111827",
    backgroundColor: isActive ? "#e6fdf4" : "transparent",
    border: isActive ? "2px solid #111827" : "2px solid transparent",
    borderRadius: "16px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: 500,
    transition: "0.2s",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fbff 0%, #ecfdf5 55%, #f7fbff 100%)",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 3,
          md: 5,
        },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "280px minmax(0, 1fr)",
          },
          gap: {
            xs: 3,
            lg: 4,
          },
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "28px",
            border: "1px solid #e5e7eb",
            backgroundColor: "white",
            boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: "16px",
                backgroundColor: "#28DF99",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <DashboardIcon />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={900}
                sx={{
                  overflowWrap: "anywhere",
                  lineHeight: 1.3,
                }}
              >
                Dashboard
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  overflowWrap: "anywhere",
                  lineHeight: 1.3,
                }}
              >
                Customer panel
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
                lg: "column",
              },
              gap: 1.5,
              overflowX: {
                xs: "visible",
                sm: "auto",
                lg: "visible",
              },
              pb: {
                xs: 0,
                sm: 1,
                lg: 0,
              },
            }}
          >
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path} style={linkStyle}>
                {item.icon}
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
              </NavLink>
            ))}
          </Box>
        </Paper>

        {/* Main Content */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default CustomerLayout;