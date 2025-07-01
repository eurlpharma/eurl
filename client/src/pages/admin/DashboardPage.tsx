import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Link } from "react-router-dom";
import { getDashboardStats } from "@/store/slices/adminSlice";
import { ProductData } from "../../types/product";
import { Order } from "../../types/order";
import Preloader from "@/components/global/Preloader";

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

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { dashboardStats, recentProducts, recentOrders, loading, error } =
    useSelector((state: RootState) => state.admin);

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
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      color: "primary",
    },
    {
      title: t("admin.totalOrders"),
      value: stats.totalOrders || 0,
      change: stats.percentageChange?.orders || 0,
      icon: <ShoppingCartIcon className="w-8 h-8" />,
      color: "info",
    },
    {
      title: t("admin.totalProducts"),
      value: stats.totalProducts || 0,
      change: 0,
      icon: <ShoppingBagIcon className="w-8 h-8" />,
      color: "success",
    },
    {
      title: t("admin.totalUsers"),
      value: stats.totalUsers || 0,
      change: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
      color: "warning",
    },
  ];

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Preloader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center h-full p-6">
        <Typography variant="h6" color="error" className="mb-4">
          {t("common.errorOccurred")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(getDashboardStats());
          }}
        >
          {t("common.tryAgain")}
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography
        variant="h4"
        component="h1"
        className="mb-6 font-semibold font-josefin"
      >
        {t("admin.dashboard")}
      </Typography>

      <Grid container spacing={3} className="mb-6">
        {statsData.map((stat, index) => {
          const colorClass = bgColors[stat.color] || "bg-gray-400";  

          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper className="p-4 h-full">
                <Box className="flex items-center mb-2">
                  <Box
                    style={{ backgroundColor: colorClass }}
                    className={`p-2 rounded-full ${
                      bgColors[stat.color]
                    } mr-3 text-girl-white`}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="p"
                  className="mb-1 font-bold"
                >
                  {stat.title === t("admin.totalSales")
                    ? `${stat.value.toLocaleString()} دج`
                    : stat.value.toLocaleString()}
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
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={t("admin.recentProducts")}
              action={
                <Button component={Link} to="/admin/products" color="primary">
                  {t("common.viewAll")}
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("admin.productImage")}</TableCell>
                      <TableCell>{t("admin.productName")}</TableCell>
                      <TableCell>{t("admin.category")}</TableCell>
                      <TableCell align="right">{t("admin.price")}</TableCell>
                      <TableCell align="right">{t("admin.stock")}</TableCell>
                      <TableCell align="center">{t("admin.status")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentProducts && recentProducts.length > 0 ? (
                      recentProducts.map((product: ProductData) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Box className="w-12 h-12 relative">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={
                                    product.images[0].startsWith("http")
                                      ? product.images[0]
                                      : `${
                                          import.meta.env.VITE_API_URL
                                        }/uploads/${product.images[0]}`
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Box className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="text-primary-600 hover:underline"
                            >
                              {product.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {typeof product.category === "string"
                              ? product.category
                              : product.category?.name}
                          </TableCell>
                          <TableCell align="right">${product.price}</TableCell>
                          <TableCell align="right">
                            {product.countInStock}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                product.countInStock === 0
                                  ? t("products.outOfStock")
                                  : product.countInStock < 10
                                  ? t("products.lowStock")
                                  : t("products.inStock")
                              }
                              color={
                                product.countInStock === 0
                                  ? "error"
                                  : product.countInStock < 10
                                  ? "warning"
                                  : "success"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {t("products.noProductsFound")}
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

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={t("admin.recentOrders")}
              action={
                <Button component={Link} to="/admin/orders" color="primary">
                  {t("common.viewAll")}
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("admin.orderId")}</TableCell>
                      <TableCell>{t("admin.customer")}</TableCell>
                      <TableCell>{t("admin.date")}</TableCell>
                      <TableCell align="right">{t("admin.total")}</TableCell>
                      <TableCell>{t("admin.products") || "Products"}</TableCell>
                      <TableCell>{t("admin.quantity") || "Quantity"}</TableCell>
                      <TableCell align="center">{t("admin.status")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order: Order, idx: number) => (
                        <TableRow key={order.id ?? order._id ?? idx}>
                          <TableCell>
                            <Link
                              to={`/admin/orders/${order.id ?? order._id}`}
                              className="text-primary-600 hover:underline"
                            >
                              #{(order.id ?? order._id)?.slice?.(-6) ?? ''}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {typeof order.user === "string"
                              ? "Guest"
                              : order.user?.name ||
                                order.guestInfo?.name ||
                                "Guest"}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            ${order.totalPrice}
                          </TableCell>
                          <TableCell>
                            {order.orderItems && order.orderItems.length > 0 ? (
                              <ul style={{margin:0, padding:0, listStyle:'none'}}>
                                {order.orderItems.map((item, i) => (
                                  <li key={i} style={{display:'flex', alignItems:'center', gap:6, marginBottom:2}}>

                                    {item.image ? (
                                      <img
                                        src={item.image.startsWith('http')
                                          ? item.image
                                          : `${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                                        alt={item.name}
                                        style={{width:28, height:28, objectFit:'cover', borderRadius:4, marginRight:4}}
                                      />
                                    ) : (
                                      <span style={{width:28, height:28, display:'inline-block', background:'#eee', borderRadius:4, marginRight:4}}></span>
                                    )}
                                    <span>{item.name}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span>-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {order.orderItems && order.orderItems.length > 0 ? (
                              <ul style={{margin:0, padding:0, listStyle:'none'}}>
                                {order.orderItems.map((item, i) => (
                                  <li key={i}>
                                    <p>{item.quantity}</p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span>-</span>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={t(`admin.${String(order.status).toLowerCase()}`)}
                              color={
                                order.status === "delivered"
                                  ? "success"
                                  : order.status === "processing"
                                  ? "primary"
                                  : order.status === "cancelled"
                                  ? "error"
                                  : "warning"
                              }
                              size="small"
                            />
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
