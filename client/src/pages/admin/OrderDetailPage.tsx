import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import avatarPerson from "../../assets/avatars/avatar-girl.png";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  Avatar,
} from "@mui/material";
import {
  ArrowLeftIcon,
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
import Preloader from "@/components/global/Preloader";
import moment from "moment";
import UIButton from "@/components/design/UIButton";
import { IconPrintBold } from "@/components/Iconify";
import { ChevronLeft, PlusIcon } from "lucide-react";
import UIChip from "@/components/design/UIChip";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

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
        return "grey";
    }
  };

  /* const getCurrentStep = (status?: string) => {
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
  }; */

  const getWilayaNameById = (wilayaId: string) => {
    const wilaya = willayatData.find((w: any) => w.wilaya_id === wilayaId);
    if (!wilaya) return wilayaId;
    if (i18n.language.startsWith("ar")) return wilaya.ar_name;
    return wilaya.name;
  };

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
        <Preloader />
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

  // const currentStep = getCurrentStep(order.status);
  // const shippingAddress = order.shippingAddress || {};
  // const deliveryType = shippingAddress.deliveryType || "office";

  return (
    <Container maxWidth="lg" className="p-4">
      <Box className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2">
          <IconButton onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </IconButton>
          <div>
            <Typography className="font-public-sans text-tiny text-[#919EAB]">
              {moment(order.createdAt).format("DD MMM YYYY HH:mm")}
            </Typography>
            <Typography className="font-public-sans md:text-lg font-medium">
              {t("Order")}{" "}
              <span className="uppercase">
                #{order.id?.toString().slice(0, 6)}
              </span>
            </Typography>
          </div>
        </div>
        <Box className="flex gap-2">
          <UIButton
            size="sm"
            variant="soft"
            startIcon={<IconPrintBold />}
            onClick={handlePrintInvoice}
          >
            {t("Print")}
          </UIButton>

          <IconButton onClick={handleOpenMenu}>
            <EllipsisVerticalIcon className="w-5 h-5" />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} lg={8}>
          <Paper
            className="p-6 mb-4"
            classes={{ root: "shadow-lighter rounded-xl" }}
          >
            <Box className="flex flex-wrap justify-between items-center mb-4">
              <Box>
                <Typography variant="h6" className="font-public-sans">
                  {t("Details")}
                </Typography>
                {/* <Typography variant="body2" className="text-gray-600">
                  {t("checkout.deliveryType")}:{" "}
                  {deliveryType === "home"
                    ? t("checkout.deliveryHome")
                    : t("checkout.deliveryOffice")}
                </Typography> */}
              </Box>

              <div className="mt-2 sm:mt-0">
                <UIChip
                  radius="lg"
                  variant="soft"
                  color={getStatusColor(order.status)}
                  onClick={() => {
                    setNewStatus(order.status);
                    setStatusDialogOpen(true);
                  }}
                >
                  {t(`orders.status.${order.status}`)}
                </UIChip>
              </div>
            </Box>

            {/* {currentStep !== -1 ? (
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
            )} */}

            <Box className="mb-6">
              <TableContainer style={{ maxHeight: "50vh" }}>
                <SimpleBar>
                  <Table
                    className="border-separate overflow-auto"
                    sx={{
                      "& .MuiTableCell-root": {
                        borderBottom: "1px dashed #0000001f",
                      },
                    }}
                  >
                    <TableBody>
                      {order.orderItems.map((item, idx) => (
                        <TableRow key={item._id || idx}>
                          <TableCell>
                            <Box className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover"
                                />
                              )}
                              <Typography className="font-public-sans capitalize">
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            align="right"
                            className="font-barlow font-medium whitespace-nowrap min-w-fit px-3"
                          >
                            {formatPrice(item.price)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="font-barlow font-medium whitespace-nowrap min-w-fit px-3"
                          >
                            x{item.quantity}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="font-barlow font-semibold whitespace-nowrap min-w-fit px-3"
                          >
                            {formatPrice(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </SimpleBar>
              </TableContainer>
            </Box>

            <div className="flex w-full justify-end">
              <Box className="space-y-5 w-[70%] md:w-[60%] lg:w-[50%] py-2 self-end">
                <Box className="flex justify-between">
                  <Typography className="font-public-sans text-[#637381] text-sm">
                    {t("orders.subtotal")}
                  </Typography>
                  <Typography className="font-barlow font-semibold">
                    {formatPrice(order.itemsPrice)}
                  </Typography>
                </Box>

                <Box className="flex justify-between">
                  <Typography className="font-public-sans text-[#637381] text-sm">
                    {t("orders.shipping")}
                  </Typography>
                  <Typography className="font-barlow font-semibold">
                    {formatPrice(order.shippingPrice)}
                  </Typography>
                </Box>

                {order.discount > 0 && (
                  <Box className="flex justify-between text-green-600">
                    <Typography variant="body1">
                      {t("orders.discount")}
                    </Typography>
                    <Typography className="font-barlow text-[#637381] text-sm">
                      -{formatPrice(order.discount)}
                    </Typography>
                  </Box>
                )}

                <Box className="flex justify-between font-bold">
                  <Typography className="font-public-sans text-[#637381] text-sm">
                    {t("orders.total")}
                  </Typography>
                  <Typography className="font-barlow font-semibold">
                    {formatPrice(order.totalPrice)}
                  </Typography>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>

        {/* Order Info */}
        <Grid item xs={12} lg={4}>
          <Paper
            classes={{ root: "shadow-lighter rounded-xl" }}
          >
            <Box className="p-6 space-y-4">
              <Typography className="font-medium font-public-sans lg:text-lg">
                {t("orders.customerInfo")}
              </Typography>
              <Box className="space-y-1">
                <div className="flex items-start gap-3">
                  <Avatar src={avatarPerson} />
                  <div className="info space-y-3">
                    <div className="space-y-1">
                      <Typography variant="body2" className="font-medium">
                        {order.guestInfo?.name ||
                          (isUserData(order.user) ? order.user.name : "-")}
                      </Typography>
                      <Typography variant="body2" className="text-[#637381]">
                        {order.guestInfo?.phone ||
                          (isUserData(order.user) ? order.user.phone : "-")}
                      </Typography>

                      <Typography variant="body2">
                        {t("IP address")}:{" "}
                        <span className="text-[#637381]">192.168.1.5</span>
                      </Typography>
                    </div>

                    <UIButton
                      startIcon={<PlusIcon />}
                      color="error"
                      size="sm"
                      variant="link"
                    >
                      Add to blacklist
                    </UIButton>
                  </div>
                </div>
              </Box>
            </Box>

            <Divider />

            <Box className="p-6 space-y-4">
              <Typography className="font-medium font-public-sans lg:text-lg">
                {t("Delivery")}
              </Typography>
              <Box className="space-y-1">
                <div className="space-y-2 font-public-sans">
                  <div className="flex items-center">
                    <div className="w-[40%] text-[#637381] text-sm capitalize">
                      Ship By
                    </div>
                    <div className="capitalize text-sm">Yalidine</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[40%] text-[#637381] text-sm capitalize">
                      Speedy
                    </div>
                    <div className="capitalize text-sm">standard</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[40%] text-[#637381] text-sm capitalize">
                      Tracking NO
                    </div>
                    <div className="capitalize text-sm underline">
                      SPX037739199373
                    </div>
                  </div>
                </div>
              </Box>
            </Box>

            <Divider />

            <Box className="p-6 space-y-4">
              <Typography className="font-medium font-public-sans lg:text-lg">
                {t("Shipping")}
              </Typography>
              <Box className="space-y-2 font-public-sans">
                <div className="flex items-center gap-3">
                  <div className="capitalize w-[30%] text-sm text-[#637381]">
                    country
                  </div>
                  <div className="text-sm line-clamp-1">
                    {order.shippingAddress.country}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="capitalize w-[30%] text-sm text-[#637381]">
                    city
                  </div>
                  <div className="text-sm line-clamp-1">
                    {getWilayaNameById(order.shippingAddress.city)},{" "}
                    {order.shippingAddress.dairaName ||
                      getDairaNameByPostCode(order.shippingAddress.postalCode)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="capitalize w-[30%] text-sm text-[#637381]">
                    address
                  </div>
                  <div className="text-sm line-clamp-1">
                    {order.shippingAddress.address}
                  </div>
                </div>
              </Box>
            </Box>

            <Divider />

            <Box className="p-6 space-y-4">
              <Typography className="font-medium font-public-sans lg:text-lg">
                {t("orders.paymentStatus")}
              </Typography>
              <Box className="space-y-3">
                <div className="flex items-center justify-between gap-3 w-full">
                  <UIChip
                    radius="full"
                    variant="link"
                    color={order.isPaid ? "success" : "error"}
                    className="gap-2"
                    startContent={
                      order.isPaid ? (
                        <CheckCircleIcon className="w-4 h-4" />
                      ) : (
                        <XCircleIcon className="w-4 h-4" />
                      )
                    }
                  >
                    {order.isPaid ? t("orders.paid") : t("orders.notPaid")}
                  </UIChip>

                  <UIButton
                    variant="soft"
                    radius="full"
                    className="ml-3 text-tiny py-[2px] px-1.5"
                    color={order.isPaid ? "error" : "success"}
                    onClick={async () => {
                      const orderId = order.id ?? order._id;
                      if (!orderId) return;
                      setLoading(true);
                      const originalStatus = order.status;
                      try {
                        if (order.isPaid) {
                          await updateOrderToUnpaid(orderId);
                        } else {
                          await updateOrderToPaid(orderId, {});
                        }
                        const updatedOrder = await getOrderById(orderId);
                        const normalizedOrder = {
                          ...updatedOrder,
                          orderItems: Array.isArray(updatedOrder.orderItems)
                            ? updatedOrder.orderItems.map((item: any) => ({
                                ...item,
                                quantity: item.quantity ?? item.qty,
                              }))
                            : [],
                          status:
                            updatedOrder.status === "processing" &&
                            originalStatus !== "processing"
                              ? originalStatus
                              : updatedOrder.status,
                        };
                        setOrder(normalizedOrder);
                        success(
                          order.isPaid
                            ? t("orders.markedAsUnpaid")
                            : t("orders.markedAsPaid")
                        );
                      } catch (err) {
                        showError(t("orders.updateStatusError"));
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {order.isPaid
                      ? t("orders.markAsUnpaid")
                      : t("orders.markAsPaid")}
                  </UIButton>
                </div>

                {order.isPaid && (
                  <UIChip
                    color="success"
                    variant="link"
                    className="gap-2"
                    startContent={<CheckCircleIcon className="w-4 h-4" />}
                  >
                    {t("orders.paid")} ({formatDate(order.paidAt)})
                  </UIChip>
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
