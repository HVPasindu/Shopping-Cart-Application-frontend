// src/pages/customer/Notifications.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InfoIcon from "@mui/icons-material/Info";
import CircleIcon from "@mui/icons-material/Circle";

import Swal from "sweetalert2";
import API from "../../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [readFilter, setReadFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const getNotifications = async () => {
    try {
      setLoading(true);

      let url = "/notifications";
      const params = [];

      if (readFilter !== "all") {
        params.push(`is_read=${readFilter}`);
      }

      if (typeFilter !== "all") {
        params.push(`type=${typeFilter}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await API.get(url);

      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.unread_count || 0);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Notifications Load Failed",
        text:
          error.response?.data?.message ||
          "Could not load your notifications.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [readFilter, typeFilter]);

  const markAsRead = async (notificationId) => {
    try {
      setUpdating(true);

      await API.put(`/notifications/${notificationId}/read`);

      await getNotifications();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Could not mark notification as read.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Mark all as read?",
      text: "All unread notifications will be marked as read.",
      showCancelButton: true,
      confirmButtonText: "Yes, mark all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdating(true);

      await API.put("/notifications/read-all");

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "All notifications marked as read.",
        confirmButtonColor: "#28DF99",
      });

      await getNotifications();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Could not mark all notifications as read.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getTypeIcon = (type) => {
    if (type === "cart") {
      return <ShoppingCartIcon fontSize="small" />;
    }

    if (type === "order") {
      return <ReceiptLongIcon fontSize="small" />;
    }

    return <InfoIcon fontSize="small" />;
  };

  const getTypeStyle = (type) => {
    if (type === "cart") {
      return {
        bg: "#e6fdf4",
        color: "#16a66d",
      };
    }

    if (type === "order") {
      return {
        bg: "#dbeafe",
        color: "#2563eb",
      };
    }

    return {
      bg: "#fef3c7",
      color: "#b45309",
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <Box>
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-3">
            <NotificationsIcon fontSize="small" />
            Notifications
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
            Notifications
          </Typography>

          <Typography color="text.secondary" className="mt-2">
            View cart, order, and system updates.
          </Typography>
        </Box>

        <Box className="flex flex-col sm:flex-row gap-3">
          <Chip
            label={`${unreadCount} unread`}
            sx={{
              fontWeight: 900,
              backgroundColor: unreadCount > 0 ? "#fee2e2" : "#dcfce7",
              color: unreadCount > 0 ? "#dc2626" : "#168a61",
              px: 1,
            }}
          />

          <Button
            variant="contained"
            startIcon={<DoneAllIcon />}
            disabled={updating || unreadCount === 0}
            onClick={markAllAsRead}
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "16px",
              px: 3,
              py: 1.1,
              boxShadow: "none",
            }}
          >
            Mark All Read
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box
        className="p-4 rounded-[22px] mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
        sx={{
          backgroundColor: "#f7fbff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box>
          <Typography fontWeight={900}>Filter Notifications</Typography>

          <Typography color="text.secondary" fontSize={14}>
            You can filter notifications by read status and type.
          </Typography>
        </Box>

        <Box className="flex flex-col sm:flex-row gap-3">
          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              backgroundColor: "white",
              borderRadius: "14px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                fontWeight: 700,
              },
            }}
          >
            <Select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="false">Unread</MenuItem>
              <MenuItem value="true">Read</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              backgroundColor: "white",
              borderRadius: "14px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                fontWeight: 700,
              },
            }}
          >
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="cart">Cart</MenuItem>
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Notification List */}
      {notifications.length === 0 ? (
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
            <NotificationsIcon
              sx={{ fontSize: 64, color: "primary.main" }}
            />

            <Typography fontWeight={900} fontSize={24} className="mt-3">
              No notifications
            </Typography>

            <Typography color="text.secondary" className="mt-2">
              Your notifications will appear here.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className="flex flex-col gap-4">
          {notifications.map((notification) => {
            const typeStyle = getTypeStyle(notification.type);
            const isUnread = !notification.is_read;

            return (
              <Box
                key={notification.id}
                className="p-4 rounded-[24px]"
                sx={{
                  border: isUnread
                    ? "1px solid #86efac"
                    : "1px solid #e5e7eb",
                  backgroundColor: isUnread ? "#f0fdf4" : "#f7fbff",
                }}
              >
                <Box className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <Box className="flex gap-4">
                    <Box
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      sx={{
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.color,
                      }}
                    >
                      {getTypeIcon(notification.type)}
                    </Box>

                    <Box>
                      <Box className="flex flex-wrap items-center gap-2 mb-1">
                        <Typography fontWeight={900} fontSize={18}>
                          {notification.title}
                        </Typography>

                        {isUnread && (
                          <Box className="flex items-center gap-1 text-[#16a66d]">
                            <CircleIcon sx={{ fontSize: 9 }} />
                            <Typography fontWeight={900} fontSize={12}>
                              New
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: "14px",
                          lineHeight: 1.7,
                          maxWidth: "680px",
                        }}
                      >
                        {notification.message}
                      </Typography>

                      <Box className="flex flex-wrap items-center gap-2 mt-3">
                        <Chip
                          label={notification.type}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 800,
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.color,
                          }}
                        />

                        <Chip
                          label={isUnread ? "Unread" : "Read"}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            backgroundColor: isUnread ? "#fee2e2" : "#dcfce7",
                            color: isUnread ? "#dc2626" : "#168a61",
                          }}
                        />

                        <Typography color="text.secondary" fontSize={13}>
                          {formatDate(notification.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {isUnread && (
                    <Button
                      variant="outlined"
                      startIcon={<MarkEmailReadIcon />}
                      disabled={updating}
                      onClick={() => markAsRead(notification.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: "14px",
                        borderColor: "primary.main",
                        color: "primary.main",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mark Read
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <Divider sx={{ mt: 6 }} />

      <Typography color="text.secondary" fontSize={13} className="mt-4">
        Cart notifications are about product availability, removed items, or stock
        changes. Order notifications are about your order updates. System
        notifications are general account messages.
      </Typography>
    </Paper>
  );
}

export default Notifications;