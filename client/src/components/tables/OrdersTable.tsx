import { useState, useEffect, HTMLAttributes, FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
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
  CardHeader,
  Skeleton,
} from "@mui/material";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Order, OrderStatus, OrdersResponse } from "@/types/order";
import { getAllOrders, deleteOrder } from "@/api/orders";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch } from "react-redux";
import { updateDashboardAfterOrderChange } from "@/store/slices/adminSlice";
import { updateOrderStatus as storeUpdateOrderStatus } from "@/store/slices/orderSlice";
import { showNotification } from "@/store/slices/uiSlice";
import { UpdateOrderStatusData } from "@/types/order";
import { AppDispatch } from "@/store";
import UIChip from "../design/UIChip";
import { IconFilter, IconPrintBold, IconTrashBold } from "../Iconify";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import UIButton from "../design/UIButton";
import unDrawError from "../../assets/undraw/bug_fix.svg";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";

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
      return "grey";
  }
};

const cells = [
  { key: "orders.id" },
  { key: "orders.customerInfo" },
  { key: "orders.phone" },
  { key: "orders.orderDate" },
  { key: "orders.totalAmount" },
  { key: "orders.paidStatus" },
  { key: "orders.titleStatus" },
  { key: "orders.products" },
  { key: "common.actions" },
];

interface OrdersTableProps extends HTMLAttributes<HTMLElement> {
  header?: string;
  subHeader?: string;
  isFilter?: boolean;
  isPagination?: boolean;
  isViewAll?: "all" | "add" | null;
}

const OrdersTable: FC<OrdersTableProps> = ({
  isViewAll,
  header,
  subHeader,
  isFilter,
  isPagination,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [_, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState<boolean>(false);
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

  if (error) {
    return (
      <Box className="flex justify-center items-center flex-col gap-4">
        <img
          src={unDrawError}
          alt="Error Orders Page"
          className="w-full lg:w-[50%]"
        />
        <div className="capitalize font-paris text-2xl lg:text-3xl font-semibold text-girl-secondary">
          {t("common.errorOccurred")}
        </div>
      </Box>
    );
  }

  return (
    <div className="shadow-lighter mx-4 my-8 rounded-xl">
      <CardHeader
        className="font-public-sans"
        title={header && t(header)}
        subheader={subHeader && t(`admin.${subHeader}`)}
        classes={{
          title: "font-public-sans text-medium lg:text-lg xl:text-xl",
        }}
        action={
          <div className="flex items-center gap-3">
            <UIButton
              startIcon={<IconFilter className="w-4 h-4" />}
              onClick={() => setOpenFilter(!openFilter)}
              className="capitalize text-sm"
              variant="link"
            >
              filter
            </UIButton>

            {isViewAll && (
              <UIButton
                color="grey"
                variant="soft"
                component={Link}
                startIcon={
                  isViewAll === "add" && <PlusIcon className="w-4 h-4" />
                }
                to={isViewAll === "all" ? "/admin/orders" : "/admin/orders"}
                className="text-sm"
              >
                {t(isViewAll === "all" ? "common.viewAll" : "Order")}
              </UIButton>
            )}
          </div>
        }
      />

      {isFilter && (
        <Paper
          className={clsx(
            "overflow-hidden transition-all duration-300",
            openFilter
              ? "p-4 mb-4 h-fit opacity-100"
              : "p-0 m-0 h-0 overflow-hidden opacity-0"
          )}
          classes={{ root: "shadow-none" }}
        >
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
                    setPaymentFilter(
                      e.target.value as "all" | "paid" | "unpaid"
                    )
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
              <UIButton
                radius="lg"
                variant="soft"
                onClick={handleFilter}
                className="py-3.5 w-full"
                startIcon={<FunnelIcon className="w-5 h-5" />}
              >
                {t("common.filter")}
              </UIButton>
            </Grid>
          </Grid>
        </Paper>
      )}

      <TableContainer component={Paper} className="shadow-none">
        <SimpleBar style={{ maxHeight: "70vh" }}>
          <Table
            className="border-separate"
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px dashed #0000001f",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {cells.map(({ key }) => (
                  <TableCell key={key} className="capitalize font-public-sans">
                    {t(key)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading
                ? Array.from(Array(6)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" component="h2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" component="h2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Box className="flex justify-end items-center gap-2">
                          <Skeleton variant="circular" className="w-6 h-6" />
                          <Skeleton variant="circular" className="w-6 h-6" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                : orders.map((order, idx) => (
                    <TableRow
                      key={order._id || order.id || idx}
                      className="font-public-sans hover:bg-[#cdcdcd0d] transition duration-700"
                    >
                      <TableCell className="font-public-sans">
                        {order.id ? (
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-primary-600 hover:underline"
                          >
                            #{shortenOrderId(order._id || order.id || "")}
                          </Link>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <Box>
                          <Typography className="whitespace-nowrap font-public-sans">
                            {order.guestInfo?.name ||
                              (typeof order.user === "object" &&
                              order.user?.name
                                ? order.user.name
                                : "-")}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <Typography className="whitespace-nowrap font-barlow">
                          {order.guestInfo?.phone ||
                            (typeof order.user === "object" && order.user?.phone
                              ? order.user.phone
                              : "-")}
                        </Typography>
                      </TableCell>
                      <TableCell className="font-poppins">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography className="whitespace-nowrap flex items-center gap-1 font-barlow font-medium">
                          {order.totalPrice.toFixed(2)}{" "}
                          {t("ammount.da").toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <UIChip
                          size="sm"
                          radius="full"
                          variant="soft"
                          className="capitalize px-2"
                          color={order.isPaid ? "success" : "error"}
                        >
                          {order.isPaid ? t("orders.paid") : t("orders.unpaid")}
                        </UIChip>
                      </TableCell>
                      <TableCell>
                        <UIChip
                          size="sm"
                          radius="full"
                          variant="soft"
                          className="capitalize px-2"
                          color={getStatusColor(order.status)}
                          onClick={(e) =>
                            handleOpenMenu(e, order._id || order.id || "")
                          }
                        >
                          {t(`orders.status.${order.status?.toLowerCase?.()}`)}
                        </UIChip>
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
                                    className="min-w-[10rem] max-w-[14rem] line-clamp-1"
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
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <IconButton
                            onClick={() =>
                              handlePrintInvoice(order._id || order.id || "")
                            }
                            color="secondary"
                            title={t("orders.printInvoice")}
                          >
                            <IconPrintBold />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteClick(order._id || order.id || "")
                            }
                            color="error"
                            title={t("common.delete")}
                          >
                            <IconTrashBold />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>

      {isPagination && (
        <Box className="flex justify-center py-4">
          <Pagination
            count={pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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
    </div>
  );
};

export default OrdersTable;
