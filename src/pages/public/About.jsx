// src/pages/public/About.jsx

import { Container, Typography, Paper, Box } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function About() {
  const features = [
    {
      icon: <ShoppingCartIcon color="primary" />,
      title: "Easy Shopping",
      description:
        "Browse products and add your favorite items to the cart easily.",
    },
    {
      icon: <LocalShippingIcon color="primary" />,
      title: "Fast Delivery",
      description:
        "Place orders quickly and receive updates about your products.",
    },
    {
      icon: <NotificationsActiveIcon color="primary" />,
      title: "Smart Notifications",
      description:
        "Get notified instantly when product availability changes.",
    },
    {
      icon: <SupportAgentIcon color="primary" />,
      title: "24/7 Support",
      description:
        "Friendly customer support available anytime you need help.",
    },
    {
      icon: <ShoppingCartIcon color="primary" />,
      title: "Quality Products",
      description:
        "We provide trusted and high-quality products every day.",
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #f0fdf4, #ffffff)",
        minHeight: "100vh",
        py: {
          xs: 4,
          sm: 6,
          md: 10,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
              md: 8,
            },
            borderRadius: {
              xs: "22px",
              sm: "26px",
              md: "30px",
            },
            textAlign: "center",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            mb: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "30px",
                sm: "42px",
                md: "58px",
              },
              fontWeight: 800,
              lineHeight: {
                xs: 1.15,
                md: 1.2,
              },
              mb: {
                xs: 2,
                md: 3,
              },
            }}
          >
            About Our Shopping Cart
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: "750px",
              mx: "auto",
              lineHeight: {
                xs: 1.7,
                sm: 1.8,
                md: 2,
              },
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "17px",
              },
            }}
          >
            Shopping Cart Application is a modern shopping platform where
            customers can browse products, manage their cart, place orders, and
            receive instant product updates with a smooth and simple experience.
          </Typography>
        </Paper>

        {/* Features - Flex Wrap */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 10px)",
                  lg: "calc(33.333% - 16px)",
                },
                minHeight: {
                  xs: "210px",
                  sm: "240px",
                  md: "290px",
                },
                p: {
                  xs: 3,
                  sm: 3.5,
                  md: 4,
                },
                borderRadius: {
                  xs: "22px",
                  sm: "25px",
                  md: "28px",
                },
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "0.3s",
                "&:hover": {
                  transform: {
                    xs: "none",
                    md: "translateY(-6px)",
                  },
                  boxShadow: {
                    xs: "none",
                    md: "0 12px 30px rgba(0,0,0,0.08)",
                  },
                },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: {
                    xs: 62,
                    sm: 72,
                    md: 86,
                  },
                  height: {
                    xs: 62,
                    sm: 72,
                    md: 86,
                  },
                  borderRadius: "50%",
                  backgroundColor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: {
                    xs: 2,
                    md: 3,
                  },
                  "& svg": {
                    fontSize: {
                      xs: 30,
                      sm: 34,
                      md: 40,
                    },
                  },
                }}
              >
                {feature.icon}
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: {
                    xs: "22px",
                    sm: "24px",
                    md: "28px",
                  },
                  fontWeight: 800,
                  mb: {
                    xs: 1,
                    md: 2,
                  },
                  lineHeight: 1.2,
                }}
              >
                {feature.title}
              </Typography>

              {/* Description */}
              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: {
                    xs: 1.6,
                    md: 1.8,
                  },
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                    md: "16px",
                  },
                  maxWidth: {
                    xs: "260px",
                    md: "280px",
                  },
                }}
              >
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Bottom Info */}
        <Paper
          elevation={0}
          sx={{
            mt: {
              xs: 4,
              md: 6,
            },
            p: {
              xs: 3,
              sm: 4,
              md: 6,
            },
            borderRadius: {
              xs: "22px",
              sm: "26px",
              md: "30px",
            },
            textAlign: "center",
            background: "linear-gradient(to right, #34d399, #10b981)",
            color: "white",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "28px",
                sm: "38px",
                md: "48px",
              },
              fontWeight: 800,
              mb: {
                xs: 2,
                md: 3,
              },
              lineHeight: 1.15,
            }}
          >
            Smart Shopping Experience
          </Typography>

          <Typography
            sx={{
              maxWidth: "700px",
              mx: "auto",
              lineHeight: {
                xs: 1.7,
                md: 2,
              },
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "17px",
              },
              opacity: 0.95,
            }}
          >
            Enjoy a clean, modern, and responsive shopping experience with fast
            browsing, secure ordering, and real-time product notifications.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default About;