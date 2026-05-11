// src/pages/auth/Register.jsx
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
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Swal from "sweetalert2";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

import API from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) {
      return "Name is required";
    }

    return "";
  };

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

  const validatePhone = (value) => {
    if (!value.trim()) {
      return "";
    }

    if (value.length < 10) {
      return "Phone number must be at least 10 digits";
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

  const handleRegister = async () => {
    const nameValidationMessage = validateName(name);
    const emailValidationMessage = validateEmail(email);
    const phoneValidationMessage = validatePhone(phone);
    const passwordValidationMessage = validatePassword(password);

    setNameError(nameValidationMessage);
    setEmailError(emailValidationMessage);
    setPhoneError(phoneValidationMessage);
    setPasswordError(passwordValidationMessage);

    if (
      nameValidationMessage ||
      emailValidationMessage ||
      phoneValidationMessage ||
      passwordValidationMessage
    ) {
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      const registeredEmail = res.data.data.email;

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "OTP has been sent to your email.",
        confirmButtonText: "Verify OTP",
        confirmButtonColor: "#28DF99",
      }).then(() => {
        navigate("/verify-otp", {
          state: {
            email: registeredEmail,
          },
        });
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.35)",
    },
    "& .MuiFormHelperText-root": {
      color: "#dc2626",
      fontWeight: 600,
      ml: 1,
    },
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
              Register
            </Typography>

            <Typography color="text.secondary" className="mt-3">
              Create your customer account
            </Typography>
          </Box>

          {/* No form here */}
          <Box>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                if (nameError) {
                  setNameError("");
                }
              }}
              error={!!nameError}
              helperText={nameError}
              sx={{
                mb: 3,
                ...inputStyle,
              }}
            />

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
                ...inputStyle,
              }}
            />

            <TextField
              fullWidth
              label="Phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);

                if (phoneError) {
                  setPhoneError("");
                }
              }}
              error={!!phoneError}
              helperText={phoneError}
              sx={{
                mb: 3,
                ...inputStyle,
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
                  handleRegister();
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
                ...inputStyle,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleRegister}
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
                "Register"
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