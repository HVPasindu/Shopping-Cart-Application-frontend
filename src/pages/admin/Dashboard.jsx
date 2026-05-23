// src/pages/admin/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function Dashboard() {
  const navigate = useNavigate();

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

  const cards = [
    {
      title: "Categories",
      text: "Create, update, activate, or deactivate product categories.",
      path: "/admin/categories",
      icon: <CategoryIcon />,
    },
    {
      title: "Products",
      text: "Add products, update stock, prices, images, and product status.",
      path: "/admin/products",
      icon: <Inventory2Icon />,
    },
    {
      title: "Orders",
      text: "View customer orders and update order status.",
      path: "/admin/orders",
      icon: <ReceiptLongIcon />,
    },
    {
      title: "Users",
      text: "Manage customers and customer account status.",
      path: "/admin/users",
      icon: <PeopleIcon />,
    },
    {
      title: "Admin Management",
      text: "View admins, create new admins, and update admin status.",
      path: "/admin/admins",
      icon: <ManageAccountsIcon />,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 3,
          sm: 4,
        },
        borderRadius: "28px",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <Box
        className="rounded-[26px] p-6 mb-8"
        sx={{
          background:
            "linear-gradient(135deg, #28DF99 0%, #a7f3d0 55%, #f6f7d4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.28)",
            top: -45,
            right: -35,
          }}
        />

        <Box className="relative">
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-[#16a66d] font-bold text-sm mb-4">
            <DashboardIcon fontSize="small" />
            Admin Dashboard
          </Box>

          <Typography
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "30px",
                sm: "44px",
              },
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Welcome, {adminName}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: "600px",
              color: "#334155",
              fontSize: {
                xs: "14px",
                sm: "16px",
              },
              lineHeight: 1.7,
            }}
          >
            Manage categories, products, orders, users, and admin accounts from
            one clean admin panel.
          </Typography>
        </Box>
      </Box>

      {/* Small info row */}
      <Box className="flex flex-col sm:flex-row gap-4 mb-8">
        <Box
          className="flex-1 p-4 rounded-[22px] flex items-center gap-4"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box className="w-12 h-12 rounded-2xl bg-[#e6fdf4] text-[#16a66d] flex items-center justify-center">
            <AdminPanelSettingsIcon />
          </Box>

          <Box>
            <Typography fontWeight={900}>Admin Access</Typography>
            <Typography color="text.secondary" fontSize={14}>
              You are logged in as an administrator.
            </Typography>
          </Box>
        </Box>

        <Box
          className="flex-1 p-4 rounded-[22px] flex items-center gap-4"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box className="w-12 h-12 rounded-2xl bg-[#e6fdf4] text-[#16a66d] flex items-center justify-center">
            <ReceiptLongIcon />
          </Box>

          <Box>
            <Typography fontWeight={900}>Management Area</Typography>
            <Typography color="text.secondary" fontSize={14}>
              Use the cards below to manage each section.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick cards */}
      <Box>
        <Typography fontWeight={900} fontSize={24}>
          Quick Actions
        </Typography>

        <Typography color="text.secondary" className="mt-1 mb-5">
          Select what you want to manage.
        </Typography>

        <Box className="flex flex-wrap gap-5">
          {cards.map((card) => (
            <Box
              key={card.title}
              onClick={() => navigate(card.path)}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 10px)",
                },
                p: 3,
                borderRadius: "24px",
                backgroundColor: "#f7fbff",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "0.25s",
                "&:hover": {
                  backgroundColor: "#ecfdf5",
                  transform: {
                    xs: "none",
                    md: "translateY(-5px)",
                  },
                  boxShadow: "0 18px 35px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box className="flex items-start justify-between gap-4">
                <Box className="w-12 h-12 rounded-2xl bg-[#28DF99] text-white flex items-center justify-center">
                  {card.icon}
                </Box>

                <ArrowForwardIcon sx={{ color: "primary.main" }} />
              </Box>

              <Typography fontWeight={900} fontSize={22} className="mt-5">
                {card.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {card.text}
              </Typography>

              <Button
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 2,
                  p: 0,
                  textTransform: "none",
                  fontWeight: 900,
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Open {card.title}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

export default Dashboard;