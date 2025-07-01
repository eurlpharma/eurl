import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  ArrowLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AppDispatch, RootState } from "@/store";
import { getOrderDetails, cancelOrder } from "@/store/slices/orderSlice";
import { useNotification } from "@/hooks/useNotification";
import { OrderItem } from "@/types/order";
import AIButton from "@/components/buttons/AIButton";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error: showError } = useNotification();

  const { order, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status chip color
  const getStatusColor = (status?: string) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Get current step in order process
  const getCurrentStep = (status?: string) => {
    if (!status) return 0;
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!id || !window.confirm(t("orders.cancelConfirmation"))) return;

    try {
      setCancelling(true);
      await dispatch(cancelOrder(id)).unwrap();
      success(t("orders.cancelSuccess"));
    } catch (err) {
      showError(t("orders.cancelError"));
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !order) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <AIButton
          // component={RouterLink}
          // to="/orders"
          startContent={<ArrowLeftIcon className="w-5 h-5" />}
        >
          {t("orders.backToOrders")}
        </AIButton>
      </Container>
    );
  }

  const orderItems = order.orderItems || [];
  const shippingAddress = order.shippingAddress || {};
  const deliveryType = shippingAddress.deliveryType || 'office';
  const currentStep = getCurrentStep(order.status);

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-josefin">
          {t("orders.orderDetails")}
        </Typography>
        <AIButton
          // component={RouterLink}
          // to="/orders"
          startContent={<ArrowLeftIcon className="w-5 h-5" />}
          variant="outlined"
        >
          {t("orders.backToOrders")}
        </AIButton>
      </Box>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} lg={8}>
          <Paper className="p-6 mb-4">
            <Box className="flex flex-wrap justify-between items-center mb-4">
              <Box>
                <Typography variant="h6">
                  {t("orders.orderId")}:{" "}
                  {order._id
                    ? `#${order._id.substring(order._id.length - 8)}`
                    : "-"}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {t("orders.placedOn")}: {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {t('checkout.deliveryType')}: {deliveryType === 'home' ? t('checkout.deliveryHome') : t('checkout.deliveryOffice')}
                </Typography>
              </Box>

              <Box className="mt-2 sm:mt-0">
                <Tooltip title="Update Order Status">
                  <div onClick={() => console.log("update status")}>

                  <Chip
                    label={
                      order.status
                        ? t(`orders.status.${order.status.toLowerCase()}`)
                        : t("orders.status.unknown")
                    }
                    color={getStatusColor(order.status) as any}
                  />
                  </div>

                </Tooltip>
              </Box>
            </Box>

            {currentStep !== -1 ? (
              <Box className="my-6">
                <Stepper activeStep={currentStep} alternativeLabel>
                  <Step>
                    <StepLabel>{t("orders.steps.pending")}</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>{t("orders.steps.processing")}</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>{t("orders.steps.shipped")}</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>{t("orders.steps.delivered")}</StepLabel>
                  </Step>
                </Stepper>
              </Box>
            ) : (
              <Box className="flex items-center text-red-500 my-6">
                <XCircleIcon className="w-6 h-6 mr-2" />
                <Typography>{t("orders.cancelled")}</Typography>
              </Box>
            )}

            <Divider className="my-4" />

            <Box className="mb-6">
              <Typography variant="h6" className="mb-3">
                {t("orders.orderItems")}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("orders.product")}</TableCell>
                      <TableCell align="right">{t("orders.price")}</TableCell>
                      <TableCell align="right">
                        {t("orders.quantity")}
                      </TableCell>
                      <TableCell align="right">{t("orders.total")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item: OrderItem) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box className="flex items-center">
                            <Card className="w-16 h-16 mr-3 flex-shrink-0 overflow-hidden">
                              <CardMedia
                                component="img"
                                image={
                                  item.image ||
                                  "/images/product-placeholder.svg"
                                }
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </Card>
                            <Box>
                              <Typography className="font-medium">
                                {item.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {item.price.toFixed(2)} DA
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toFixed(2)} DA
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box className="flex justify-between items-center">
              {order.status === "Pending" && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  startIcon={cancelling && <CircularProgress size={20} />}
                >
                  {cancelling
                    ? t("common.processing")
                    : t("orders.cancelOrder")}
                </Button>
              )}

              {order.status === "Shipped" && order.trackingNumber && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<TruckIcon className="w-5 h-5" />}
                  component="a"
                  href={`https://track.delivery/${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("orders.trackOrder")}
                </Button>
              )}
            </Box>
          </Paper>

          {/* Shipping Information */}
          <Paper className="p-6">
            <Typography variant="h6" className="mb-3">
              {t("orders.shippingInformation")}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="font-medium">
                  {t("orders.shippingAddress")}
                </Typography>
                <Typography variant="body2">{shippingAddress.name}</Typography>
                <Typography variant="body2">
                  {shippingAddress.address}
                </Typography>
                <Typography variant="body2">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </Typography>
                <Typography variant="body2">
                  {shippingAddress.country}
                </Typography>
                <Typography variant="body2" className="mt-2">
                  {t("orders.phone")}: {shippingAddress.phone}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="font-medium">
                  {t("orders.deliveryMethod")}
                </Typography>
                <Typography variant="body2">
                  {order.shippingMethod || t("orders.standardDelivery")}
                </Typography>

                {order.trackingNumber && (
                  <>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mt-3"
                    >
                      {t("orders.trackingNumber")}
                    </Typography>
                    <Typography variant="body2">
                      {order.trackingNumber}
                    </Typography>
                  </>
                )}

                {order.estimatedDelivery && (
                  <>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mt-3"
                    >
                      {t("orders.estimatedDelivery")}
                    </Typography>
                    <Box className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1 text-gray-600" />
                      <Typography variant="body2">
                        {formatDate(order.estimatedDelivery)}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              {t("orders.orderSummary")}
            </Typography>

            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body1">{t("orders.subtotal")}</Typography>
                <Typography variant="body1">
                  {order.itemsPrice?.toFixed(2) || "0.00"} DA
                </Typography>
              </Box>

              <Box className="flex justify-between">
                <Typography variant="body1">{t("orders.shipping")}</Typography>
                <Typography variant="body1">
                  {order.shippingPrice?.toFixed(2) || "0.00"} DA
                </Typography>
              </Box>

              <Box className="flex justify-between">
                <Typography variant="body1">{t("orders.tax")}</Typography>
                <Typography variant="body1">
                  {order.taxPrice?.toFixed(2) || "0.00"} DA
                </Typography>
              </Box>

              {order.discount > 0 && (
                <Box className="flex justify-between text-green-600">
                  <Typography variant="body1">
                    {t("orders.discount")}
                  </Typography>
                  <Typography variant="body1">
                    -{order.discount.toFixed(2)} DA
                  </Typography>
                </Box>
              )}

              <Divider />

              <Box className="flex justify-between font-bold">
                <Typography variant="body1">{t("orders.total")}</Typography>
                <Typography variant="body1">
                  {order.totalPrice?.toFixed(2) || "0.00"} DA
                </Typography>
              </Box>
            </Box>

            <Divider className="my-4" />

            <Box>
              <Typography variant="subtitle2" className="font-medium">
                {t("orders.paymentMethod")}
              </Typography>
              <Typography variant="body2" className="mb-3">
                {order.paymentMethod}
              </Typography>

              <Typography variant="subtitle2" className="font-medium">
                {t("orders.paymentStatus")}
              </Typography>
              <Box className="flex items-center">
                {order.isPaid ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                    <Typography variant="body2" className="text-green-600">
                      {t("orders.paid")} ({formatDate(order.paidAt)})
                    </Typography>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-4 h-4 mr-1 text-red-500" />
                    <Typography variant="body2" className="text-red-500">
                      {t("orders.notPaid")}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {order.status === "Delivered" && (
              <>
                <Divider className="my-4" />
                <Box>
                  <Typography variant="subtitle2" className="font-medium">
                    {t("orders.deliveredOn")}
                  </Typography>
                  <Box className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                    <Typography variant="body2" className="text-green-600">
                      {formatDate(order.deliveredAt)}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>


      
    </Container>
  );
};

export default OrderDetailPage;
