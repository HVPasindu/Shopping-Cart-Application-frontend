// src/pages/admin/ManageAdmins.jsx
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Swal from "sweetalert2";
import API from "../../services/api";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const getAdmins = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/admins");
      setAdmins(res.data.data.admins || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Admin Load Failed",
        text:
          error.response?.data?.message || "Could not load admin accounts.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAdmins();
  }, [getAdmins]);

  const validateAddAdmin = () => {
    const nextErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!newAdmin.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!newAdmin.email.trim()) {
      nextErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(newAdmin.email)) {
        nextErrors.email = "Enter a valid email address";
      }
    }

    if (!newAdmin.password.trim()) {
      nextErrors.password = "Password is required";
    } else if (newAdmin.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);

    return !nextErrors.name && !nextErrors.email && !nextErrors.password;
  };

  const handleInputChange = (field, value) => {
    setNewAdmin((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const closeAddDialog = () => {
    if (creating) {
      return;
    }

    setOpenAddDialog(false);
    setShowPassword(false);

    setNewAdmin({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setErrors({
      name: "",
      email: "",
      password: "",
    });
  };

  const createAdmin = async () => {
    const isValid = validateAddAdmin();

    if (!isValid) {
      return;
    }

    try {
      setCreating(true);

      await API.post("/admin/admins", {
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        password: newAdmin.password,
      });

      Swal.fire({
        icon: "success",
        title: "Admin Created",
        text: "New admin account created successfully.",
        confirmButtonColor: "#28DF99",
      });

      closeAddDialog();
      await getAdmins();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Create Admin Failed",
        text: error.response?.data?.message || "Could not create admin.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setCreating(false);
    }
  };

  const updateAdminStatus = async (adminId, status) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Change Admin Status?",
      text: `Are you sure you want to change this admin status to ${status}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingId(adminId);

      await API.put(`/admin/admins/${adminId}/status`, {
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Admin status updated successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getAdmins();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text:
          error.response?.data?.message ||
          "Only Main Admin can update admin status.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getCurrentAdminName = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return "";
    }

    try {
      return JSON.parse(user).name || "";
    } catch (error) {
      return "";
    }
  };

  const currentAdminName = getCurrentAdminName();

  const getStatusStyle = (status) => {
    if (status === "active") {
      return {
        bg: "#dcfce7",
        color: "#168a61",
      };
    }

    if (status === "blocked") {
      return {
        bg: "#fee2e2",
        color: "#dc2626",
      };
    }

    return {
      bg: "#fef3c7",
      color: "#b45309",
    };
  };

  const inputStyle = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.65)",
    },
    "& .MuiFormHelperText-root": {
      color: "#dc2626",
      fontWeight: 600,
      ml: 1,
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
    <>
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
        <Box
          className="rounded-[26px] p-6 mb-8"
          sx={{
            background:
              "linear-gradient(135deg, #28DF99 0%, #a7f3d0 55%, #f6f7d4 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.28)",
              top: -45,
              right: -35,
            }}
          />

          <Box className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <Box>
              <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-[#16a66d] font-bold text-sm mb-4">
                <ManageAccountsIcon fontSize="small" />
                Admin Management
              </Box>

              <Typography
                fontWeight={900}
                sx={{
                  fontSize: {
                    xs: "30px",
                    sm: "42px",
                  },
                  lineHeight: 1.1,
                  color: "#0f172a",
                }}
              >
                Manage Admin Accounts
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: "650px",
                  color: "#334155",
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                  },
                  lineHeight: 1.7,
                }}
              >
                View all admin accounts, create new admins, and update admin
                status. Admin status changes are allowed only for Main Admin.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                px: 3,
                py: 1.3,
                boxShadow: "none",
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "#f7fbff",
                },
              }}
            >
              Add Admin
            </Button>
          </Box>
        </Box>

        {/* Info box */}
        <Box
          className="p-4 rounded-[22px] mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900}>Logged Admin</Typography>

            <Typography
              color="text.secondary"
              fontSize={14}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "normal",
              }}
            >
              {currentAdminName || "Admin"}
            </Typography>
          </Box>

          <Chip
            label={`${admins.length} Admins`}
            sx={{
              fontWeight: 900,
              backgroundColor: "#e6fdf4",
              color: "#168a61",
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          />
        </Box>

        {/* Admin cards */}
        {admins.length === 0 ? (
          <Box
            sx={{
              minHeight: "260px",
              borderRadius: "24px",
              backgroundColor: "#f7fbff",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: 4,
            }}
          >
            <Box>
              <AdminPanelSettingsIcon
                sx={{ fontSize: 64, color: "primary.main" }}
              />

              <Typography fontWeight={900} fontSize={24} className="mt-3">
                No admins found
              </Typography>

              <Typography color="text.secondary" className="mt-2">
                Admin accounts will appear here.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
              width: "100%",
              alignItems: "stretch",
            }}
          >
            {admins.map((admin) => {
              const statusStyle = getStatusStyle(admin.status);

              return (
                <Box
                  key={admin.id}
                  sx={{
                    width: {
                      xs: "100%",
                      lg: "calc(50% - 10px)",
                    },
                    p: {
                      xs: 2,
                      sm: 3,
                    },
                    borderRadius: "26px",
                    backgroundColor: "#f7fbff",
                    border: "1px solid #e5e7eb",
                    transition: "0.25s",
                    overflow: "hidden",
                    minWidth: 0,
                    boxSizing: "border-box",
                    "&:hover": {
                      backgroundColor: "#ecfdf5",
                      transform: {
                        xs: "none",
                        md: "translateY(-4px)",
                      },
                      boxShadow: "0 18px 35px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    {/* Admin top */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Chip
                        label={admin.status}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 900,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          alignSelf: "flex-start",
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          width: "100%",
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 58,
                            height: 58,
                            backgroundColor: "#28DF99",
                            color: "white",
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          {admin.name
                            ? admin.name.charAt(0).toUpperCase()
                            : "A"}
                        </Avatar>

                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 1,
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              fontWeight={900}
                              fontSize={21}
                              sx={{
                                overflowWrap: "anywhere",
                                wordBreak: "normal",
                                lineHeight: 1.35,
                              }}
                            >
                              {admin.name}
                            </Typography>

                            {admin.name === "Main Admin" && (
                              <Chip
                                label="Main Admin"
                                size="small"
                                sx={{
                                  fontWeight: 900,
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              mt: 1.5,
                              minWidth: 0,
                            }}
                          >
                            <EmailIcon
                              sx={{
                                fontSize: 18,
                                color: "#64748b",
                                mt: "2px",
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              color="text.secondary"
                              fontSize={14}
                              sx={{
                                overflowWrap: "anywhere",
                                wordBreak: "normal",
                                lineHeight: 1.5,
                                minWidth: 0,
                              }}
                            >
                              {admin.email}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 1,
                              minWidth: 0,
                            }}
                          >
                            <PhoneIcon
                              sx={{
                                fontSize: 18,
                                color: "#64748b",
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              color="text.secondary"
                              fontSize={14}
                              sx={{
                                overflowWrap: "anywhere",
                                wordBreak: "normal",
                                minWidth: 0,
                              }}
                            >
                              {admin.phone || "No phone number"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 1,
                              minWidth: 0,
                            }}
                          >
                            <BadgeIcon
                              sx={{
                                fontSize: 18,
                                color: "#64748b",
                                flexShrink: 0,
                              }}
                            />

                            <Typography color="text.secondary" fontSize={14}>
                              Role: {admin.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Status change section */}
                    <Box
                      sx={{
                        p: {
                          xs: 2,
                          sm: 2.5,
                        },
                        borderRadius: "20px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        boxSizing: "border-box",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          gap: 2,
                          width: "100%",
                          maxWidth: "100%",
                          minWidth: 0,
                        }}
                      >
                        <Box sx={{ minWidth: 0, width: "100%" }}>
                          <Typography fontWeight={900} fontSize={14}>
                            Change Status
                          </Typography>

                          <Typography
                            color="text.secondary"
                            fontSize={13}
                            sx={{
                              lineHeight: 1.6,
                              overflowWrap: "anywhere",
                              wordBreak: "normal",
                            }}
                          >
                            Only Main Admin can update this.
                          </Typography>
                        </Box>

                        <FormControl
                          size="small"
                          fullWidth
                          sx={{
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              fontWeight: 800,
                              backgroundColor: "#f7fbff",
                              width: "100%",
                            },
                            "& .MuiSelect-select": {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        >
                          <Select
                            value={admin.status}
                            disabled={updatingId === admin.id}
                            onChange={(e) =>
                              updateAdminStatus(admin.id, e.target.value)
                            }
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                            <MenuItem value="blocked">Blocked</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Add Admin Popup */}
      <Dialog
        open={openAddDialog}
        onClose={closeAddDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "28px",
            backgroundColor: "rgba(246, 247, 212, 0.96)",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          Add New Admin

          <IconButton onClick={closeAddDialog} disabled={creating}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create a new admin account. The new admin will be active and email
            verified automatically.
          </Typography>

          <TextField
            fullWidth
            label="Name"
            value={newAdmin.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newAdmin.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Phone"
            value={newAdmin.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={newAdmin.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              ...inputStyle,
              mb: 0,
            }}
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
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={closeAddDialog}
            disabled={creating}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "14px",
              px: 3,
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={createAdmin}
            disabled={creating}
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "14px",
              px: 3,
              boxShadow: "none",
            }}
          >
            {creating ? "Creating..." : "Create Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManageAdmins;