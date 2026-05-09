// src/pages/public/Products.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import API from "../../services/api";

function Products() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const res = await API.get(`/products/category/${categoryId}`);
      setCategory(res.data.data.category);
      setProducts(res.data.data.products);
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
      <Box className="flex justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {category ? category.name : "Products"}
      </Typography>

      <Typography color="text.secondary" className="mb-8">
        Browse available products in this category.
      </Typography>

      {products.length === 0 ? (
        <Typography>No products found in this category.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => {
            const mainImage =
              product.images && product.images.length > 0
                ? product.images[0].image_url_full
                : null;

            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card className="h-full rounded-3xl overflow-hidden" elevation={0}>
                  {mainImage && (
                    <CardMedia
                      component="img"
                      height="220"
                      image={mainImage}
                      alt={product.name}
                      className="h-56 object-cover"
                    />
                  )}

                  <CardContent>
                    <Box className="flex justify-between items-start gap-3">
                      <Typography variant="h6" fontWeight={700}>
                        {product.name}
                      </Typography>

                      <Chip
                        label={`Stock: ${product.stock_quantity}`}
                        size="small"
                        color={product.stock_quantity > 0 ? "success" : "error"}
                      />
                    </Box>

                    <Typography color="text.secondary" className="mt-2 line-clamp-2">
                      {product.description || "No description available."}
                    </Typography>

                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={800}
                      className="mt-4"
                    >
                      Rs. {product.price}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      sx={{ textTransform: "none", fontWeight: 700, mt: 2 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Products;