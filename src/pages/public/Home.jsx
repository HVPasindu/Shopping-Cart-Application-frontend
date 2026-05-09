// src/pages/public/Home.jsx
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import homeProductsImage from "../../assets/home-products.png";

const features = [
  {
    icon: <Inventory2Icon />,
    title: "Fresh Categories",
    text: "Browse products by category and find what you need quickly.",
  },
  {
    icon: <ShoppingCartIcon />,
    title: "Easy Cart",
    text: "Add products, update quantities, and manage your cart easily.",
  },
  {
    icon: <NotificationsActiveIcon />,
    title: "Smart Alerts",
    text: "Get notified when products become unavailable or available again.",
  },
];

function Home() {
  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" className="py-10 md:py-16">
        <Box className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left */}
          <Box
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
            }}
            className="text-center lg:text-left"
          >
            <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-5">
              <LocalShippingIcon fontSize="small" />
              Fresh products for your daily needs
            </Box>

            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                fontSize: {
                  xs: "34px",
                  sm: "44px",
                  md: "56px",
                },
                lineHeight: 1.1,
              }}
            >
              Shop Smart,
              <br />
              Live{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Fresh
              </Box>
              <br />
              Every Day
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2.5,
                mx: {
                  xs: "auto",
                  lg: 0,
                },
                maxWidth: {
                  xs: "320px",
                  sm: "450px",
                },
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                },
                lineHeight: 1.7,
                px: {
                  xs: 1,
                  sm: 0,
                },
              }}
            >
              Browse categories, add items to your cart, place orders, and get
              product availability updates easily.
            </Typography>

            <Box className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-7">
              <Button
                component={Link}
                to="/shop"
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: "999px",
                  px: 4,
                  py: 1.3,
                  boxShadow: "none",
                }}
              >
                Start Shopping
              </Button>

              <Button
                component={Link}
                to="/about"
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: "999px",
                  px: 4,
                  py: 1.3,
                  borderColor: "#d1d5db",
                  color: "text.primary",
                }}
              >
                Learn More
              </Button>
            </Box>

            <Box className="flex flex-wrap justify-center lg:justify-start gap-4 mt-7 text-gray-500 text-sm">
              <Box className="flex items-center gap-2">
                <CheckCircleIcon color="primary" fontSize="small" />
                Easy Shopping
              </Box>

              <Box className="flex items-center gap-2">
                <CheckCircleIcon color="primary" fontSize="small" />
                Fast Ordering
              </Box>

              <Box className="flex items-center gap-2">
                <CheckCircleIcon color="primary" fontSize="small" />
                Smart Notifications
              </Box>
            </Box>
          </Box>

          {/* Right - Image */}
          <Box
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
            }}
            className="relative"
          >
            <Box className="absolute -top-6 -right-6 w-32 h-32 bg-[#28DF99]/30 rounded-full blur-3xl" />
            <Box className="absolute -bottom-6 -left-6 w-36 h-36 bg-[#99F3BD]/40 rounded-full blur-3xl" />

            <Box className="relative bg-white rounded-[32px] p-3 sm:p-4 shadow-xl border border-gray-100">
              <Box
                component="img"
                src={homeProductsImage}
                alt="Shopping products"
                sx={{
                  width: "100%",
                  height: {
                    xs: "260px",
                    sm: "340px",
                    md: "430px",
                  },
                  objectFit: "cover",
                  borderRadius: {
                    xs: "24px",
                    sm: "28px",
                  },
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Feature Section */}
      <Container maxWidth="lg" className="pb-12 md:pb-16">
        <Box className="text-center mb-8">
          <Typography variant="h4" fontWeight={900}>
            Why Customers Love It
          </Typography>

          <Typography color="text.secondary" className="mt-2">
            A simple shopping experience with useful features.
          </Typography>
        </Box>

        <Box className="flex flex-wrap justify-center gap-5">
          {features.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                width: {
                  xs: "100%",
                  md: "calc(33.333% - 14px)",
                },
              }}
              className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-all duration-300"
            >
              <Box className="w-14 h-14 mx-auto rounded-2xl bg-[#28DF99] text-white flex items-center justify-center mb-4">
                {feature.icon}
              </Box>

              <Typography fontWeight={900} fontSize={18}>
                {feature.title}
              </Typography>

              <Typography color="text.secondary" fontSize={14} className="mt-2">
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Call To Action */}
      <Container maxWidth="lg" className="pb-14">
        <Box className="rounded-[32px] bg-gradient-to-r from-[#28DF99] to-[#99F3BD] p-7 md:p-10 text-center">
          <Typography variant="h4" fontWeight={900}>
            Ready to start shopping?
          </Typography>

          <Typography className="mt-2 mb-5" color="text.secondary">
            Explore categories and add your favorite products to cart.
          </Typography>

          <Button
            component={Link}
            to="/shop"
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            sx={{
              backgroundColor: "white",
              color: "text.primary",
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "999px",
              px: 4,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#f7fbff",
                boxShadow: "none",
              },
            }}
          >
            Go to Shop
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;