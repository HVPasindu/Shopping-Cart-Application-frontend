// src/pages/admin/ManageUsers.jsx
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
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import VerifiedIcon from "@mui/icons-material/Verified";
import BlockIcon from "@mui/icons-material/Block";

import Swal from "sweetalert2";
import API from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/users");
      setUsers(res.data.data.users || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Users Load Failed",
        text: error.response?.data?.message || "Could not load users.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const updateUserStatus = async (userId, status) => {
    const result = await Swal.fire({
      icon: status === "blocked" ? "warning" : "question",
      title: "Change User Status?",
      text: `Are you sure you want to change this customer status to ${status}?`,
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
      setUpdatingId(userId);

      await API.put(`/admin/users/${userId}/status`, {
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Customer status updated successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getUsers();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text:
          error.response?.data?.message ||
          "Could not update customer status.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdatingId(null);
    }
  };

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

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

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

        <Box className="relative">
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-[#16a66d] font-bold text-sm mb-4">
            <PeopleIcon fontSize="small" />
            Manage Users
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
            Customer Management
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
            View registered customers and change customer account status.
          </Typography>
        </Box>
      </Box>

      {/* Filter */}
      <Box
        className="p-4 rounded-[22px] mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        sx={{
          backgroundColor: "#f7fbff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box>
          <Typography fontWeight={900}>Customer List</Typography>

          <Typography color="text.secondary" fontSize={14}>
            Filter customers by account status.
          </Typography>
        </Box>

        <Box className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Chip
            label={`${filteredUsers.length} Customers`}
            sx={{
              fontWeight: 900,
              backgroundColor: "#e6fdf4",
              color: "#168a61",
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 170,
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                fontWeight: 800,
                backgroundColor: "white",
              },
            }}
          >
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Status Guide */}
      <Box
        sx={{
          p: 2,
          borderRadius: "22px",
          mb: 3,
          backgroundColor: "#f7fbff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>
          Status Guide
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label="Active"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#dcfce7",
                color: "#168a61",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              User can login and use the system
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label="Inactive"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#fef3c7",
                color: "#b45309",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              User account is disabled temporarily
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label="Blocked"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#fee2e2",
                color: "#dc2626",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              User is blocked from using the system
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
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
            <PeopleIcon sx={{ fontSize: 64, color: "primary.main" }} />

            <Typography fontWeight={900} fontSize={24} className="mt-3">
              No users found
            </Typography>

            <Typography color="text.secondary" className="mt-2">
              Customers will appear here after registration.
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
          {filteredUsers.map((user) => {
            const statusStyle = getStatusStyle(user.status);

            return (
              <Box
                key={user.id}
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
                  overflow: "hidden",
                  minWidth: 0,
                  boxSizing: "border-box",
                  transition: "0.25s",
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
                  {/* User top */}
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
                      label={user.status}
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
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </Avatar>

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                          overflow: "hidden",
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
                          {user.name}
                        </Typography>

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
                            {user.email}
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
                            {user.phone || "No phone number"}
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
                            Role: {user.role}
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
                          {user.is_email_verified ? (
                            <VerifiedIcon
                              sx={{
                                fontSize: 18,
                                color: "#16a66d",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <BlockIcon
                              sx={{
                                fontSize: 18,
                                color: "#dc2626",
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <Typography color="text.secondary" fontSize={14}>
                            Email:{" "}
                            {user.is_email_verified
                              ? "Verified"
                              : "Not Verified"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Status change */}
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
                          Admin can update customer account status.
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
                          value={user.status}
                          disabled={updatingId === user.id}
                          onChange={(e) =>
                            updateUserStatus(user.id, e.target.value)
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
  );
}

export default ManageUsers;