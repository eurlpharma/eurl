import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  EyeIcon,
  PrinterIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Order, OrderStatus, OrdersResponse } from "@/types/order";
import { getAllOrders, deleteOrder } from "@/api/orders";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch } from "react-redux";
import { updateDashboardAfterOrderChange } from "@/store/slices/adminSlice";
import { updateOrderStatus as storeUpdateOrderStatus } from "@/store/slices/orderSlice";
import { showNotification } from "@/store/slices/uiSlice";
import { UpdateOrderStatusData } from "@/types/order";
import { AppDispatch } from "@/store";
import AIButton from "@/components/buttons/AIButton";

const shortenOrderId = (id: string) => {
  return id.slice(-6).toUpperCase();
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
      return "default";
  }
};

const OrdersPage = () => {
  const { t } = useTranslation();
  const { success, error: showError } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [_, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 800);
    setSearchTimeout(timeout);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: OrdersResponse = await getAllOrders({
        search,
        page,
        limit: 10,
        status: statusFilter || undefined,
        isPaid: paymentFilter === "all" ? undefined : paymentFilter === "paid",
      });
      setOrders(data.orders);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || t("orders.loadError")
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [page, statusFilter, paymentFilter]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    orderId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const statusData: UpdateOrderStatusData = { status: newStatus };
      await dispatch(storeUpdateOrderStatus({ id: orderId, statusData }));

      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus, isPaid: newStatus === "delivered" }
          : order
      );
      dispatch({ type: "orders/setOrders", payload: updatedOrders });

      setOrders(updatedOrders);

      const order = orders.find((order) => order._id === orderId);
      if (order) {
        dispatch(
          updateDashboardAfterOrderChange({
            isPaid: newStatus === "delivered",
            totalPrice: order.totalPrice,
            isNewOrder: false,
          })
        );
      }

      dispatch(
        showNotification({
          message: t("orders.statusUpdated"),
          type: "success",
        })
      );
      handleCloseMenu();
      fetchOrders();
    } catch (error: any) {
      dispatch(
        showNotification({
          message: error.message || t("common.errorOccurred"),
          type: "error",
        })
      );
    }
  };

  const handlePrintInvoice = async (orderId: string) => {
    try {
      window.open(`/admin/orders/${orderId}/print`, "_blank");
    } catch (err: any) {
      showError(err.message || t("orders.printError"));
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete);
      success(t("orders.deleteSuccess"));
      fetchOrders();
    } catch (err: any) {
      showError(err.message || t("orders.deleteError"));
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography>{t("common.loading")}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h1">
          {t("orders.title")}
        </Typography>
        <AIButton
          variant="solid"
          radius="full"
          // to="/admin/orders/new"
        >
          {t("orders.createNew")}
        </AIButton>
      </Box>

      <Paper className="p-4 mb-4">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("orders.searchPlaceholder")}
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t("orders.filterByStatus")}</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "")
                }
                label={t("orders.filterByStatus")}
              >
                <MenuItem value="">{t("common.all")}</MenuItem>
                {[
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`orders.status.${status}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>
                {t("orders.filterByPayment") || "Payment Status"}
              </InputLabel>
              <Select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")
                }
                label={t("orders.filterByPayment") || "Payment Status"}
              >
                <MenuItem value="all">{t("common.all")}</MenuItem>
                <MenuItem value="paid">{t("orders.paid") || "Paid"}</MenuItem>
                <MenuItem value="unpaid">
                  {t("orders.unpaid") || "Unpaid"}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <AIButton
              fullWidth
              variant="outlined"
              className="py-3.5"
              radius="lg"
              startContent={<FunnelIcon className="w-5 h-5" />}
              onClick={handleFilter}
            >
              {t("common.filter")}
            </AIButton>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("orders.id")}</TableCell>
              <TableCell>{t("orders.customerInfo")}</TableCell>
              <TableCell>{t("orders.phone")}</TableCell>
              <TableCell>{t("orders.orderDate")}</TableCell>
              <TableCell>{t("orders.totalAmount")}</TableCell>
              <TableCell>{t("orders.paidStatus") || "Paid"}</TableCell>
              <TableCell>{t("orders.titleStatus")}</TableCell>
              <TableCell>{t("orders.products") || "Products"}</TableCell>
              <TableCell align="right">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, idx) => (
              <TableRow key={order._id || order.id || idx}>
                <TableCell>
                  {order._id || order.id ? (
                    <Link
                      to={`/admin/orders/${order._id || order.id}`}
                      className="text-primary-600 hover:underline"
                    >
                      #{shortenOrderId(order._id || order.id || "")}
                    </Link>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" className="font-medium whitespace-nowrap">
                      {order.guestInfo?.name ||
                        (typeof order.user === "object" && order.user?.name
                          ? order.user.name
                          : "-")}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="whitespace-nowrap">
                    {order.guestInfo?.phone ||
                      (typeof order.user === "object" && order.user?.phone
                        ? order.user.phone
                        : "-")}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Typography className="whitespace-nowrap flex items-center gap-1">
                    {order.totalPrice.toFixed(2)} {t("ammount.da").toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Chip
                      label={t("orders.paid") || "Paid"}
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label={t("orders.unpaid") || "Unpaid"}
                      color="error"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`orders.status.${order.status?.toLowerCase?.()}`)}
                    color={getStatusColor(order.status)}
                    size="small"
                    variant="outlined"
                    className="flex items-center w-fit"
                    classes={{ label: "uppercase text-[10px]" }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Box display="flex" alignItems="center">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems
                          .slice(0, 1)
                          .map((item: any, idx: number) => (
                            <img
                              className="min-w-8 min-h-8 w-8 h-8"
                              alt={item.name}
                              key={item._id || item.productId || idx}
                              src={
                                item.image ||
                                (item.product && item.product.image) ||
                                "/images/product-placeholder.svg"
                              }
                              style={{
                                width: 32,
                                height: 32,
                                objectFit: "cover",
                                marginRight: 4,
                                borderRadius: 4,
                              }}
                            />
                          ))
                      ) : (
                        <span>-</span>
                      )}
                    </Box>

                    <Box>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems
                          .slice(0, 2)
                          .map((item: any, idx: number) => (
                            <Typography
                              key={item._id || item.productId || idx}
                              variant="caption"
                              display="block"
                              className="whitespace-nowrap"
                            >
                              {item.name}
                            </Typography>
                          ))
                      ) : (
                        <span>Unknown</span>
                      )}
                    </Box>
                  </div>

                  <Box>
                    {order.orderItems && order.orderItems.length > 2 && (
                      <Typography variant="caption" color="textSecondary">
                        +{order.orderItems.length - 1} more
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <div className="flex items-center">
                    <IconButton
                      component={order._id || order.id ? Link : "button"}
                      to={
                        order._id || order.id
                          ? `/admin/orders/${order._id || order.id}`
                          : undefined
                      }
                      color="primary"
                      title={t("common.view")}
                      disabled={!order._id && !order.id}
                    >
                      <EyeIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handlePrintInvoice(order._id || order.id || "")
                      }
                      color="secondary"
                      title={t("orders.printInvoice")}
                    >
                      <PrinterIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteClick(order._id || order.id || "")
                      }
                      color="error"
                      title={t("common.delete")}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      onClick={(e) =>
                        handleOpenMenu(e, order._id || order.id || "")
                      }
                      title={t("common.actions")}
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex justify-center mt-4">
        <Pagination
          count={pages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t("orders.deleteConfirmTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t("orders.deleteConfirmMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "processing")
          }
        >
          {t("orders.status.processing")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "shipped")
          }
        >
          {t("orders.status.shipped")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "delivered")
          }
        >
          {t("orders.status.delivered")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "cancelled")
          }
        >
          {t("orders.status.cancelled")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OrdersPage;
