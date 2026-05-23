// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function AdminLayout() {
  const getAdminName = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return "Admin";
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.name || "Admin";
    } catch (error) {
      return "Admin";
    }
  };

  const adminName = getAdminName();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <CategoryIcon fontSize="small" />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Inventory2Icon fontSize="small" />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ReceiptLongIcon fontSize="small" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <PeopleIcon fontSize="small" />,
    },
    {
      name: "Admin Management",
      path: "/admin/admins",
      icon: <ManageAccountsIcon fontSize="small" />,
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
                md: "290px",
              },
              p: 3,
              borderRadius: "28px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              height: "fit-content",
              boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
            }}
          >
            {/* Admin info */}
            <Box className="flex items-center gap-3 mb-6">
              <Box className="w-12 h-12 rounded-2xl bg-[#28DF99] text-white flex items-center justify-center">
                <AdminPanelSettingsIcon />
              </Box>

              <Box>
                <Typography fontWeight={900} fontSize={20}>
                  Admin Panel
                </Typography>

                <Typography color="text.secondary" fontSize={13}>
                  {adminName}
                </Typography>
              </Box>
            </Box>

            {/* Menu */}
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
                          color: "primary.main",
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

export default AdminLayout;