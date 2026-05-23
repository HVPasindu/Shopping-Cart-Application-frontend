// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Swal from "sweetalert2";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Enter a valid email address";
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleLogin = async () => {
    const emailValidationMessage = validateEmail(email);
    const passwordValidationMessage = validatePassword(password);

    setEmailError(emailValidationMessage);
    setPasswordError(passwordValidationMessage);

    if (emailValidationMessage || passwordValidationMessage) {
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      }).then(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/profile");
        }
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid email or password",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      });
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

          {/* No form here */}
          <Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (emailError) {
                  setEmailError("");
                }
              }}
              error={!!emailError}
              helperText={emailError}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
                "& .MuiFormHelperText-root": {
                  color: "#dc2626",
                  fontWeight: 600,
                  ml: 1,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (passwordError) {
                  setPasswordError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              error={!!passwordError}
              helperText={passwordError}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                mb: 3.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.35)",
                },
                "& .MuiFormHelperText-root": {
                  color: "#dc2626",
                  fontWeight: 600,
                  ml: 1,
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleLogin}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                py: 1.5,
                boxShadow: "none",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Login"
              )}
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