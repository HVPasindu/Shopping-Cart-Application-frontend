// src/pages/customer/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import Swal from "sweetalert2";
import API from "../../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const getCart = async () => {
    try {
      setLoading(true);

      const res = await API.get("/cart");

      setCart(res.data.data.cart);
      setItems(res.data.data.items || []);
      setTotalAmount(res.data.data.total_amount || 0);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Cart Load Failed",
        text: error.response?.data?.message || "Could not load your cart.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return;
    }

    try {
      setUpdating(true);

      await API.put(`/cart/items/${itemId}`, {
        quantity: newQuantity,
      });

      await getCart();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message || "Could not update item quantity.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from cart?",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdating(true);

      await API.delete(`/cart/items/${itemId}`);

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Item removed from cart.",
        confirmButtonColor: "#28DF99",
      });

      await getCart();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Remove Failed",
        text: error.response?.data?.message || "Could not remove item.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (items.length === 0) {
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Clear Cart?",
      text: "All items will be removed from your cart.",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28DF99",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdating(true);

      await API.delete("/cart/clear");

      Swal.fire({
        icon: "success",
        title: "Cart Cleared",
        text: "All items removed from your cart.",
        confirmButtonColor: "#28DF99",
      });

      await getCart();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Clear Failed",
        text: error.response?.data?.message || "Could not clear cart.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setUpdating(false);
    }
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
      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Box>
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-3">
            <ShoppingCartIcon fontSize="small" />
            My Cart
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
            Cart Items
          </Typography>

          <Typography color="text.secondary" className="mt-2">
            View and manage products added to your cart.
          </Typography>
        </Box>

        {items.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<DeleteSweepIcon />}
            onClick={clearCart}
            disabled={updating}
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "16px",
              px: 3,
              py: 1.2,
              borderColor: "#ef4444",
              color: "#ef4444",
            }}
          >
            Clear Cart
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
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
            <ShoppingCartIcon sx={{ fontSize: 60, color: "primary.main" }} />

            <Typography fontWeight={900} fontSize={24} className="mt-3">
              Your cart is empty
            </Typography>

            <Typography color="text.secondary" className="mt-2">
              Add products to your cart and they will appear here.
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box className="flex flex-col gap-4">
            {items.map((item) => {
              const imageUrl = item.main_image?.image_url_full;

              const hasIssue =
                item.product_status !== "active" ||
                item.category_status !== "active" ||
                Number(item.stock_quantity) < Number(item.quantity);

              return (
                <Box
                  key={item.cart_item_id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-[24px]"
                  sx={{
                    border: "1px solid #e5e7eb",
                    backgroundColor: hasIssue ? "#fff7ed" : "#f7fbff",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        md: 150,
                      },
                      height: 130,
                      borderRadius: "20px",
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
                        <ShoppingCartIcon
                          sx={{ fontSize: 50, color: "primary.main" }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box className="flex-1">
                    <Box className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <Box>
                        <Typography fontWeight={900} fontSize={21}>
                          {item.product_name}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.8,
                            fontSize: "14px",
                            lineHeight: 1.6,
                          }}
                        >
                          {item.product_description ||
                            "No description available."}
                        </Typography>

                        {hasIssue && (
                          <Typography
                            sx={{
                              mt: 1,
                              color: "#ea580c",
                              fontWeight: 800,
                              fontSize: "14px",
                            }}
                          >
                            This item may not be available for order.
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        color="primary"
                        fontWeight={900}
                        fontSize={21}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        Rs. {item.subtotal}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <Box>
                        <Typography color="text.secondary" fontSize={14}>
                          Unit Price: Rs. {item.unit_price}
                        </Typography>

                        <Typography color="text.secondary" fontSize={14}>
                          Available Stock: {item.stock_quantity}
                        </Typography>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <IconButton
                          onClick={() =>
                            updateQuantity(
                              item.cart_item_id,
                              Number(item.quantity) - 1
                            )
                          }
                          disabled={updating || Number(item.quantity) <= 1}
                          sx={{
                            backgroundColor: "#e6fdf4",
                            "&:hover": {
                              backgroundColor: "#d1fae5",
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography fontWeight={900} fontSize={18}>
                          {item.quantity}
                        </Typography>

                        <IconButton
                          onClick={() =>
                            updateQuantity(
                              item.cart_item_id,
                              Number(item.quantity) + 1
                            )
                          }
                          disabled={
                            updating ||
                            Number(item.quantity) >= Number(item.stock_quantity)
                          }
                          sx={{
                            backgroundColor: "#e6fdf4",
                            "&:hover": {
                              backgroundColor: "#d1fae5",
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => removeItem(item.cart_item_id)}
                          disabled={updating}
                          sx={{
                            color: "#ef4444",
                            backgroundColor: "#fee2e2",
                            "&:hover": {
                              backgroundColor: "#fecaca",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box
            className="mt-6 p-5 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            sx={{
              backgroundColor: "#e6fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            <Box>
              <Typography color="text.secondary" fontSize={14}>
                Cart Total
              </Typography>

              <Typography fontWeight={900} fontSize={30}>
                Rs. {totalAmount}
              </Typography>
            </Box>

            <Button
              variant="contained"
              disabled={items.length === 0}
              onClick={() => navigate("/customer/orders")}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                px: 4,
                py: 1.3,
                boxShadow: "none",
              }}
            >
              Continue to Order
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default Cart;