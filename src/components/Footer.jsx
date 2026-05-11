// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Box, Container, Typography, Chip } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        background: "linear-gradient(135deg, #28DF99 0%, #BFF8D4 100%)",
      }}
    >
      <Container maxWidth="lg" className="py-4 px-4">
        <Box className="bg-white/85 backdrop-blur-md rounded-[22px] shadow-md border border-white/70 px-4 sm:px-5 py-4">
          {/* Main footer content - flex responsive */}
          <Box className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-center lg:items-start">
            {/* Brand */}
            <Box className="w-full lg:w-1/3 text-center lg:text-left">
              <Box className="flex justify-center lg:justify-start items-center gap-3">
                <Box className="w-10 h-10 rounded-xl bg-[#28DF99] flex items-center justify-center shadow-sm">
                  <ShoppingCartIcon sx={{ color: "white", fontSize: 24 }} />
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={900} lineHeight={1}>
                    Shopping Cart
                  </Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Simple. Fast. Fresh.
                  </Typography>
                </Box>
              </Box>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: 12.5,
                    sm: 13,
                  },
                  lineHeight: 1.6,
                  mt: 1.2,
                  maxWidth: {
                    xs: "260px",
                    sm: "320px",
                  },
                  mx: {
                    xs: "auto",
                    lg: 0,
                  },
                  textAlign: {
                    xs: "center",
                    lg: "left",
                  },
                }}
              >
                Easy shopping with cart and order tracking.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box className="w-full lg:w-1/3 text-center">
              <Typography fontWeight={900} fontSize={15} className="mb-2">
                Quick Links
              </Typography>

              <Box className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-3">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-[#28DF99] text-sm"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="text-gray-600 hover:text-[#28DF99] text-sm"
                >
                  About
                </Link>

                <Link
                  to="/shop"
                  className="text-gray-600 hover:text-[#28DF99] text-sm"
                >
                  Shop
                </Link>

                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-[#28DF99] text-sm"
                >
                  Contact
                </Link>
              </Box>

              <Box className="flex flex-wrap justify-center gap-1.5">
                <Chip
                  icon={<SecurityIcon />}
                  label="Secure"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    backgroundColor: "#e8fff5",
                    color: "#168a61",
                    fontWeight: 700,
                  }}
                />

                <Chip
                  icon={<LocalShippingIcon />}
                  label="Fast"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    backgroundColor: "#e8fff5",
                    color: "#168a61",
                    fontWeight: 700,
                  }}
                />

                <Chip
                  icon={<SupportAgentIcon />}
                  label="Support"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    backgroundColor: "#e8fff5",
                    color: "#168a61",
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>

            {/* Contact */}
            <Box className="w-full lg:w-1/3 text-center lg:text-left">
              <Typography fontWeight={900} fontSize={15} className="mb-2">
                Contact
              </Typography>

              <Box className="space-y-1.5">
                <Box className="flex justify-center lg:justify-start items-center gap-2 text-gray-600">
                  <EmailIcon color="primary" sx={{ fontSize: 18 }} />
                  <Typography fontSize={13} className="break-all">
                    support@shoppingcart.com
                  </Typography>
                </Box>

                <Box className="flex justify-center lg:justify-start items-center gap-2 text-gray-600">
                  <PhoneIcon color="primary" sx={{ fontSize: 18 }} />
                  <Typography fontSize={13}>+94 77 123 4567</Typography>
                </Box>

                <Box className="flex justify-center lg:justify-start items-center gap-2 text-gray-600">
                  <LocationOnIcon color="primary" sx={{ fontSize: 18 }} />
                  <Typography fontSize={13}>Colombo, Sri Lanka</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Bottom */}
          <Box className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 text-center">
            <Typography fontSize={12.5} color="text.secondary">
              © {new Date().getFullYear()} Shopping Cart Application.
            </Typography>

            <Typography fontSize={12.5} color="text.secondary">
              Built for easy online shopping 💚
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;