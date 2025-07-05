import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Chip,
  Skeleton,
  IconButton,
} from "@mui/material";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Product } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { AppDispatch } from "@/store";
import { useNotification } from "@/hooks/useNotification";

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

const ProductCard = ({ product, loading = false }: ProductCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useNotification();
  const SERVER_URL = `http://192.168.1.11:5000`;
  const formatImageUrl = (imagePath: string, productId?: string) => {
    if (!imagePath) return "/images/product-placeholder.svg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${SERVER_URL}${imagePath}`;
    }

    if (productId) {
      if (!imagePath.includes("/")) {
        const productNumber =
          (Math.abs(parseInt(productId.replace(/[^0-9]/g, "") || "0")) % 5) + 1;
        return `${SERVER_URL}/uploads/products/medical_device_${productNumber}/${imagePath}`;
      }

      if (imagePath.includes("medical_device_")) {
        if (imagePath.startsWith("uploads/")) {
          return `${SERVER_URL}/${imagePath}`;
        }
        return `${SERVER_URL}/uploads/products/${imagePath}`;
      }
    }

    if (imagePath.includes("/")) {
      return `${SERVER_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
    }

    const randomDevice = Math.floor(Math.random() * 5) + 1;
    return `${SERVER_URL}/uploads/products/medical_device_${randomDevice}/image1.jpg`;
  };

  if (loading) {
    return (
      <Card className="h-full shadow-card hover:shadow-card-hover transition-shadow">
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="text" height={20} width="40%" />
          <Skeleton variant="text" height={24} width="60%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" height={36} width="100%" />
        </CardActions>
      </Card>
    );
  }

  const handleAddToCart = async () => {
    try {
      const result = await dispatch(
        addToCart({ productId: product.id, quantity: 1 })
      );
      if (addToCart.fulfilled.match(result)) {
        success(t("products.addedToCart"));
      } else {
        if (result.payload === "Not enough stock available") {
          error(t("products.notEnoughStock"));
        } else if (result.payload === "Invalid product data received from server") {
          error(t("products.invalidProduct"));
        } else {
          error(typeof result.payload === 'string' ? result.payload : t("common.errorOccurred"));
        }
      }
    } catch (err) {
      error(t("common.errorOccurred"));
    }
  };

  return (
    <Card sx={{backgroundColor: 'transparent'}} className="h-full product-card bg-transparent flex flex-col shadow-card hover:shadow-card-hover transition-shadow ">
      <Box sx={{backgroundColor: 'transparent'}} className="relative bg-transparent">
        <CardMedia
          component="img"
          height="200"
          image={formatImageUrl(
            product.images && product.images.length > 0
              ? product.images[0]
              : product.image || "",
            product.id
          )}
          alt={product.name}
          className=" h-36 lg:h-48 object-cover"
        />

        {product.isFeatured && (
          <Chip
            label={t("products.featured")}
            color="secondary"
            size="small"
            className="absolute top-1 left-1 rounded-sm"
          />
        )}
      </Box>

      <CardContent className="flex-grow pb-1">
        <div
          onClick={() => navigate(`/products/${product.id}`)}
          className="font-normal hover:text-primary-600 transition-colors no-underline text-inherit md:text-left lg:text-xl line-clamp-1"
        >
          {product.name}
        </div>

        <div className="price-cart flex items-center justify-between">
          <div className="text-sm md:text-medium">
            DA {product.price.toFixed(2)}
          </div>

          <IconButton
            color="primary"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
