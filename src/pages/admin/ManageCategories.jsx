// src/pages/admin/ManageCategories.jsx
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

import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

import Swal from "sweetalert2";
import API from "../../services/api";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);

      const url =
        statusFilter === "all"
          ? "/categories/admin/all"
          : `/categories/admin/all?status=${statusFilter}`;

      const res = await API.get(url);
      setCategories(res.data.data.categories || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Categories Load Failed",
        text: error.response?.data?.message || "Could not load categories.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const openAddDialog = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      image: null,
    });

    setErrors({
      name: "",
    });

    setOpenDialog(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: null,
    });

    setErrors({
      name: "",
    });

    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      image: null,
    });

    setErrors({
      name: "",
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

  const validateCategory = () => {
    const nextErrors = {
      name: "",
    };

    if (!formData.name.trim()) {
      nextErrors.name = "Category name is required";
    }

    setErrors(nextErrors);

    return !nextErrors.name;
  };

  const saveCategory = async () => {
    const isValid = validateCategory();

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("category_image", formData.image);
      }

      if (editingCategory) {
        await API.put(`/categories/${editingCategory.id}`, data);
      } else {
        await API.post("/categories", data);
      }

      Swal.fire({
        icon: "success",
        title: editingCategory ? "Category Updated" : "Category Created",
        text: editingCategory
          ? "Category updated successfully."
          : "New category created successfully.",
        confirmButtonColor: "#28DF99",
      });

      closeDialog();
      await getCategories();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.response?.data?.message || "Could not save category.",
        confirmButtonColor: "#28DF99",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryStatus = async (categoryId, status) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Change Category Status?",
      text: `Are you sure you want to change this category to ${status}?`,
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
      await API.put(`/categories/${categoryId}/status`, {
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Category status updated successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getCategories();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text:
          error.response?.data?.message || "Could not update category status.",
        confirmButtonColor: "#28DF99",
      });
    }
  };

  const deleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Category?",
      text: "This will permanently delete this category and related products.",
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
      await API.delete(`/categories/${categoryId}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Category deleted successfully.",
        confirmButtonColor: "#28DF99",
      });

      await getCategories();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Could not delete category.",
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
                <CategoryIcon fontSize="small" />
                Manage Categories
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
                Category Management
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
                Add new categories, update category details, change active
                status, or delete categories.
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
              Add Category
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
            <Typography fontWeight={900}>Category List</Typography>

            <Typography color="text.secondary" fontSize={14}>
              Filter categories by status.
            </Typography>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Chip
              label={`${categories.length} Categories`}
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
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Cards */}
        {categories.length === 0 ? (
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
              <CategoryIcon sx={{ fontSize: 64, color: "primary.main" }} />

              <Typography fontWeight={900} fontSize={24} className="mt-3">
                No categories found
              </Typography>

              <Typography color="text.secondary" className="mt-2">
                Categories will appear here after you add them.
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
            {categories.map((category) => {
              const statusStyle = getStatusStyle(category.status);

              return (
                <Box
                  key={category.id}
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
                  {/* Image */}
                  <Box
                    sx={{
                      width: "100%",
                      height: {
                        xs: 190,
                        sm: 210,
                      },
                      borderRadius: "22px",
                      overflow: "hidden",
                      backgroundColor: "#e6fdf4",
                      mb: 3,
                    }}
                  >
                    {category.image_url ? (
                      <Box
                        component="img"
                        src={category.image_url}
                        alt={category.name}
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
                          sx={{
                            fontSize: 70,
                            color: "primary.main",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Category top info */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 1.5,
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    <Chip
                      label={category.status}
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 900,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        alignSelf: "flex-start",
                      }}
                    />

                    <Box sx={{ minWidth: 0, width: "100%" }}>
                      <Typography
                        fontWeight={900}
                        fontSize={22}
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        {category.name}
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
                        {category.description || "No description available."}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status and actions */}
                  <Box
                    sx={{
                      mt: 2.5,
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
                            wordBreak: "break-word",
                          }}
                        >
                          Customers can only see active categories.
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
                          value={category.status}
                          onChange={(e) =>
                            updateCategoryStatus(category.id, e.target.value)
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
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => openEditDialog(category)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 900,
                          borderRadius: "14px",
                          borderColor: "primary.main",
                          color: "primary.main",
                          minWidth: 0,
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteCategory(category.id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 900,
                          borderRadius: "14px",
                          borderColor: "#ef4444",
                          color: "#ef4444",
                          minWidth: 0,
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
          {editingCategory ? "Edit Category" : "Add New Category"}

          <IconButton onClick={closeDialog} disabled={saving}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {editingCategory
              ? "Update category details. Choose a new image only if you want to replace the old image."
              : "Create a new product category with name, description, and image."}
          </Typography>

          <TextField
            fullWidth
            label="Category Name"
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
            {formData.image ? formData.image.name : "Choose Category Image"}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleInputChange("image", e.target.files[0] || null)
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
            onClick={saveCategory}
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
              : editingCategory
              ? "Update Category"
              : "Create Category"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManageCategories;