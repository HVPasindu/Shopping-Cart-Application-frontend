// src/pages/public/Contact.jsx
import { Box, Container, Typography, Paper, Button } from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

function Contact() {
  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email Us",
      text: "support@shoppingcart.com",
      subText: "We usually reply within 24 hours.",
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      text: "+94 77 123 4567",
      subText: "Available during working hours.",
    },
    {
      icon: <LocationOnIcon />,
      title: "Visit Us",
      text: "Colombo, Sri Lanka",
      subText: "Our support team is based locally.",
    },
    {
      icon: <AccessTimeIcon />,
      title: "Working Hours",
      text: "Mon - Sat",
      subText: "9.00 AM - 6.00 PM",
    },
  ];

  const supportItems = [
    {
      icon: <ShoppingCartIcon />,
      title: "Order Support",
      text: "Need help with your cart, order summary, or order status?",
    },
    {
      icon: <NotificationsActiveIcon />,
      title: "Product Updates",
      text: "Get support about product availability and cart notifications.",
    },
    {
      icon: <SupportAgentIcon />,
      title: "Customer Help",
      text: "Our team is ready to help you with shopping issues.",
    },
  ];

  const faqs = [
    {
      question: "How can I contact support?",
      answer: "You can contact us using email, phone, or by visiting our location.",
    },
    {
      question: "Can I ask about my order?",
      answer: "Yes, you can contact support with your order details.",
    },
    {
      question: "Do you provide product availability updates?",
      answer: "Yes, customers can receive updates about product stock changes.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f7fbff, #ecfdf5)",
        py: {
          xs: 4,
          sm: 6,
          md: 9,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
              md: 7,
            },
            borderRadius: {
              xs: "24px",
              md: "34px",
            },
            background:
              "linear-gradient(135deg, #28DF99 0%, #99F3BD 55%, #F6F7D4 100%)",
            mb: {
              xs: 4,
              md: 6,
            },
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.35)",
              right: -50,
              top: -60,
            }}
          />

          <Box
            sx={{
              position: "relative",
              maxWidth: "700px",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "34px",
                  sm: "44px",
                  md: "58px",
                },
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#102033",
                mb: 2,
              }}
            >
              We Are Here To Help
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "17px",
                },
                lineHeight: 1.8,
                color: "#334155",
                maxWidth: "560px",
              }}
            >
              Contact our support team for order help, product availability,
              cart issues, or general shopping support.
            </Typography>

           
          </Box>
        </Paper>

        {/* Contact Info Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: {
              xs: 2,
              md: 3,
            },
            justifyContent: "center",
            mb: {
              xs: 4,
              md: 6,
            },
          }}
        >
          {contactInfo.map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  lg: "calc(25% - 18px)",
                },
                p: 3,
                borderRadius: "26px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                textAlign: "center",
                transition: "0.3s",
                "&:hover": {
                  transform: {
                    xs: "none",
                    md: "translateY(-6px)",
                  },
                  boxShadow: {
                    xs: "none",
                    md: "0 16px 35px rgba(0,0,0,0.08)",
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "18px",
                  mx: "auto",
                  mb: 2,
                  backgroundColor: "#dcfce7",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": {
                    fontSize: 30,
                  },
                }}
              >
                {item.icon}
              </Box>

              <Typography fontWeight={900} fontSize={18}>
                {item.title}
              </Typography>

              <Typography fontWeight={700} color="primary" className="mt-1">
                {item.text}
              </Typography>

              <Typography fontSize={14} color="text.secondary" className="mt-1">
                {item.subText}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Support Area */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
            borderRadius: "30px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            mb: {
              xs: 4,
              md: 6,
            },
          }}
        >
          <Box className="text-center mb-8">
            <Typography
              sx={{
                fontSize: {
                  xs: "28px",
                  md: "40px",
                },
                fontWeight: 900,
                mb: 1,
              }}
            >
              What Can We Help With?
            </Typography>

            <Typography color="text.secondary">
              Choose the support area that matches your issue.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: {
                xs: 2,
                md: 3,
              },
              justifyContent: "center",
            }}
          >
            {supportItems.map((item) => (
              <Box
                key={item.title}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(33.333% - 16px)",
                  },
                  p: 3,
                  borderRadius: "24px",
                  backgroundColor: "#f7fbff",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "18px",
                    mx: "auto",
                    mb: 2,
                    backgroundColor: "#28DF99",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: 30,
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <Typography fontWeight={900} fontSize={18}>
                  {item.title}
                </Typography>

                <Typography fontSize={14} color="text.secondary" className="mt-2">
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* FAQ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: {
              xs: 3,
              md: 4,
            },
            alignItems: "stretch",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                md: "38%",
              },
              p: {
                xs: 3,
                md: 4,
              },
              borderRadius: "28px",
              background:
                "linear-gradient(135deg, #28DF99 0%, #99F3BD 100%)",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "28px",
                  md: "36px",
                },
                fontWeight: 900,
                color: "#102033",
                mb: 2,
              }}
            >
              Quick Answers
            </Typography>

            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Here are some common questions customers ask before contacting
              support.
            </Typography>
          </Paper>

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "62%",
              },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {faqs.map((faq) => (
              <Paper
                key={faq.question}
                elevation={0}
                sx={{
                  p: {
                    xs: 2.5,
                    md: 3,
                  },
                  borderRadius: "22px",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Typography fontWeight={900}>{faq.question}</Typography>

                <Typography color="text.secondary" fontSize={14} className="mt-1">
                  {faq.answer}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Contact;