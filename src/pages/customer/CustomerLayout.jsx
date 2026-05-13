// src/pages/customer/CustomerLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";

function CustomerLayout() {
  const menuItems = [
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      name: "Cart",
      path: "/customer/cart",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      name: "Order History",
      path: "/customer/orders",
      icon: <HistoryIcon fontSize="small" />,
    },
    {
      name: "Notifications",
      path: "/customer/notifications",
      icon: <NotificationsIcon fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7fbff 0%, #ecfdf5 55%, #f7fbff 100%)",
      }}
    >
      <Container maxWidth="lg" className="py-8">
        <Box className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                md: "280px",
              },
              p: 3,
              borderRadius: "28px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              height: "fit-content",
              boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
            }}
          >
            <Box className="flex items-center gap-3 mb-6">
              <Box className="w-12 h-12 rounded-2xl bg-[#28DF99] text-white flex items-center justify-center">
                <DashboardIcon />
              </Box>

              <Box>
                <Typography fontWeight={900} fontSize={20}>
                  Dashboard
                </Typography>

                <Typography color="text.secondary" fontSize={13}>
                  Customer panel
                </Typography>
              </Box>
            </Box>

            <Box className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="no-underline"
                >
                  {({ isActive }) => (
                    <Box
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                      sx={{
                        backgroundColor: isActive ? "#e6fdf4" : "transparent",
                        color: isActive ? "primary.main" : "text.primary",
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                        },
                      }}
                    >
                      {item.icon}

                      <Typography fontWeight={800} fontSize={14}>
                        {item.name}
                      </Typography>
                    </Box>
                  )}
                </NavLink>
              ))}
            </Box>
          </Paper>

          {/* Right Content */}
          <Box className="flex-1">
            <Outlet />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CustomerLayout;