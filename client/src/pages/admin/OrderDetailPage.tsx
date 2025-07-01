import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  ArrowLeftIcon,
  PrinterIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useNotification } from "@/hooks/useNotification";
import {
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToUnpaid,
} from "@/api/orders";
import { Order as OrderBase, OrderStatus } from "@/types/order";
import type { UserData } from "@/types/user";
import { formatDate, formatPrice } from "@/utils/formatters";
import AIButton from "@/components/buttons/AIButton";
import willayatData from "@/data/willayat.json";
import i18n from "@/i18n";
import clsx from "clsx";

type Order = OrderBase & { id?: string };

const isUserData = (user: any): user is UserData => {
  return user && typeof user === "object" && "name" in user;
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getOrderById(id);
        // تطبيع orderItems ليحتوي كل عنصر على quantity
        const normalizedOrder = {
          ...data,
          orderItems: Array.isArray(data.orderItems)
            ? data.orderItems.map((item: any) => ({
                ...item,
                quantity: item.quantity ?? item.qty,
              }))
            : [],
        };
        setOrder(normalizedOrder);
      } catch (err: any) {
        setError(err.message || t("orders.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, t]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!id || !order) return;

    try {
      await updateOrderStatus(id, { status: newStatus });
      const updatedOrder = await getOrderById(id);
      const normalizedOrder = {
        ...updatedOrder,
        orderItems: Array.isArray(updatedOrder.orderItems)
          ? updatedOrder.orderItems.map((item: any) => ({
              ...item,
              quantity: item.quantity ?? item.qty,
            }))
          : [],
      };
      setOrder(normalizedOrder);
      success(t("admin.orderStatusUpdated"));
      handleCloseMenu();
    } catch (err: any) {
      showError(err.message || t("orders.updateStatusError"));
    }
  };

  const handlePrintInvoice = () => {
    if (!id) return;
    window.open(`/admin/orders/${id}/print`, "_blank");
  };

  const handleBack = () => {
    navigate("/admin/orders");
  };

  // Get status chip color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
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

  // Helper to get wilaya name by id
  const getWilayaNameById = (wilayaId: string) => {
    const wilaya = willayatData.find((w: any) => w.wilaya_id === wilayaId);
    if (!wilaya) return wilayaId;
    if (i18n.language.startsWith("ar")) return wilaya.ar_name;
    return wilaya.name;
  };

  // Helper to get daira name by post code
  const getDairaNameByPostCode = (postCode: string) => {
    const daira = willayatData.find((d: any) => d.post_code === postCode);
    if (!daira) return postCode;
    if (i18n.language.startsWith("ar")) return daira.ar_name;
    return daira.name;
  };

  if (
    !order ||
    !order.orderItems ||
    !Array.isArray(order.orderItems) ||
    order.orderItems.length === 0 ||
    !order.shippingAddress ||
    !order.status ||
    (!order.guestInfo && !order.user)
  ) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error" className="mb-4">
          {t("orders.incompleteOrderData") ||
            "بيانات الطلب غير مكتملة أو الطلب قديم ولا يحتوي على جميع الحقول المطلوبة."}
        </Alert>
        <AIButton
          variant="solid"
          startContent={<ArrowLeftIcon className="w-5 h-5" />}
          onClick={handleBack}
        >
          {t("orders.backToOrders")}
        </AIButton>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error" className="mb-4">
          {error || t("orders.notFound")}
        </Alert>
        <AIButton
          variant="solid"
          startContent={<ArrowLeftIcon className="w-5 h-5" />}
          onClick={handleBack}
        >
          {t("orders.backToOrders")}
        </AIButton>
      </Container>
    );
  }

  const currentStep = getCurrentStep(order.status);
  const shippingAddress = order.shippingAddress || {};
  const deliveryType = shippingAddress.deliveryType || "office";

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-josefin">
          {t("orders.orderDetails")}
        </Typography>
        <Box className="flex gap-2">
          <AIButton
            variant="outlined"
            startContent={<PrinterIcon className="w-5 h-5" />}
            onClick={handlePrintInvoice}
          >
            {t("orders.printInvoice")}
          </AIButton>
          <AIButton
            variant="outlined"
            startContent={<ArrowLeftIcon className="w-5 h-5" />}
            onClick={handleBack}
          >
            {t("orders.backToOrders")}
          </AIButton>
          <IconButton onClick={handleOpenMenu}>
            <EllipsisVerticalIcon className="w-5 h-5" />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} lg={8}>
          <Paper className="p-6 mb-4">
            <Box className="flex flex-wrap justify-between items-center mb-4">
              <Box>
                <Typography variant="h6" className="font-josefin">
                  {t("orders.orderId")}: #
                  {order._id && order._id.length >= 8
                    ? order._id.substring(order._id.length - 8)
                    : order._id || "-"}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {t("orders.placedOn")}: {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {t("checkout.deliveryType")}:{" "}
                  {deliveryType === "home"
                    ? t("checkout.deliveryHome")
                    : t("checkout.deliveryOffice")}
                </Typography>
              </Box>

              <div className="mt-2 sm:mt-0">
                <Tooltip title="Update Order Status">
                  <Chip
                    label={t(`orders.status.${order.status}`)}
                    color={getStatusColor(order.status)}
                    onClick={() => {
                      setNewStatus(order.status);
                      setStatusDialogOpen(true);
                    }}
                  />
                </Tooltip>
              </div>
            </Box>

            {currentStep !== -1 ? (
              <div>
                <Box className="my-6">
                  <Stepper activeStep={currentStep} alternativeLabel>
                    {["pending", "processing", "shipped", "delivered"].map(
                      (step) => (
                        <Step key={step}>
                          <StepLabel
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setNewStatus(step as OrderStatus);
                              setStatusDialogOpen(true);
                            }}
                          >
                            {t(`orders.steps.${step}`)}
                          </StepLabel>
                        </Step>
                      )
                    )}
                  </Stepper>
                </Box>
              </div>
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
                    {order.orderItems.map((item, idx) => (
                      <TableRow key={item._id || idx}>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <Typography>{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Order Info */}
        <Grid item xs={12} lg={4}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              {t("orders.orderSummary")}
            </Typography>

            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body1">{t("orders.subtotal")}</Typography>
                <Typography variant="body1">
                  {formatPrice(order.itemsPrice)}
                </Typography>
              </Box>

              <Box className="flex justify-between">
                <Typography variant="body1">{t("orders.shipping")}</Typography>
                <Typography variant="body1">
                  {formatPrice(order.shippingPrice)}
                </Typography>
              </Box>

              {order.discount > 0 && (
                <Box className="flex justify-between text-green-600">
                  <Typography variant="body1">
                    {t("orders.discount")}
                  </Typography>
                  <Typography variant="body1">
                    -{formatPrice(order.discount)}
                  </Typography>
                </Box>
              )}

              <Divider />

              <Box className="flex justify-between font-bold">
                <Typography variant="body1">{t("orders.total")}</Typography>
                <Typography variant="body1">
                  {formatPrice(order.totalPrice)}
                </Typography>
              </Box>
            </Box>

            <Divider className="my-4" />

            <Box>
              <Typography variant="subtitle2" className="font-medium">
                {t("orders.customerInfo")}
              </Typography>
              <Box className="mt-2 space-y-1">
                <Typography variant="body2">
                  {t("orders.name")}:{" "}
                  {order.guestInfo?.name ||
                    (isUserData(order.user) ? order.user.name : "-")}
                </Typography>
                <Typography variant="body2">
                  {t("orders.phone")}:{" "}
                  {order.guestInfo?.phone ||
                    (isUserData(order.user) ? order.user.phone : "-")}
                </Typography>
              </Box>
            </Box>

            <Divider className="my-4" />

            <Box>
              <Typography variant="subtitle2" className="font-medium">
                {t("orders.shippingAddress")}
              </Typography>
              <Box className="mt-2 space-y-1">
                <Typography variant="body2">
                  {order.shippingAddress.country}
                </Typography>

                <Typography variant="body2">
                  {getWilayaNameById(order.shippingAddress.city)},{" "}
                  {order.shippingAddress.dairaName ||
                    getDairaNameByPostCode(order.shippingAddress.postalCode)}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.address}
                </Typography>
              </Box>
            </Box>

            <Divider className="my-4" />

            <Box>
              <Typography variant="subtitle2" className="font-medium">
                {t("orders.paymentStatus")}
              </Typography>
              <Box className=" mt-2 space-y-3">
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-1">
                    {order.isPaid ? (
                      <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 mr-1 text-red-500" />
                    )}
                    <Typography
                      variant="body2"
                      className={clsx(
                        order.isPaid ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {order.isPaid ? t("orders.paid") : t("orders.notPaid")}
                    </Typography>
                  </div>
                  <AIButton
                    variant="outlined"
                    className="ml-3 text-tiny py-[2px] px-1.5"
                    radius="full"
                    onClick={async () => {
                      const orderId = order.id ?? order._id;
                      if (!orderId) return;
                      setLoading(true);
                      try {
                        if (order.isPaid) {
                          // تراجع عن الدفع
                          await updateOrderToUnpaid(orderId);
                        } else {
                          // تعيين كمدفوع
                          await updateOrderToPaid(orderId, {});
                        }
                        // جلب الطلب بعد التحديث
                        const updatedOrder = await getOrderById(orderId);
                        const normalizedOrder = {
                          ...updatedOrder,
                          orderItems: Array.isArray(updatedOrder.orderItems)
                            ? updatedOrder.orderItems.map((item: any) => ({
                                ...item,
                                quantity: item.quantity ?? item.qty,
                              }))
                            : [],
                        };
                        setOrder(normalizedOrder);
                        success(
                          order.isPaid
                            ? t("orders.markedAsUnpaid") || "تم التراجع عن الدفع"
                            : t("orders.markedAsPaid") || "تم تعيين الطلب كمدفوع"
                        );
                      } catch (err) {
                        showError(
                          t("orders.updateStatusError") ||
                            "حدث خطأ أثناء التحديث"
                        );
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {order.isPaid
                      ? t("orders.markAsUnpaid") || "تراجع عن الدفع"
                      : t("orders.markAsPaid") || "تعيين كمدفوع"}
                  </AIButton>
                </div>

                {order.isPaid && (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                    <Typography variant="body2" className="text-green-600">
                      {t("orders.paid")} ({formatDate(order.paidAt)})
                    </Typography>
                  </div>
                )}
              </Box>
            </Box>

            {order.status === "delivered" && order.deliveredAt && (
              <>
                <Divider className="my-4" />
                <Box>
                  <Typography variant="subtitle2" className="font-medium">
                    {t("orders.deliveredOn")}
                  </Typography>
                  <Box className="flex items-center mt-2">
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        container={document.getElementById("root")}
      >
        <MenuItem onClick={() => handleUpdateStatus("processing")}>
          {t("orders.status.processing")}
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("shipped")}>
          {t("orders.status.shipped")}
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("delivered")}>
          {t("orders.status.delivered")}
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("cancelled")}>
          {t("orders.status.cancelled")}
        </MenuItem>
      </Menu>

      <Dialog
        container={document.getElementById("root")}
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: 0,
            minWidth: 340,
            maxWidth: "95vw",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: 22, textAlign: "center", pb: 0 }}
        >
          {t("orders.changeStatus") || "تغيير حالة الطلب"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2, px: 3 }}>
          <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
            <InputLabel id="order-status-label">
              {t("orders.status.title") || "الحالة"}
            </InputLabel>
            <Select
              labelId="order-status-label"
              value={newStatus}
              label={t("orders.status.title") || "الحالة"}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              sx={{ borderRadius: 2, background: "#f7f7fa" }}
            >
              <MenuItem value="pending">
                {t("orders.steps.pending") || "قيد الانتظار"}
              </MenuItem>
              <MenuItem value="processing">
                {t("orders.steps.processing") || "قيد المعالجة"}
              </MenuItem>
              <MenuItem value="shipped">
                {t("orders.steps.shipped") || "تم الشحن"}
              </MenuItem>
              <MenuItem value="delivered">
                {t("orders.steps.delivered") || "تم التوصيل"}
              </MenuItem>
              <MenuItem value="cancelled">
                {t("orders.steps.cancelled") || "ملغي"}
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "end", pb: 2, px: 3 }}>
          <AIButton
            onClick={() => setStatusDialogOpen(false)}
            variant="outlined"
            color="default"
          >
            {t("common.cancel") || "إلغاء"}
          </AIButton>
          <AIButton
            variant="solid"
            color="primary"
            onClick={async () => {
              await handleUpdateStatus(newStatus);
              setStatusDialogOpen(false);
            }}
            style={{ minWidth: 90, marginLeft: 8 }}
          >
            {t("common.save") || "حفظ"}
          </AIButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetailPage;
