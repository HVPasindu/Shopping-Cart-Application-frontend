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
          error.response?.data?.message || "Could not update order status.",
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
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  const getCustomerName = (order) => {
    return (
      order.customer_name ||
      order.user_name ||
      order.name ||
      order.customer?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order.customer_email ||
      order.user_email ||
      order.email ||
      order.customer?.email ||
      "No email"
    );
  };

  const getCustomerPhone = (order) => {
    return (
      order.customer_phone ||
      order.user_phone ||
      order.phone ||
      order.customer?.phone ||
      "No phone"
    );
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
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: "28px",
          border: "1px solid #e5e7eb",
          backgroundColor: "white",
          boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            borderRadius: "26px",
            p: {
              xs: 3,
              sm: 4,
            },
            mb: 4,
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

          <Box sx={{ position: "relative", minWidth: 0 }}>
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
                wordBreak: "normal",
                overflowWrap: "normal",
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
                wordBreak: "normal",
                overflowWrap: "normal",
              }}
            >
              View customer orders, check order details, and update confirmed
              orders as completed or cancelled.
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: "22px",
            mb: 3,
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            alignItems: {
              xs: "stretch",
              lg: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: {
                xs: "unset",
                lg: "1 1 auto",
              },
              width: {
                xs: "100%",
                lg: "auto",
              },
            }}
          >
            <Typography
              fontWeight={900}
              sx={{
                whiteSpace: "normal",
                wordBreak: "normal",
                overflowWrap: "normal",
                lineHeight: 1.4,
              }}
            >
              Order List
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={14}
              sx={{
                mt: 0.5,
                lineHeight: 1.6,
                whiteSpace: "normal",
                wordBreak: "normal",
                overflowWrap: "normal",
                maxWidth: {
                  xs: "100%",
                  lg: "380px",
                },
              }}
            >
              Filter orders by order status and payment status.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              justifyContent: {
                xs: "flex-start",
                lg: "flex-end",
              },
              width: {
                xs: "100%",
                lg: "auto",
              },
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <Chip
              label={`${orders.length} Orders`}
              sx={{
                fontWeight: 900,
                backgroundColor: "#e6fdf4",
                color: "#168a61",
                justifyContent: "center",
                minHeight: 40,
              }}
            />

            <FormControl
              size="small"
              sx={{
                width: {
                  xs: "100%",
                  sm: 170,
                },
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
                width: {
                  xs: "100%",
                  sm: 180,
                },
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
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: "22px",
            mb: 3,
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box className="flex items-center gap-2 mb-3">
            <InfoIcon color="primary" fontSize="small" />
            <Typography fontWeight={900}>Status Guide</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Box className="flex items-center gap-2">
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
            </Box>

            <Box className="flex items-center gap-2">
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
            </Box>

            <Box className="flex items-center gap-2">
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

            <Box className="flex items-center gap-2">
              <Chip
                label="Pending"
                size="small"
                sx={{
                  fontWeight: 900,
                  backgroundColor: "#fef3c7",
                  color: "#b45309",
                }}
              />
              <Typography color="text.secondary" fontSize={13}>
                Payment not completed
              </Typography>
            </Box>
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

              <Typography fontWeight={900} fontSize={24} sx={{ mt: 1.5 }}>
                No orders found
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Orders will appear here after customers place orders.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              minWidth: 0,
            }}
          >
            {orders.map((order) => {
              const orderStatusStyle = getOrderStatusStyle(
                order.order_status
              );
              const paymentStatusStyle = getPaymentStatusStyle(
                order.payment_status
              );

              return (
                <Box
                  key={order.id}
                  sx={{
                    p: {
                      xs: 2,
                      sm: 3,
                    },
                    borderRadius: "24px",
                    backgroundColor: "#f7fbff",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        lg: "row",
                      },
                      justifyContent: "space-between",
                      gap: 2,
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        fontWeight={900}
                        fontSize={20}
                        sx={{
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {order.order_number || `Order #${order.id}`}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        fontSize={14}
                        sx={{ mt: 0.5 }}
                      >
                        {formatDate(order.created_at)}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={order.order_status}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 900,
                            backgroundColor: orderStatusStyle.bg,
                            color: orderStatusStyle.color,
                          }}
                        />

                        <Chip
                          label={`Payment: ${order.payment_status}`}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 900,
                            backgroundColor: paymentStatusStyle.bg,
                            color: paymentStatusStyle.color,
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        textAlign: {
                          xs: "left",
                          lg: "right",
                        },
                        flexShrink: 0,
                      }}
                    >
                      <Typography color="text.secondary" fontSize={14}>
                        Total Amount
                      </Typography>

                      <Typography
                        color="primary"
                        fontWeight={900}
                        fontSize={24}
                      >
                        Rs. {order.total_amount}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        minWidth: 0,
                      }}
                    >
                      <Box className="flex items-center gap-2">
                        <PersonIcon sx={{ fontSize: 18, color: "#64748b" }} />
                        <Typography
                          color="text.secondary"
                          fontSize={12}
                          fontWeight={800}
                        >
                          Customer
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight={900}
                        fontSize={14}
                        sx={{
                          mt: 0.5,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {getCustomerName(order)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        minWidth: 0,
                      }}
                    >
                      <Box className="flex items-center gap-2">
                        <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} />
                        <Typography
                          color="text.secondary"
                          fontSize={12}
                          fontWeight={800}
                        >
                          Email
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight={900}
                        fontSize={14}
                        sx={{
                          mt: 0.5,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {getCustomerEmail(order)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        minWidth: 0,
                      }}
                    >
                      <Box className="flex items-center gap-2">
                        <PhoneIcon sx={{ fontSize: 18, color: "#64748b" }} />
                        <Typography
                          color="text.secondary"
                          fontSize={12}
                          fontWeight={800}
                        >
                          Phone
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight={900}
                        fontSize={14}
                        sx={{
                          mt: 0.5,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {getCustomerPhone(order)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 1.5,
                    }}
                  >
                    <Button
                      fullWidth
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
                      View Details
                    </Button>

                    {order.order_status === "confirmed" && (
                      <>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<CheckCircleIcon />}
                          disabled={updatingId === order.id}
                          onClick={() =>
                            updateOrderStatus(order.id, "completed")
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: "14px",
                            borderColor: "#2563eb",
                            color: "#2563eb",
                          }}
                        >
                          Complete
                        </Button>

                        <Button
                          fullWidth
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
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "28px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
          }}
        >
          Order Details
        </DialogTitle>

        <DialogContent>
          {detailsLoading ? (
            <Box
              sx={{
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : selectedOrder ? (
            <Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "20px",
                  backgroundColor: "#f7fbff",
                  border: "1px solid #e5e7eb",
                  mb: 2,
                }}
              >
                <Typography fontWeight={900} fontSize={20}>
                  {selectedOrder.order_number || `Order #${selectedOrder.id}`}
                </Typography>

                <Typography color="text.secondary" fontSize={14} sx={{ mt: 1 }}>
                  Created At: {formatDate(selectedOrder.created_at)}
                </Typography>

                <Typography color="text.secondary" fontSize={14}>
                  Total Amount: Rs. {selectedOrder.total_amount}
                </Typography>

                <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={selectedOrder.order_status}
                    size="small"
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
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 900,
                      backgroundColor: getPaymentStatusStyle(
                        selectedOrder.payment_status
                      ).bg,
                      color: getPaymentStatusStyle(
                        selectedOrder.payment_status
                      ).color,
                    }}
                  />
                </Box>
              </Box>

              <Typography fontWeight={900} fontSize={18} sx={{ mb: 1.5 }}>
                Ordered Items
              </Typography>

              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {selectedOrder.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 2,
                        borderRadius: "18px",
                        backgroundColor: "#f7fbff",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        justifyContent: "space-between",
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          fontWeight={900}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {item.product_name}
                        </Typography>

                        <Typography color="text.secondary" fontSize={14}>
                          Qty: {item.quantity} × Rs. {item.unit_price}
                        </Typography>
                      </Box>

                      <Typography color="primary" fontWeight={900}>
                        Rs. {item.subtotal}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No items found.</Typography>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">No order selected.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDetails(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "14px",
              px: 3,
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