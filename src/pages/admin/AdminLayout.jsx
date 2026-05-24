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
        width: "100%",
        overflowX: "hidden",
        background:
          "linear-gradient(180deg, #f7fbff 0%, #ecfdf5 55%, #f7fbff 100%)",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          py: {
            xs: 3,
            sm: 4,
          },
          px: {
            xs: 2,
            sm: 3,
            lg: 0,
          },
          width: "100%",
          maxWidth: {
            xs: "100%",
            lg: "1200px",
          },
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              xl: "row",
            },
            gap: {
              xs: 3,
              xl: 4,
            },
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowX: "hidden",
            boxSizing: "border-box",
            alignItems: "flex-start",
          }}
        >
          {/* Left Sidebar */}
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                xl: "290px",
              },
              flexShrink: 0,
              p: {
                xs: 2.5,
                sm: 3,
              },
              borderRadius: "28px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              height: "fit-content",
              boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              minWidth: 0,
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* Admin info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "16px",
                  backgroundColor: "#28DF99",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AdminPanelSettingsIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: {
                      xs: 18,
                      sm: 20,
                    },
                    lineHeight: 1.25,
                    overflowWrap: "normal",
                    wordBreak: "normal",
                  }}
                >
                  Admin Panel
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                  sx={{
                    lineHeight: 1.4,
                    overflowWrap: "anywhere",
                  }}
                >
                  {adminName}
                </Typography>
              </Box>
            </Box>

            {/* Menu */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "row",
                  xl: "column",
                },
                flexWrap: {
                  xs: "wrap",
                  xl: "nowrap",
                },
                gap: 1.2,
                width: "100%",
                maxWidth: "100%",
                overflowX: "hidden",
                boxSizing: "border-box",
              }}
            >
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="no-underline"
                  style={{
                    flex: "1 1 auto",
                    minWidth: "fit-content",
                  }}
                >
                  {({ isActive }) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        px: {
                          xs: 1.8,
                          sm: 2,
                        },
                        py: 1.4,
                        borderRadius: "16px",
                        backgroundColor: isActive ? "#e6fdf4" : "transparent",
                        color: isActive ? "primary.main" : "text.primary",
                        border: isActive
                          ? "2px solid #111827"
                          : "2px solid transparent",
                        transition: "0.2s",
                        width: {
                          xs: "auto",
                          xl: "100%",
                        },
                        minWidth: 0,
                        boxSizing: "border-box",
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                          color: "primary.main",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Typography
                        fontWeight={800}
                        fontSize={14}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  )}
                </NavLink>
              ))}
            </Box>
          </Paper>

          {/* Right Content */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "hidden",
              boxSizing: "border-box",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default AdminLayout;