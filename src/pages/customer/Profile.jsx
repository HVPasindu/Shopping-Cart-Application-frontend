// src/pages/customer/Profile.jsx
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import Swal from "sweetalert2";
import API from "../../services/api";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    status: "",
  });

  const getProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/profile");
      const data = res.data.data.profile;

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        postal_code: data.postal_code || "",
        status: data.status || "",
      });

      setImagePreview(data.profile_image_url || "");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Profile Load Failed",
        text:
          error.response?.data?.message ||
          "Could not load your profile details.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    if (!profile.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter your name.",
        confirmButtonColor: "#28DF99",
      });
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("phone", profile.phone);
      formData.append("address", profile.address);
      formData.append("city", profile.city);
      formData.append("postal_code", profile.postal_code);

      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const res = await API.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedProfile = res.data.data.profile;

      setProfile({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
        city: updatedProfile.city || "",
        postal_code: updatedProfile.postal_code || "",
        status: updatedProfile.status || "",
      });

      setImagePreview(updatedProfile.profile_image_url || "");
      setImageFile(null);

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsedUser,
            name: updatedProfile.name,
            phone: updatedProfile.phone,
          })
        );
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#28DF99",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Could not update your profile. Please try again.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.8)",
    },
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          minHeight: "420px",
          borderRadius: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

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
      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Box>
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-3">
            <PersonIcon fontSize="small" />
            My Profile
          </Box>

          <Typography
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "28px",
                sm: "36px",
              },
              lineHeight: 1.1,
            }}
          >
            Profile Details
          </Typography>

          <Typography color="text.secondary" className="mt-2">
            View and update your personal information.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleUpdateProfile}
          disabled={saving}
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: "16px",
            px: 3,
            py: 1.2,
            boxShadow: "none",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      {/* Profile Image */}
      <Box className="flex flex-col sm:flex-row items-center gap-5 mb-8 p-4 rounded-[24px] bg-[#f7fbff] border border-gray-100">
        <Avatar
          src={imagePreview}
          sx={{
            width: 110,
            height: 110,
            border: "4px solid white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <PersonIcon sx={{ fontSize: 55 }} />
        </Avatar>

        <Box className="text-center sm:text-left">
          <Typography fontWeight={900} fontSize={20}>
            {profile.name || "Customer"}
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            {profile.email}
          </Typography>

          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: 800,
              borderRadius: "14px",
              borderColor: "primary.main",
              color: "primary.main",
            }}
          >
            Change Photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
      </Box>

      {/* Inputs */}
      <Box className="flex flex-wrap gap-4">
        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="Name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="Email"
            value={profile.email}
            disabled
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="Phone"
            value={profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="City"
            value={profile.city}
            onChange={(e) => handleChange("city", e.target.value)}
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="Postal Code"
            value={profile.postal_code}
            onChange={(e) => handleChange("postal_code", e.target.value)}
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full sm:w-[calc(50%-8px)]">
          <TextField
            fullWidth
            label="Account Status"
            value={profile.status}
            disabled
            sx={inputStyle}
          />
        </Box>

        <Box className="w-full">
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Address"
            value={profile.address}
            onChange={(e) => handleChange("address", e.target.value)}
            sx={inputStyle}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default Profile;