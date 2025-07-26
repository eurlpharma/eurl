import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import unDrawError from "../../assets/undraw/bug_fix.svg";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  LinearProgress,
} from "@mui/material";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardStats } from "@/store/slices/adminSlice";
import { Order, OrderStatus } from "../../types/order";
import AIButton from "@/components/buttons/AIButton";
import BarCharts from "@/components/charts/BarCharts";
import { BarChartPaper } from "@/components/charts/PaperCharts/BarChartSetting";
import {
  IconBoxBold,
  IconCartBold,
  IconDollarBold,
  IconUsersBold,
} from "@/components/Iconify";
import TableProducts from "@/components/tables/TableProducts";
import UIButton from "@/components/design/UIButton";
import UIChip from "@/components/design/UIChip";

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
    };
  }
}

const bgColors: Record<string, string> = {
  info: "#18181b",
  warning: "#f5a524",
  success: "#17c964",
  danger: "#f31260",
  secondary: "#9353d3",
  primary: "#006FEE",
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
];

const shortenOrderId = (id: string) => {
  return id.slice(-6).toUpperCase();
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const { dashboardStats, recentOrders, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const defaultDashboardStats = {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    percentageChange: {
      sales: 0,
      orders: 0,
      products: 0,
      users: 0,
    },
    recentProducts: [],
    recentOrders: [],
  };

  const stats = dashboardStats || defaultDashboardStats;

  const statsData = [
    {
      title: t("admin.totalSales"),
      value: stats.totalRevenue || 0,
      change: stats.percentageChange?.sales || 0,
      icon: <IconDollarBold />,
      color: "primary",
    },
    {
      title: t("admin.totalOrders"),
      value: stats.totalOrders || 0,
      change: stats.percentageChange?.orders || 0,
      icon: <IconCartBold />,
      color: "info",
    },
    {
      title: t("admin.totalProducts"),
      value: stats.totalProducts || 0,
      change: 0,
      icon: <IconBoxBold />,
      color: "success",
    },
    {
      title: t("admin.totalUsers"),
      value: stats.totalUsers || 0,
      change: 0,
      icon: <IconUsersBold />,
      color: "warning",
    },
  ];

  if (loading) {
    return (
      <Container className="flex items-center justify-center h-[80vh]">
        <Box sx={{ width: "30%" }}>
          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 2,
              backgroundColor: "#fde6e1",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#ff0066",
              },
            }}
          />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center h-full p-6">
        <img src={unDrawError} className="h-[80%]" />
        <Typography
          variant="h6"
          className="mb-4 font-paris text-xl lg:text-2xl font-bold capitalize text-girl-secondary"
        >
          {t("common.errorOccurred")}
        </Typography>
        <AIButton
          variant="solid"
          radius="full"
          onClick={() => {
            dispatch(getDashboardStats());
          }}
        >
          {t("common.refreshPage")}
        </AIButton>
      </Box>
    );
  }

  return (
    <Box className="py-6 px-3 md:px-4 lg:px-6 font-public-sans space-y-3">
      <Typography className="font-semibold font-public-sans text-lg px-1 md:text-xl lg:text-2xl">
        {t("admin.app")}
      </Typography>

      <Grid container spacing={2}>
        {statsData.map((stat, index) => {
          const colorClass = bgColors[stat.color] || "bg-gray-400";
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper className="p-4 h-full shadow-lighter rounded-xl flex items-center justify-between gap-3">
                <div>
                  <Box className="flex items-center mb-2 gap-2">
                    <Box
                      style={{ color: colorClass }}
                      className={`${bgColors[stat.color]}  text-girl-white`}
                    >
                      {stat.icon}
                    </Box>
                    <Typography className="font-public-sans lg:font-semibold lg:text-lg">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography
                    component="p"
                    className="mb-1 font-semibold font-barlow text-xl md:text-2xl lg:text-3xl"
                  >
                    {stat.title === t("admin.totalSales")
                      ? `${stat.value.toLocaleString()} ${t("ammount.da")}`
                      : stat.value.toString().padStart(3, "0")}
                  </Typography>
                  {stat.change !== undefined && (
                    <Box className="flex items-center">
                      {stat.change >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <Typography
                        variant="caption"
                        color={stat.change >= 0 ? "success" : "error"}
                      >
                        {Math.abs(stat.change)}% {t("admin.vsPreviousPeriod")}
                      </Typography>
                    </Box>
                  )}
                </div>

                <BarCharts {...BarChartPaper} colors={[colorClass]} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Recent Products */}
          <TableProducts
            isViewAll={"all"}
            header="recentProducts"
            isRecent={4}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card classes={{ root: "shadow-lighter p-0 rounded-xl" }}>
            <CardHeader
              title={t("admin.recentOrders")}
              className="font-public-sans"
              classes={{
                title: "font-public-sans text-medium lg:text-lg xl:text-xl",
              }}
              action={
                <UIButton
                  component={Link}
                  to="/admin/orders"
                  color="grey"
                  variant="link"
                  size="sm"
                >
                  {t("common.viewAll")}
                </UIButton>
              }
            />
            <CardContent className="p-0">
              <TableContainer component={Paper} className="shadow-none">
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
                        <TableCell
                          key={key}
                          className="capitalize font-public-sans"
                        >
                          {t(key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order: Order, idx: number) => (
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
                            onClick={() =>
                              navigate(`/admin/orders/${order.id}`)
                            }
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
                            onClick={() =>
                              navigate(`/admin/orders/${order.id}`)
                            }
                          >
                            <Typography className="whitespace-nowrap font-barlow">
                              {order.shippingAddress.phone}
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
                              {order.isPaid
                                ? t("orders.paid")
                                : t("orders.unpaid")}
                            </UIChip>
                          </TableCell>
                          <TableCell>
                            <UIChip
                              size="sm"
                              radius="full"
                              variant="soft"
                              className="capitalize px-2"
                              color={getStatusColor(order.status)}
                            >
                              {t(
                                `orders.status.${order.status?.toLowerCase?.()}`
                              )}
                            </UIChip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Box display="flex" alignItems="center">
                                {order.orderItems &&
                                  order.orderItems.length > 0 &&
                                  order.orderItems
                                    .slice(0, 1)
                                    .map((item: any, idx: number) => (
                                      <img
                                        className="min-w-8 min-h-8 w-8 h-8"
                                        alt={item.name}
                                        key={idx}
                                        src={item.product.images[0]}
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: 4,
                                        }}
                                      />
                                    ))}
                              </Box>

                              <Box>
                                {order.orderItems &&
                                order.orderItems.length > 0 ? (
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
                              {order.orderItems &&
                                order.orderItems.length > 2 && (
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                  >
                                    +{order.orderItems.length - 1} more
                                  </Typography>
                                )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {t("orders.noOrdersFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
