// src/pages/public/Categories.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";

import { jwtDecode } from "jwt-decode";
import API from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const getUserRole = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return "customer";
    }

    try {
      const decoded = jwtDecode(token);
      return decoded.role || "customer";
    } catch (error) {
      return "customer";
    }
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  const getCategories = async () => {
    try {
      setLoading(true);

      let url = "/categories";

      if (isAdmin) {
        url =
          statusFilter === "all"
            ? "/categories/admin/all"
            : `/categories/admin/all?status=${statusFilter}`;
      }

      const res = await API.get(url);
      setCategories(res.data.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [statusFilter]);

  if (loading) {
    return (
      <Box className="min-h-[60vh] flex justify-center items-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #f7fbff 0%, #ecfdf5 55%, #f7fbff 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" className="py-10 md:py-14">
        {/* Header */}
        <Box className="text-center mb-10">
          <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-4">
            <CategoryIcon fontSize="small" />
            Browse Categories
          </Box>

          <Typography
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "34px",
                sm: "44px",
                md: "52px",
              },
              lineHeight: 1.1,
            }}
          >
            Shop by Category
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: "520px",
              mx: "auto",
              fontSize: {
                xs: "14px",
                sm: "16px",
              },
              lineHeight: 1.7,
            }}
          >
            Select a category and explore available products easily.
          </Typography>

          {/* Admin only status filter */}
          {isAdmin && (
            <Box className="mt-6 flex justify-center">
              <FormControl
                size="small"
                sx={{
                  minWidth: 180,
                  backgroundColor: "white",
                  borderRadius: "14px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    fontWeight: 700,
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
          )}
        </Box>

        {/* Category Cards - Flex only */}
        <Box className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              elevation={0}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  lg: "calc(33.333% - 16px)",
                },
                borderRadius: "30px",
                overflow: "hidden",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
                transition: "0.3s",
                "&:hover": {
                  transform: {
                    xs: "none",
                    md: "translateY(-8px)",
                  },
                  boxShadow: {
                    xs: "0 14px 35px rgba(0,0,0,0.06)",
                    md: "0 22px 45px rgba(0,0,0,0.12)",
                  },
                },
              }}
            >
              {/* Image */}
              <Box className="p-3 pb-0">
                {category.image_url ? (
                  <CardMedia
                    component="img"
                    image={category.image_url}
                    alt={category.name}
                    sx={{
                      width: "100%",
                      height: {
                        xs: 230,
                        sm: 240,
                        md: 250,
                      },
                      objectFit: "cover",
                      borderRadius: "24px",
                      display: "block",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: {
                        xs: 230,
                        sm: 240,
                        md: 250,
                      },
                      borderRadius: "24px",
                      backgroundColor: "#e6fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 70 }} />
                  </Box>
                )}
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Box className="flex items-center justify-between gap-3 mb-1">
                  <Typography
                    fontWeight={900}
                    sx={{
                      fontSize: {
                        xs: "21px",
                        md: "23px",
                      },
                    }}
                  >
                    {category.name}
                  </Typography>

                  {/* Admin only status badge */}
                  {isAdmin && (
                    <Chip
                      label={category.status}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 800,
                        backgroundColor:
                          category.status === "active"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          category.status === "active"
                            ? "#168a61"
                            : "#dc2626",
                      }}
                    />
                  )}
                </Box>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    minHeight: {
                      xs: "auto",
                      md: "48px",
                    },
                    mb: 2.5,
                  }}
                >
                  {category.description || "View products in this category."}
                </Typography>

                <Button
                  component={Link}
                  to={`/products/category/${category.id}`}
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 900,
                    borderRadius: "16px",
                    py: 1.2,
                    boxShadow: "none",
                  }}
                >
                  View Products
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {categories.length === 0 && (
          <Box className="text-center py-16">
            <Typography fontWeight={800} fontSize={22}>
              No categories found
            </Typography>

            <Typography color="text.secondary" className="mt-2">
              Categories will appear here after admin adds them.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Categories;