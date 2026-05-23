// src/pages/admin/ManageProducts.jsx
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
  TextField,
  IconButton,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

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

  const getProducts = async () => {
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
  };

  const getCategories = async () => {
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
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts();
  }, [statusFilter, categoryFilter]);

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

    if (formData.stock_quantity !== "" && Number(formData.stock_quantity) < 0) {
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
      data.append(
        "stock_quantity",
        formData.stock_quantity === "" ? 0 : formData.stock_quantity
      );

      formData.images.forEach((image) => {
        data.append("product_images", image);
      });

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

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      handleInputChange("images", []);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    const largeFile = files.find((file) => file.size > maxSize);

    if (largeFile) {
      Swal.fire({
        icon: "error",
        title: "Image Too Large",
        text: "Please select images smaller than 10MB.",
        confirmButtonColor: "#28DF99",
      });

      e.target.value = "";
      handleInputChange("images", []);
      return;
    }

    handleInputChange("images", files);
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

  const activeCategories = categories.filter(
    (category) => category.status === "active"
  );

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
                "&:hover": {
                  backgroundColor: "#f7fbff",
                },
              }}
            >
              Add Product
            </Button>
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
            <Typography fontWeight={900}>Product List</Typography>

            <Typography color="text.secondary" fontSize={14}>
              Filter products by status and category.
            </Typography>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Chip
              label={`${products.length} Products`}
              sx={{
                fontWeight: 900,
                backgroundColor: "#e6fdf4",
                color: "#168a61",
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: 160,
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
                minWidth: 190,
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
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Product cards */}
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

              <Typography fontWeight={900} fontSize={24} className="mt-3">
                No products found
              </Typography>

              <Typography color="text.secondary" className="mt-2">
                Products will appear here after you add them.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="flex flex-wrap gap-5">
            {products.map((product) => {
              const statusStyle = getStatusStyle(product.status);
              const mainImage =
                product.images && product.images.length > 0
                  ? product.images[0].image_url_full
                  : null;

              return (
                <Box
                  key={product.id}
                  sx={{
                    width: {
                      xs: "100%",
                      md: "calc(50% - 10px)",
                    },
                    p: 3,
                    borderRadius: "26px",
                    backgroundColor: "#f7fbff",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
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
                      width: "100%",
                      height: 230,
                      borderRadius: "22px",
                      overflow: "hidden",
                      backgroundColor: "#e6fdf4",
                      mb: 3,
                    }}
                  >
                    {mainImage ? (
                      <Box
                        component="img"
                        src={mainImage}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Box className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          sx={{ fontSize: 70, color: "primary.main" }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontWeight={900}
                        fontSize={22}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {product.name}
                      </Typography>

                      <Typography color="primary" fontWeight={900} mt={1}>
                        Rs. {product.price}
                      </Typography>

                      <Typography color="text.secondary" fontSize={14} mt={0.5}>
                        Category: {product.category_name}
                      </Typography>

                      <Typography color="text.secondary" fontSize={14} mt={0.5}>
                        Stock: {product.stock_quantity}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          fontSize: "14px",
                          lineHeight: 1.7,
                          wordBreak: "break-word",
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

                  <Box
                    className="mt-5 p-4 rounded-[20px] flex flex-col gap-3"
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <Box>
                        <Typography fontWeight={900} fontSize={14}>
                          Change Status
                        </Typography>

                        <Typography color="text.secondary" fontSize={13}>
                          Customers can only see active products.
                        </Typography>
                      </Box>

                      <FormControl
                        size="small"
                        sx={{
                          minWidth: 150,
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

                    <Box className="flex flex-col sm:flex-row gap-3">
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
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Add / Edit Popup */}
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
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {editingProduct
              ? "Update product details. Choose new images only if you want to replace old images."
              : "Create a new product with category, price, stock, and images."}
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
              displayEmpty
              value={formData.category_id}
              onChange={(e) =>
                handleInputChange("category_id", e.target.value)
              }
            >
              <MenuItem value="">Select Category</MenuItem>

              {activeCategories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
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
              ? `${formData.images.length} Images Selected`
              : "Choose Product Images"}

            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={handleImagesChange}
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