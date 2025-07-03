import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Divider,
  IconButton,
  TextField,
  Link,
  Card,
  CardMedia,
} from "@mui/material";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { AppDispatch, RootState } from "@/store";
import {
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/store/slices/cartSlice";
import Breadcrumb from "@/components/global/Breadcrumb";

import EmptyCartDraw from "../assets/undraw/empty_cart.svg"

import clsx from "clsx";
import AIButton from "@/components/buttons/AIButton";

const CartPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const cartItems = cart?.items || [];
  const { loading } = cart;

  const [discount] = useState(0);

  const API_BASE_URL = "/api";

  const formatImageUrl = (imagePath: string, productId?: string) => {
    if (!imagePath) return "/images/product-placeholder.svg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    if (imagePath.includes("/")) {
      return `${API_BASE_URL}${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    if (productId) {
      return `${API_BASE_URL}/uploads/products/${productId}/${imagePath}`;
    }

    return `${API_BASE_URL}/images/products/${imagePath}`;
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    dispatch(updateCartQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const subtotal =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0
        )
      : 0;
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discountAmount + shipping;

  if (!loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="bg-girl-white">
        <Breadcrumb pageName="Shopping Cart" />
        <Container maxWidth="lg" className="py-4 md:py-6 lg:px-10">
          <Box className="text-center py-12 space-y-8">
            <img src={EmptyCartDraw} className="w-full lg:w-[50%] mx-auto" />

            <Typography variant="h5" className="mb-4 font-paris text-3xl font-semibold text-girl-secondary">
              {t("cart.emptyCart")}
            </Typography>


            <AIButton
              variant="outlined"
              radius="full"
              className="mx-auto font-josefin"
              startContent={<ArrowLeftIcon className="w-5 h-5" />}
              onClick={() => navigate("/products")}
            >{t("cart.continueShopping")}</AIButton>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-girl-white">
      <Breadcrumb pageName="Shopping Cart" />

      <Container maxWidth="lg" className="py-8">
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper className="p-4 rounded-none shadow-sm">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-josefin ">
                  {t("cart.items")} ({cartItems.length})
                </Typography>
                {cartItems.length > 0 && (
                  <Button
                    variant="text"
                    color="error"
                    className="rounded-none"
                    onClick={handleClearCart}
                    startIcon={<TrashIcon className="w-4 h-4" />}
                  >
                    {t("cart.clearCart")}
                  </Button>
                )}
              </Box>

              <Divider className="mb-4" />

              {loading ? (
                <Box className="text-center py-8">
                  <Typography>{t("common.loading")}</Typography>
                </Box>
              ) : (
                <Box>
                  {cartItems &&
                    cartItems.length > 0 &&
                    cartItems.map((item: any) => (
                      <Box
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200"
                      >
                        <Card className="w-full sm:w-24 h-24 mr-4 flex-shrink-0 overflow-hidden">
                          <CardMedia
                            component="img"
                            image={formatImageUrl(item.image, item.product)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Card>

                        <Box className="flex-grow mt-2 sm:mt-0">
                          <Link
                            component={RouterLink}
                            to={`/products/${item.product}`}
                            className="font-medium hover:text-girl-secondary"
                            underline="hover"
                          >
                            {item.name}
                          </Link>

                          {item.variant && (
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {item.variant}
                            </Typography>
                          )}
                        </Box>

                        <Box className="flex items-center mt-2 sm:mt-0 mr-4">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </IconButton>

                          <TextField
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            inputProps={{
                              min: 1,
                              style: { textAlign: "center", width: "40px" },
                            }}
                            variant="standard"
                            className="mx-2"
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.countInStock}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </IconButton>
                        </Box>

                        <Box className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                          <Typography
                            variant="body1"
                            className="font-medium mr-4"
                          >
                            DA {(item.price * item.quantity).toFixed(2)}
                          </Typography>

                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                </Box>
              )}

              <Box className="mt-6">
                <RouterLink
                  to="/products"
                  className={clsx(
                    "text-girl-secondary flex items-center gap-2",
                    "border-1 border-solid border-girl-secondary",
                    "w-fit px-3 py-2 hover:bg-girl-secondary hover:text-girl-white"
                  )}
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <p>{t("cart.continueShopping")}</p>
                </RouterLink>
              </Box>
            </Paper>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Paper className="p-4 rounded-none shadow-sm">
              <Typography variant="h6" className="mb-4">
                {t("cart.orderSummary")}
              </Typography>

              <Box className="space-y-3">
                <Box className="flex justify-between">
                  <Typography variant="body1">{t("cart.subtotal")}</Typography>
                  <Typography variant="body1">
                    DA {subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box className="flex justify-between">
                  <Typography variant="body1">{t("cart.shipping")}</Typography>
                  <Typography variant="body1">
                    {shipping === 0
                      ? t("cart.free")
                      : `DA ${shipping.toFixed(2)}`}
                  </Typography>
                </Box>

                <Divider />

                <Box className="flex justify-between font-bold">
                  <Typography variant="body1">{t("cart.total")}</Typography>
                  <Typography variant="body1">DA {total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={clsx(
                    "text-girl-secondary flex items-center gap-2 justify-center",
                    "border-1 border-solid border-girl-secondary items-center",
                    "w-full px-3 py-2 bg-girl-secondary text-girl-white",
                    "hover:bg-girl-primary"
                  )}
                >
                  <p>{t("cart.proceedToCheckout")}</p>
                </button>

                <Box className="mt-4 text-center">
                  <Typography variant="body2" className="text-gray-600">
                    {t("cart.secureCheckout")}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Shipping Policy */}
            <Paper className="p-4 mt-4 rounded-none shadow-sm">
              <Typography variant="subtitle2" className="mb-2">
                {t("cart.shippingPolicy")}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {t("cart.freeShippingMessage")}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default CartPage;
