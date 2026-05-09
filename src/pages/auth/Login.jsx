// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      navigate("/shop");
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
              Login
            </Typography>

            <Typography color="text.secondary" className="mt-3">
              Login to your account
            </Typography>
          </Box>

          {errorMessage && (
            <Typography
              textAlign="center"
              sx={{
                mb: 2.5,
                color: "#dc2626",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {errorMessage}
            </Typography>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                py: 1.5,
                boxShadow: "none",
              }}
            >
              {loading ? "Logging in..." : "Login"}
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
              to="/register"
              fullWidth
              variant="outlined"
              startIcon={<PersonAddIcon />}
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
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;