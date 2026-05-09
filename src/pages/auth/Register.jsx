// src/pages/auth/Register.jsx
import { Link } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

function Register() {
  return (
    <Box
      className="min-h-screen flex items-center justify-center px-4 py-8"
      sx={{
        backgroundImage: {
          xs: `url(${mobileBg})`,
          md: `url(${desktopBg})`,
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className="w-full max-w-lg">
        {/* Logo */}
        <Box className="flex justify-center items-center gap-3 mb-8">
          <ShoppingCartIcon color="primary" sx={{ fontSize: 38 }} />

          <Typography variant="h5" fontWeight={900}>
            Shopping Cart
          </Typography>
        </Box>

        <Paper
          elevation={0}
          className="rounded-[30px]"
          sx={{
            p: {
              xs: 4,
              sm: 5,
            },
            backgroundColor: "rgba(246, 247, 212, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          }}
        >
          <Box className="text-center mb-8">
            <Typography variant="h4" fontWeight={900}>
              Register
            </Typography>

            <Typography color="text.secondary" className="mt-3">
              Create your customer account
            </Typography>
          </Box>

          <Box component="form">
            <TextField
              fullWidth
              label="Name"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Phone"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{
                mb: 3.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                py: 1.5,
                boxShadow: "none",
              }}
            >
              Register
            </Button>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              component={Link}
              to="/"
              fullWidth
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: "16px",
                py: 1.2,
                borderColor: "#d1d5db",
                color: "text.primary",
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            >
              Home
            </Button>

            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: "16px",
                py: 1.2,
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;