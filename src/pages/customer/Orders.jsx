// src/pages/customer/Orders.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";

import Swal from "sweetalert2";
import API from "../../services/api";

function Orders() {
  const [summaryItems, setSummaryItems] = useState([]);
  const [summaryTotal, setSummaryTotal] = useState(0);
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState("");

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const getOrderSummary = async () => {
    try {
      const res = await API.get("/orders/summary");

      setSummaryItems(res.data.data.items || []);
      setSummaryTotal(res.data.data.total_amount || 0);
      setCanPlaceOrder(res.data.data.can_place_order || false);
      setSummaryMessage("");
    } catch (error) {
      setSummaryItems([]);
      setSummaryTotal(0);
      setCanPlaceOrder(false);
      setSummaryMessage(
        error.response?.data?.message || "No active cart available."
      );
    }
  };

  const getMyOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data.data.orders || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Orders Load Failed",
        text: error.response?.data?.message || "Could not load your orders.",
        confirmButtonColor: "#28DF99",
      });
    }
  };

  const loadPageData = async () => {
    try {
      setLoading(true);

      await getOrderSummary();
      await getMyOrders();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const confirmOrder = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Confirm Order?",
      text: "Are you sure you want to place this order?",
      showCancelButton: true,
      confirmButtonText: "Yes, Place Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setConfirming(true);

      await API.post("/orders/confirm");

      Swal.fire({
        icon: "success",
        title: "Order Placed",
        text: "Your order has been placed successfully.",
        confirmButtonColor: "#28DF99",
      });

      await loadPageData();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          error.response?.data?.message ||
          "Could not place your order. Please try again.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setConfirming(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      setDetailsLoading(true);
      setOpenDetails(true);

      const res = await API.get(`/orders/${orderId}`);
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

  const cancelOrder = async (orderId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setCancelling(true);

      await API.put(`/orders/${orderId}/cancel`);

      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        text: "Your order has been cancelled successfully.",
        confirmButtonColor: "#28DF99",
      });

      await loadPageData();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Cancel Failed",
        text:
          error.response?.data?.message || "Could not cancel this order.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setCancelling(false);
    }
  };

  const getOrderStatusColor = (status) => {
    if (status === "confirmed") {
      return {
        bg: "#dcfce7",
        color: "#168a61",
      };
    }

    if (status === "cancelled") {
      return {
        bg: "#fee2e2",
        color: "#dc2626",
      };
    }

    if (status === "completed") {
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

  const getPaymentStatusColor = (status) => {
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
        <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-3">
          <HistoryIcon fontSize="small" />
          Orders
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
          Orders
        </Typography>

        <Typography color="text.secondary" className="mt-2">
          Confirm your cart order and view your order history.
        </Typography>

        {/* Order Summary */}
        <Box
          className="mt-8 p-5 rounded-[24px]"
          sx={{
            backgroundColor: "#f7fbff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <Box>
              <Typography fontWeight={900} fontSize={24}>
                Order Summary
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                These are the products currently in your cart.
              </Typography>
            </Box>

            {summaryItems.length > 0 && (
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={!canPlaceOrder || confirming}
                onClick={confirmOrder}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: "16px",
                  px: 3,
                  py: 1.2,
                  boxShadow: "none",
                }}
              >
                {confirming ? "Placing..." : "Place Order"}
              </Button>
            )}
          </Box>

          {summaryItems.length === 0 ? (
            <Box
              sx={{
                minHeight: "130px",
                borderRadius: "20px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <Box>
                <ReceiptLongIcon
                  sx={{ fontSize: 48, color: "primary.main" }}
                />

                <Typography fontWeight={900} className="mt-2">
                  No order summary
                </Typography>

                <Typography color="text.secondary" fontSize={14}>
                  {summaryMessage || "Add products to your cart first."}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Box className="flex flex-col gap-3">
                {summaryItems.map((item) => {
                  const imageUrl = item.main_image?.image_url_full;

                  return (
                    <Box
                      key={item.cart_item_id}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-[20px]"
                      sx={{
                        backgroundColor: item.can_order ? "white" : "#fff7ed",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box
                        sx={{
                          width: {
                            xs: "100%",
                            sm: 110,
                          },
                          height: 95,
                          borderRadius: "16px",
                          overflow: "hidden",
                          backgroundColor: "#e6fdf4",
                          flexShrink: 0,
                        }}
                      >
                        {imageUrl ? (
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={item.product_name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <Box className="w-full h-full flex items-center justify-center">
                            <ReceiptLongIcon
                              sx={{ fontSize: 38, color: "primary.main" }}
                            />
                          </Box>
                        )}
                      </Box>

                      <Box className="flex-1">
                        <Box className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <Box>
                            <Typography fontWeight={900} fontSize={18}>
                              {item.product_name}
                            </Typography>

                            <Typography color="text.secondary" fontSize={14}>
                              Qty: {item.quantity} × Rs. {item.unit_price}
                            </Typography>

                            {!item.can_order && (
                              <Typography
                                sx={{
                                  mt: 1,
                                  color: "#ea580c",
                                  fontWeight: 800,
                                  fontSize: "14px",
                                }}
                              >
                                {item.issue}
                              </Typography>
                            )}
                          </Box>

                          <Typography
                            color="primary"
                            fontWeight={900}
                            fontSize={18}
                          >
                            Rs. {item.subtotal}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box
                className="mt-5 p-4 rounded-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                sx={{
                  backgroundColor: "#e6fdf4",
                  border: "1px solid #bbf7d0",
                }}
              >
                <Typography color="text.secondary" fontWeight={800}>
                  Total Amount
                </Typography>

                <Typography fontWeight={900} fontSize={28}>
                  Rs. {summaryTotal}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order History */}
        <Box>
          <Typography fontWeight={900} fontSize={24}>
            Order History
          </Typography>

          <Typography color="text.secondary" fontSize={14} className="mt-1">
            Your previous orders are listed below.
          </Typography>

          {/* Status Meaning Box */}
          <Box
            className="mt-5 p-4 rounded-[20px]"
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
              <Box className="flex items-center gap-2">
                <Typography fontWeight={800} fontSize={14}>
                  Order Status:
                </Typography>

                <Chip
                  label="Confirmed"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor: "#dcfce7",
                    color: "#168a61",
                  }}
                />

                <Typography color="text.secondary" fontSize={13}>
                  Order placed
                </Typography>
              </Box>

              <Box className="flex items-center gap-2">
                <Chip
                  label="Completed"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor: "#dbeafe",
                    color: "#2563eb",
                  }}
                />

                <Typography color="text.secondary" fontSize={13}>
                  Order finished
                </Typography>
              </Box>

              <Box className="flex items-center gap-2">
                <Chip
                  label="Cancelled"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                  }}
                />

                <Typography color="text.secondary" fontSize={13}>
                  Order cancelled
                </Typography>
              </Box>

              <Box className="flex items-center gap-2">
                <Typography fontWeight={800} fontSize={14}>
                  Payment Status:
                </Typography>

                <Chip
                  label="Pending"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor: "#fef3c7",
                    color: "#b45309",
                  }}
                />

                <Typography color="text.secondary" fontSize={13}>
                  Payment not completed yet
                </Typography>
              </Box>
            </Box>
          </Box>

          {orders.length === 0 ? (
            <Box
              className="mt-5 p-5 rounded-[24px] text-center"
              sx={{
                backgroundColor: "#f7fbff",
                border: "1px solid #e5e7eb",
              }}
            >
              <HistoryIcon sx={{ fontSize: 50, color: "primary.main" }} />

              <Typography fontWeight={900} fontSize={20} className="mt-2">
                No orders yet
              </Typography>

              <Typography color="text.secondary" className="mt-1">
                Your confirmed orders will appear here.
              </Typography>
            </Box>
          ) : (
            <Box className="mt-5 flex flex-col gap-4">
              {orders.map((order) => {
                const orderStatusStyle = getOrderStatusColor(
                  order.order_status
                );

                const paymentStatusStyle = getPaymentStatusColor(
                  order.payment_status
                );

                return (
                  <Box
                    key={order.id}
                    className="p-4 rounded-[22px]"
                    sx={{
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f7fbff",
                    }}
                  >
                    <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <Box>
                        <Typography fontWeight={900} fontSize={18}>
                          {order.order_number}
                        </Typography>

                        <Typography color="text.secondary" fontSize={14}>
                          Total: Rs. {order.total_amount}
                        </Typography>

                        <Typography color="text.secondary" fontSize={14}>
                          Date: {new Date(order.created_at).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box className="flex flex-wrap items-center gap-3">
                        <Box>
                          <Typography
                            color="text.secondary"
                            fontWeight={800}
                            fontSize={12}
                            className="mb-1"
                          >
                            Order Status
                          </Typography>

                          <Chip
                            label={order.order_status}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              backgroundColor: orderStatusStyle.bg,
                              color: orderStatusStyle.color,
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography
                            color="text.secondary"
                            fontWeight={800}
                            fontSize={12}
                            className="mb-1"
                          >
                            Payment Status
                          </Typography>

                          <Chip
                            label={order.payment_status}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              backgroundColor: paymentStatusStyle.bg,
                              color: paymentStatusStyle.color,
                            }}
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => viewOrderDetails(order.id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: "14px",
                            borderColor: "primary.main",
                            color: "primary.main",
                            mt: {
                              xs: 0,
                              md: 2.3,
                            },
                          }}
                        >
                          View
                        </Button>

                        {order.order_status === "confirmed" && (
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            disabled={cancelling}
                            onClick={() => cancelOrder(order.id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 800,
                              borderRadius: "14px",
                              borderColor: "#ef4444",
                              color: "#ef4444",
                              mt: {
                                xs: 0,
                                md: 2.3,
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
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
              <Typography fontWeight={900}>
                {selectedOrder.order_number}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Total: Rs. {selectedOrder.total_amount}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Order Status: {selectedOrder.order_status}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Payment Status: {selectedOrder.payment_status}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box className="flex flex-col gap-3">
                {selectedOrder.items?.map((item) => (
                  <Box
                    key={item.id}
                    className="p-3 rounded-[16px]"
                    sx={{
                      backgroundColor: "#f7fbff",
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

export default Orders;