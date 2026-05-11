// src/pages/auth/VerifyOtp.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import ReplayIcon from "@mui/icons-material/Replay";
import VerifiedIcon from "@mui/icons-material/Verified";

import Swal from "sweetalert2";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

import API from "../../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromRegister = location.state?.email || "";

  const [email, setEmail] = useState(emailFromRegister);
  const [otp, setOtp] = useState("");

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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

  const validateOtp = (value) => {
    if (!value.trim()) {
      return "OTP is required";
    }

    if (value.length !== 6) {
      return "OTP must be 6 digits";
    }

    return "";
  };

  const handleVerifyOtp = async () => {
    const emailValidationMessage = validateEmail(email);
    const otpValidationMessage = validateOtp(otp);

    setEmailError(emailValidationMessage);
    setOtpError(otpValidationMessage);

    if (emailValidationMessage || otpValidationMessage) {
      return;
    }

    try {
      setVerifyLoading(true);

      await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      Swal.fire({
        icon: "success",
        title: "Email Verified",
        text: "Your email has been verified successfully. You can login now.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#28DF99",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          error.response?.data?.message ||
          "Invalid OTP or OTP expired. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const emailValidationMessage = validateEmail(email);

    setEmailError(emailValidationMessage);

    if (emailValidationMessage) {
      return;
    }

    try {
      setResendLoading(true);

      await API.post("/auth/resend-otp", {
        email,
      });

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "A new OTP has been sent to your email.",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text:
          error.response?.data?.message ||
          "Could not resend OTP. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setResendLoading(false);
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
              Verify OTP
            </Typography>

            <Typography color="text.secondary" className="mt-3">
              Enter the OTP sent to your email
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
                ...inputStyle,
              }}
            />

            <TextField
              fullWidth
              label="OTP Code"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);

                if (otpError) {
                  setOtpError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleVerifyOtp();
                }
              }}
              error={!!otpError}
              helperText={otpError}
              inputProps={{
                maxLength: 6,
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
              disabled={verifyLoading}
              onClick={handleVerifyOtp}
              startIcon={!verifyLoading && <VerifiedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                py: 1.5,
                boxShadow: "none",
              }}
            >
              {verifyLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={resendLoading}
              onClick={handleResendOtp}
              startIcon={!resendLoading && <ReplayIcon />}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                py: 1.3,
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            >
              {resendLoading ? (
                <CircularProgress size={22} color="primary" />
              ) : (
                "Resend OTP"
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

export default VerifyOtp;