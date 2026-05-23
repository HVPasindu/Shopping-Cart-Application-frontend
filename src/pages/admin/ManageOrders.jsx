// src/pages/admin/ManageOrders.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";

import Swal from "sweetalert2";
import API from "../../services/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const getOrders = async () => {
    try {
      setLoading(true);

      const params = [];

      if (statusFilter !== "all") {
        params.push(`status=${statusFilter}`);
      }

      if (paymentFilter !== "all") {
        params.push(`payment_status=${paymentFilter}`);
      }

      let url = "/admin/orders";

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await API.get(url);
      setOrders(res.data.data.orders || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Orders Load Failed",
        text: error.response?.data?.message || "Could not load orders.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [statusFilter, paymentFilter]);

  const viewOrderDetails = async (orderId) => {
    try {
      setOpenDetails(true);
      setDetailsLoading(true);
      setSelectedOrder(null);

      const res = await API.get(`/admin/orders/${orderId}`);
      setSelectedOrder(res.data.data.order);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Details Load Failed",
        text: error.response?.data?.message || "Could not load order details.",
        confirmButtonColor: "#28DF99",
      });

      setOpenDetails(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const result = await Swal.fire({
      icon: status === "completed" ? "question" : "warning",
      title: status === "completed" ? "Complete Order?" : "Cancel Order?",
      text:
        status === "completed"
          ? "Are you sure you want to mark this order as completed?"
          : "Are you sure you want to cancel this order? Product stock will be restored.",
      showCancelButton: true,
      confirmButtonText:
        status === "completed" ? "Yes, Complete" : "Yes, Cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingId(orderId);

      await API.put(`/admin/orders/${orderId}/status`, {
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Order Updated",
        text:
          status === "completed"
            ? "Order marked as completed successfully."
            : "Order cancelled successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getOrders();

      if (openDetails && selectedOrder?.id === orderId) {
        await viewOrderDetails(orderId);
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Could not update order status.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getOrderStatusStyle = (status) => {
    if (status === "confirmed") {
      return {
        bg: "#dcfce7",
        color: "#168a61",
      };
    }

    if (status === "completed") {
      return {
        bg: "#dbeafe",
        color: "#2563eb",
      };
    }

    if (status === "cancelled") {
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

  const getPaymentStatusStyle = (status) => {
    if (status === "paid") {
      return {
        bg: "#dcfce7",
        color: "#168a61",
      };
    }

    if (status === "failed") {
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

          <Box className="relative">
            <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-[#16a66d] font-bold text-sm mb-4">
              <ReceiptLongIcon fontSize="small" />
              Manage Orders
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
              Order Management
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
              View customer orders, check order details, and update confirmed
              orders as completed or cancelled.
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          className="p-4 rounded-[22px] mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box>
            <Typography fontWeight={900}>Order List</Typography>

            <Typography color="text.secondary" fontSize={14}>
              Filter orders by order status and payment status.
            </Typography>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Chip
              label={`${orders.length} Orders`}
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
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

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
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Status Guide */}
        <Box
          className="p-4 rounded-[22px] mb-6"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box className="flex items-center gap-2 mb-3">
            <InfoIcon color="primary" fontSize="small" />
            <Typography fontWeight={900}>Status Guide</Typography>
          </Box>

          <Box className="flex flex-wrap gap-3">
            <Chip
              label="Confirmed"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#dcfce7",
                color: "#168a61",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              Customer placed order
            </Typography>

            <Chip
              label="Completed"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#dbeafe",
                color: "#2563eb",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              Admin finished order
            </Typography>

            <Chip
              label="Cancelled"
              size="small"
              sx={{
                fontWeight: 900,
                backgroundColor: "#fee2e2",
                color: "#dc2626",
              }}
            />

            <Typography color="text.secondary" fontSize={13}>
              Order cancelled
            </Typography>
          </Box>
        </Box>

        {/* Order Cards */}
        {orders.length === 0 ? (
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
              <ReceiptLongIcon sx={{ fontSize: 64, color: "primary.main" }} />

              <Typography fontWeight={900} fontSize={24} className="mt-3">
                No orders found
              </Typography>

              <Typography color="text.secondary" className="mt-2">
                Orders will appear here after customers place orders.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="flex flex-col gap-4">
            {orders.map((order) => {
              const orderStyle = getOrderStatusStyle(order.order_status);
              const paymentStyle = getPaymentStatusStyle(order.payment_status);

              return (
                <Box
                  key={order.id}
                  sx={{
                    p: 3,
                    borderRadius: "26px",
                    backgroundColor: "#f7fbff",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    transition: "0.25s",
                    "&:hover": {
                      backgroundColor: "#ecfdf5",
                      boxShadow: "0 18px 35px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontWeight={900}
                        fontSize={20}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {order.order_number}
                      </Typography>

                      <Box className="flex flex-wrap gap-3 mt-2">
                        <Box className="flex items-center gap-1">
                          <PersonIcon
                            sx={{ fontSize: 18, color: "#64748b" }}
                          />

                          <Typography color="text.secondary" fontSize={14}>
                            {order.customer_name}
                          </Typography>
                        </Box>

                        <Box className="flex items-center gap-1">
                          <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} />

                          <Typography
                            color="text.secondary"
                            fontSize={14}
                            sx={{ wordBreak: "break-word" }}
                          >
                            {order.customer_email}
                          </Typography>
                        </Box>

                        <Box className="flex items-center gap-1">
                          <PhoneIcon sx={{ fontSize: 18, color: "#64748b" }} />

                          <Typography color="text.secondary" fontSize={14}>
                            {order.customer_phone || "No phone"}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography color="primary" fontWeight={900} mt={2}>
                        Total: Rs. {order.total_amount}
                      </Typography>

                      <Typography color="text.secondary" fontSize={14} mt={0.5}>
                        Date: {formatDate(order.created_at)}
                      </Typography>
                    </Box>

                    <Box className="flex flex-wrap items-center gap-3">
                      <Chip
                        label={order.order_status}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 900,
                          backgroundColor: orderStyle.bg,
                          color: orderStyle.color,
                        }}
                      />

                      <Chip
                        label={`Payment: ${order.payment_status}`}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 900,
                          backgroundColor: paymentStyle.bg,
                          color: paymentStyle.color,
                        }}
                      />

                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => viewOrderDetails(order.id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 900,
                          borderRadius: "14px",
                          borderColor: "primary.main",
                          color: "primary.main",
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>

                  {order.order_status === "confirmed" && (
                    <Box
                      className="mt-5 p-4 rounded-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      sx={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={900} fontSize={14}>
                          Update Order Status
                        </Typography>

                        <Typography color="text.secondary" fontSize={13}>
                          Admin can only mark confirmed orders as completed or
                          cancelled.
                        </Typography>
                      </Box>

                      <Box className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          disabled={updatingId === order.id}
                          onClick={() =>
                            updateOrderStatus(order.id, "completed")
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: "14px",
                            boxShadow: "none",
                          }}
                        >
                          Complete
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          disabled={updatingId === order.id}
                          onClick={() =>
                            updateOrderStatus(order.id, "cancelled")
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: "14px",
                            borderColor: "#ef4444",
                            color: "#ef4444",
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
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
        <DialogTitle fontWeight={900}>Order Details</DialogTitle>

        <DialogContent>
          {detailsLoading ? (
            <Box className="flex justify-center py-8">
              <CircularProgress />
            </Box>
          ) : selectedOrder ? (
            <Box>
              <Typography fontWeight={900} fontSize={20}>
                {selectedOrder.order_number}
              </Typography>

              <Typography color="text.secondary" fontSize={14} mt={1}>
                Customer: {selectedOrder.customer_name}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Email: {selectedOrder.customer_email}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Phone: {selectedOrder.customer_phone || "No phone"}
              </Typography>

              <Typography color="primary" fontWeight={900} mt={2}>
                Total: Rs. {selectedOrder.total_amount}
              </Typography>

              <Box className="flex flex-wrap gap-2 mt-3">
                <Chip
                  label={`Order: ${selectedOrder.order_status}`}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 900,
                    backgroundColor: getOrderStatusStyle(
                      selectedOrder.order_status
                    ).bg,
                    color: getOrderStatusStyle(selectedOrder.order_status)
                      .color,
                  }}
                />

                <Chip
                  label={`Payment: ${selectedOrder.payment_status}`}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 900,
                    backgroundColor: getPaymentStatusStyle(
                      selectedOrder.payment_status
                    ).bg,
                    color: getPaymentStatusStyle(selectedOrder.payment_status)
                      .color,
                  }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography fontWeight={900} fontSize={18} mb={2}>
                Ordered Items
              </Typography>

              <Box className="flex flex-col gap-3">
                {selectedOrder.items?.map((item) => (
                  <Box
                    key={item.id}
                    className="p-3 rounded-[16px]"
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography fontWeight={900}>
                      {item.product_name}
                    </Typography>

                    <Typography color="text.secondary" fontSize={14}>
                      Qty: {item.quantity} × Rs. {item.unit_price}
                    </Typography>

                    <Typography color="primary" fontWeight={900}>
                      Rs. {item.subtotal}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {selectedOrder.order_status === "confirmed" && (
                <Box className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    disabled={updatingId === selectedOrder.id}
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "completed")
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: "14px",
                      boxShadow: "none",
                    }}
                  >
                    Complete Order
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    disabled={updatingId === selectedOrder.id}
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "cancelled")
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: "14px",
                      borderColor: "#ef4444",
                      color: "#ef4444",
                    }}
                  >
                    Cancel Order
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">No details found.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDetails(false)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "14px",
              boxShadow: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManageOrders;