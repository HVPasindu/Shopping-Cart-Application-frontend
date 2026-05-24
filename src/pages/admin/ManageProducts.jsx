// src/pages/admin/ManageProducts.jsx
import { useCallback, useEffect, useState } from "react";
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
  TextField,
  IconButton,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CategoryIcon from "@mui/icons-material/Category";
import PaidIcon from "@mui/icons-material/Paid";
import InventoryIcon from "@mui/icons-material/Inventory";

import Swal from "sweetalert2";
import API from "../../services/api";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    images: [],
  });

  const [errors, setErrors] = useState({
    category_id: "",
    name: "",
    price: "",
    stock_quantity: "",
  });

  const getBackendBaseUrl = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  };

  const getImageUrl = (image) => {
    const rawImageUrl =
      image?.image_url_full ||
      image?.image_url ||
      image?.url ||
      image?.path ||
      image;

    if (!rawImageUrl) {
      return null;
    }

    const imageUrl = String(rawImageUrl);

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${getBackendBaseUrl()}/${imageUrl.replace(/^\/+/, "")}`;
  };

  const getProductImage = (product) => {
    if (product.main_image) {
      return getImageUrl(product.main_image);
    }

    if (product.images && product.images.length > 0) {
      return getImageUrl(product.images[0]);
    }

    if (product.product_images && product.product_images.length > 0) {
      return getImageUrl(product.product_images[0]);
    }

    if (product.image_url_full || product.image_url || product.image) {
      return getImageUrl(
        product.image_url_full || product.image_url || product.image
      );
    }

    return null;
  };

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = [];

      if (statusFilter !== "all") {
        params.push(`status=${statusFilter}`);
      }

      if (categoryFilter !== "all") {
        params.push(`category_id=${categoryFilter}`);
      }

      let url = "/products/admin/all";

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await API.get(url);
      setProducts(res.data.data.products || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Products Load Failed",
        text: error.response?.data?.message || "Could not load products.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  const getCategories = useCallback(async () => {
    try {
      const res = await API.get("/categories/admin/all");
      setCategories(res.data.data.categories || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Categories Load Failed",
        text: error.response?.data?.message || "Could not load categories.",
        confirmButtonColor: "#28DF99",
      });
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const openAddDialog = () => {
    setEditingProduct(null);

    setFormData({
      category_id: "",
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      images: [],
    });

    setErrors({
      category_id: "",
      name: "",
      price: "",
      stock_quantity: "",
    });

    setOpenDialog(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);

    setFormData({
      category_id: product.category_id || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock_quantity: product.stock_quantity || "",
      images: [],
    });

    setErrors({
      category_id: "",
      name: "",
      price: "",
      stock_quantity: "",
    });

    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setEditingProduct(null);

    setFormData({
      category_id: "",
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      images: [],
    });

    setErrors({
      category_id: "",
      name: "",
      price: "",
      stock_quantity: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
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

  const validateProduct = () => {
    const nextErrors = {
      category_id: "",
      name: "",
      price: "",
      stock_quantity: "",
    };

    if (!formData.category_id) {
      nextErrors.category_id = "Category is required";
    }

    if (!formData.name.trim()) {
      nextErrors.name = "Product name is required";
    }

    if (!formData.price) {
      nextErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      nextErrors.price = "Price must be greater than 0";
    }

    if (formData.stock_quantity === "") {
      nextErrors.stock_quantity = "Stock quantity is required";
    } else if (Number(formData.stock_quantity) < 0) {
      nextErrors.stock_quantity = "Stock quantity cannot be negative";
    }

    setErrors(nextErrors);

    return (
      !nextErrors.category_id &&
      !nextErrors.name &&
      !nextErrors.price &&
      !nextErrors.stock_quantity
    );
  };

  const saveProduct = async () => {
    const isValid = validateProduct();

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("category_id", formData.category_id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock_quantity", formData.stock_quantity);

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          data.append("product_images", image);
        });
      }

      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, data);
      } else {
        await API.post("/products", data);
      }

      Swal.fire({
        icon: "success",
        title: editingProduct ? "Product Updated" : "Product Created",
        text: editingProduct
          ? "Product updated successfully."
          : "New product created successfully.",
        confirmButtonColor: "#28DF99",
      });

      closeDialog();
      await getProducts();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.response?.data?.message || "Could not save product.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProductStatus = async (productId, status) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Change Product Status?",
      text: `Are you sure you want to change this product to ${status}?`,
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
      await API.put(`/products/${productId}/status`, {
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Product status updated successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getProducts();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text:
          error.response?.data?.message || "Could not update product status.",
        confirmButtonColor: "#28DF99",
      });
    }
  };

  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Product?",
      text: "This will permanently delete this product.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await API.delete(`/products/${productId}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Product deleted successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getProducts();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Could not delete product.",
        confirmButtonColor: "#28DF99",
      });
    }
  };

  const getStatusStyle = (status) => {
    if (status === "active") {
      return {
        bg: "#dcfce7",
        color: "#168a61",
      };
    }

    return {
      bg: "#fee2e2",
      color: "#dc2626",
    };
  };

  const getCategoryName = (categoryId, productCategoryName) => {
    if (productCategoryName) {
      return productCategoryName;
    }

    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId)
    );

    return category ? category.name : "No category";
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
              width: 170,
              height: 170,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.26)",
              top: -55,
              right: -45,
            }}
          />

          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
              gap: 3,
              minWidth: 0,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-[#16a66d] font-bold text-sm mb-4">
                <Inventory2Icon fontSize="small" />
                Manage Products
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
                  overflowWrap: "anywhere",
                }}
              >
                Product Management
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
                  overflowWrap: "anywhere",
                }}
              >
                Add products, upload multiple images, update stock, price, and
                product status.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "16px",
                px: 3,
                py: 1.3,
                boxShadow: "none",
                backgroundColor: "white",
                color: "primary.main",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "#f7fbff",
                },
              }}
            >
              Add Product
            </Button>
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
              xl: "row",
            },
            alignItems: {
              xs: "stretch",
              xl: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900}>Product List</Typography>

            <Typography
              color="text.secondary"
              fontSize={14}
              sx={{
                mt: 0.5,
                lineHeight: 1.6,
              }}
            >
              Filter products by status and category.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: {
                xs: "stretch",
                md: "center",
              },
              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
              width: {
                xs: "100%",
                xl: "auto",
              },
              minWidth: 0,
            }}
          >
            <Chip
              label={`${products.length} Products`}
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
                  md: 170,
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
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                width: {
                  xs: "100%",
                  md: 230,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  fontWeight: 800,
                  backgroundColor: "white",
                },
              }}
            >
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>

                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Product Cards - FLEX RESPONSIVE */}
        {products.length === 0 ? (
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
              <Inventory2Icon sx={{ fontSize: 64, color: "primary.main" }} />

              <Typography fontWeight={900} fontSize={24} sx={{ mt: 1.5 }}>
                No products found
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Products will appear here after you add them.
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
              minWidth: 0,
            }}
          >
            {products.map((product) => {
              const statusStyle = getStatusStyle(product.status);
              const imageUrl = getProductImage(product);
              const categoryName = getCategoryName(
                product.category_id,
                product.category_name
              );

              return (
                <Box
                  key={product.id}
                  sx={{
                    width: {
                      xs: "100%",
                      "2xl": "calc(50% - 10px)",
                    },
                    flexGrow: 1,
                    p: {
                      xs: 2,
                      sm: 2.5,
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
                      boxShadow: "0 18px 35px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "22px",
                        border: "1px solid #d1fae5",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                        p: 1.2,
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: {
                            xs: 220,
                            sm: 260,
                            md: 280,
                          },
                          borderRadius: "18px",
                          overflow: "hidden",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {imageUrl ? (
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={product.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              objectPosition: "center",
                              display: "block",
                            }}
                          />
                        ) : (
                          <ImageIcon
                            sx={{
                              fontSize: 70,
                              color: "primary.main",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Top Info */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        alignItems: {
                          xs: "flex-start",
                          sm: "flex-start",
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
                          fontSize={21}
                          sx={{
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            fontSize: "14px",
                            lineHeight: 1.7,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {product.description || "No description available."}
                        </Typography>
                      </Box>

                      <Chip
                        label={product.status}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 900,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    {/* Details */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "1 1 160px",
                          },
                          p: 1.5,
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          minWidth: 0,
                        }}
                      >
                        <Box className="flex items-center gap-2">
                          <CategoryIcon
                            sx={{ fontSize: 18, color: "#64748b" }}
                          />
                          <Typography
                            color="text.secondary"
                            fontSize={12}
                            fontWeight={800}
                          >
                            Category
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
                          {categoryName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "1 1 120px",
                          },
                          p: 1.5,
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Box className="flex items-center gap-2">
                          <PaidIcon sx={{ fontSize: 18, color: "#64748b" }} />
                          <Typography
                            color="text.secondary"
                            fontSize={12}
                            fontWeight={800}
                          >
                            Price
                          </Typography>
                        </Box>

                        <Typography
                          color="primary"
                          fontWeight={900}
                          fontSize={14}
                          sx={{ mt: 0.5 }}
                        >
                          Rs. {product.price}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "1 1 120px",
                          },
                          p: 1.5,
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Box className="flex items-center gap-2">
                          <InventoryIcon
                            sx={{ fontSize: 18, color: "#64748b" }}
                          />
                          <Typography
                            color="text.secondary"
                            fontSize={12}
                            fontWeight={800}
                          >
                            Stock
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight={900}
                          fontSize={14}
                          sx={{ mt: 0.5 }}
                        >
                          {product.stock_quantity}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Status + Actions */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "20px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                          alignItems: {
                            xs: "stretch",
                            sm: "center",
                          },
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={900} fontSize={14}>
                            Change Status
                          </Typography>

                          <Typography
                            color="text.secondary"
                            fontSize={13}
                            sx={{ lineHeight: 1.6 }}
                          >
                            Customers can only see active products.
                          </Typography>
                        </Box>

                        <FormControl
                          size="small"
                          sx={{
                            width: {
                              xs: "100%",
                              sm: 150,
                            },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              fontWeight: 800,
                              backgroundColor: "#f7fbff",
                            },
                          }}
                        >
                          <Select
                            value={product.status}
                            onChange={(e) =>
                              updateProductStatus(product.id, e.target.value)
                            }
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box
                        sx={{
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
                          startIcon={<EditIcon />}
                          onClick={() => openEditDialog(product)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: "14px",
                            borderColor: "primary.main",
                            color: "primary.main",
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteProduct(product.id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: "14px",
                            borderColor: "#ef4444",
                            color: "#ef4444",
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeDialog}
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
          {editingProduct ? "Edit Product" : "Add New Product"}

          <IconButton onClick={closeDialog} disabled={saving}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            {editingProduct
              ? "Update product details. Choose new images only if you want to replace or add images."
              : "Create a new product with category, price, stock and images."}
          </Typography>

          <FormControl
            fullWidth
            error={!!errors.category_id}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.65)",
              },
            }}
          >
            <Select
              value={formData.category_id}
              displayEmpty
              onChange={(e) =>
                handleInputChange("category_id", e.target.value)
              }
            >
              <MenuItem value="">Select Category</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            {errors.category_id && (
              <Typography
                sx={{
                  color: "#dc2626",
                  fontWeight: 600,
                  fontSize: "12px",
                  mt: 0.5,
                  ml: 1,
                }}
              >
                {errors.category_id}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Stock Quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) =>
              handleInputChange("stock_quantity", e.target.value)
            }
            error={!!errors.stock_quantity}
            helperText={errors.stock_quantity}
            sx={inputStyle}
          />

          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "16px",
              py: 1.4,
              borderColor: "primary.main",
              color: "primary.main",
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          >
            {formData.images.length > 0
              ? `${formData.images.length} Image(s) Selected`
              : "Choose Product Images"}

            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleInputChange("images", Array.from(e.target.files || []))
              }
            />
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={closeDialog}
            disabled={saving}
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
            onClick={saveProduct}
            disabled={saving}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: "14px",
              px: 3,
              boxShadow: "none",
            }}
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManageProducts;