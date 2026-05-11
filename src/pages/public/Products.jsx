// src/pages/public/Products.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Chip,
  IconButton,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import API from "../../services/api";

/* Product image slider */
function ProductImageSlider({ images = [], productName }) {
  const sortedImages = [...images].sort((a, b) => {
    return Number(b.is_main) - Number(a.is_main);
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const imageCount = sortedImages.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [imageCount]);

  useEffect(() => {
    if (imageCount <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === imageCount - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [imageCount]);

  const goPrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? imageCount - 1 : prevIndex - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === imageCount - 1 ? 0 : prevIndex + 1
    );
  };

  if (imageCount === 0) {
    return (
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
        <Inventory2Icon sx={{ fontSize: 70 }} />
      </Box>
    );
  }

  const activeImage = sortedImages[activeIndex];

  return (
    <Box
      sx={{
        position: "relative",
        height: {
          xs: 230,
          sm: 240,
          md: 250,
        },
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Box
        component="img"
        src={activeImage.image_url_full}
        alt={productName}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {imageCount > 1 && (
        <>
          <IconButton
            onClick={goPrevious}
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.85)",
              width: 34,
              height: 34,
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <IconButton
            onClick={goNext}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.85)",
              width: 34,
              height: 34,
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.8,
            }}
          >
            {sortedImages.map((image, index) => (
              <Box
                key={image.id || index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: activeIndex === index ? 18 : 8,
                  height: 8,
                  borderRadius: "999px",
                  cursor: "pointer",
                  backgroundColor:
                    activeIndex === index
                      ? "primary.main"
                      : "rgba(255,255,255,0.9)",
                  transition: "0.3s",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

function Products() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserRole = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return "customer";
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role || "customer";
    } catch (error) {
      return "customer";
    }
  };

  const isAdmin = getUserRole() === "admin";

  const getProducts = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const categoryRes = await API.get(`/categories/admin/${categoryId}`);
        const productsRes = await API.get(
          `/products/admin/all?category_id=${categoryId}`
        );

        setCategory(categoryRes.data.data.category);
        setProducts(productsRes.data.data.products);
      } else {
        const res = await API.get(`/products/category/${categoryId}`);

        setCategory(res.data.data.category);
        setProducts(res.data.data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [categoryId]);

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
            <Inventory2Icon fontSize="small" />
            Products
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
            {category ? category.name : "Products"}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: "540px",
              mx: "auto",
              fontSize: {
                xs: "14px",
                sm: "16px",
              },
              lineHeight: 1.7,
            }}
          >
            Browse available products in this category.
          </Typography>
        </Box>

        {products.length === 0 ? (
          <Box className="text-center py-16">
            <Typography fontWeight={800} fontSize={22}>
              No products found
            </Typography>

            <Typography color="text.secondary" className="mt-2">
              Products will appear here after admin adds them.
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
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
                {/* Image Slider */}
                <Box className="p-3 pb-0">
                  <ProductImageSlider
                    images={product.images}
                    productName={product.name}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box className="flex justify-between items-start gap-3 mb-2">
                    <Typography
                      fontWeight={900}
                      sx={{
                        fontSize: {
                          xs: "21px",
                          md: "23px",
                        },
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Chip
                      label={`Stock: ${product.stock_quantity}`}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        backgroundColor:
                          Number(product.stock_quantity) > 0
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          Number(product.stock_quantity) > 0
                            ? "#168a61"
                            : "#dc2626",
                      }}
                    />
                  </Box>

                  {/* Admin only status */}
                  {isAdmin && (
                    <Chip
                      label={product.status}
                      size="small"
                      sx={{
                        mb: 2,
                        textTransform: "capitalize",
                        fontWeight: 800,
                        backgroundColor:
                          product.status === "active"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          product.status === "active" ? "#168a61" : "#dc2626",
                      }}
                    />
                  )}

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
                    {product.description || "No description available."}
                  </Typography>

                  <Typography
                    color="primary"
                    fontWeight={900}
                    sx={{
                      fontSize: "22px",
                      mb: 2,
                    }}
                  >
                    Rs. {product.price}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: "16px",
                      py: 1.2,
                      boxShadow: "none",
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Products;