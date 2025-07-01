import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  CircularProgress,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import ReactApexChart from "react-apexcharts";
import {
  getSalesStats,
  getVisitorStats,
  getProductStats,
} from "@/store/slices/adminSlice";

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [period, setPeriod] = useState<
    "7days" | "30days" | "90days" | "12months"
  >("7days");

  const { salesStats, visitorStats, productStats, loading, error } =
    useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getSalesStats(period));
    dispatch(getVisitorStats(period));
    dispatch(getProductStats());
  }, [dispatch, period]);

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as "7days" | "30days" | "90days" | "12months");
  };

  const hasSalesData =
    salesStats &&
    salesStats.dailySales &&
    Array.isArray(salesStats.dailySales) &&
    salesStats.dailySales.length > 0;

  const hasVisitorData =
    visitorStats &&
    visitorStats.dailyVisitors &&
    Array.isArray(visitorStats.dailyVisitors) &&
    visitorStats.dailyVisitors.length > 0;

  const hasProductData =
    productStats &&
    productStats.topSellingProducts &&
    Array.isArray(productStats.topSellingProducts) &&
    productStats.topSellingProducts.length > 0;


  const defaultProductData = [
    { _id: "1", name: "Product 1", sales: 10, revenue: 1000 },
    { _id: "2", name: "Product 2", sales: 8, revenue: 800 },
    { _id: "3", name: "Product 3", sales: 6, revenue: 600 },
    { _id: "4", name: "Product 4", sales: 4, revenue: 400 },
    { _id: "5", name: "Product 5", sales: 2, revenue: 200 },
  ];

  function getDaysArray(days: number) {
    const today = new Date();
    return Array(days)
      .fill(0)
      .map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        return d.toISOString().split("T")[0]; // YYYY-MM-DD
      });
  }

  let daysCount = 7;
  if (period === "30days") daysCount = 30;
  else if (period === "90days") daysCount = 90;
  else if (period === "12months") daysCount = 365;

  const allDays = getDaysArray(daysCount);

  let mergedSales = allDays.map((date) => {
    const found =
      hasSalesData &&
      salesStats.dailySales.find((item: any) => item.date === date);
    return {
      date,
      sales: found ? found.sales : 0,
      revenue: found ? found.revenue : 0,
    };
  });

  const salesChartOptions = {
    chart: {
      type: "area" as const,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: allDays.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number, opts: any) {
          if (opts && opts.series && opts.seriesIndex === 1) {
            return val.toFixed(0) + " DA";
          }
          return val.toFixed(0);
        },
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        formatter: function (value: any) {
          if (typeof value === "string" && value.match(/\d{1,2} \w{3}/)) {
            return value;
          }
          return value;
        },
      },
      y: {
        formatter: function (val: number, opts: any) {
          if (opts && opts.seriesIndex === 1) {
            return val.toFixed(0) + " DA";
          }
          return val.toFixed(0);
        },
      },
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "right" as const,
    },
  };

  const salesChartSeries = [
    {
      name: t("admin.sales"),
      data: mergedSales.map((item) => Number(item.sales)),
    },
    {
      name: t("admin.revenue"),
      data: mergedSales.map((item) => Number(item.revenue)),
    },
  ];

  const mergedVisitors = allDays.map((date) => {
    const found =
      hasVisitorData &&
      visitorStats.dailyVisitors.find((item: any) => item.date === date);
    return {
      date,
      visitors: found ? found.visitors : 0,
      newVisitors: found ? found.newVisitors : 0,
    };
  });

  const visitorChartOptions = {
    chart: {
      type: "area" as const,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.info.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    xaxis: {
      categories: allDays.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        formatter: function (value: any) {
          if (typeof value === "string" && value.match(/\d{1,2} \w{3}/)) {
            return value;
          }
          return value;
        },
      },
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "right" as const,
    },
  };

  const visitorChartSeries = [
    {
      name: t("admin.totalVisitors"),
      data: mergedVisitors.map((item) => Number(item.visitors)),
    },
    {
      name: t("admin.newVisitors"),
      data: mergedVisitors.map((item) => Number(item.newVisitors)),
    },
  ];

  const categoryChartLabels =
    hasProductData && Array.isArray(productStats?.categoryDistribution)
      ? productStats.categoryDistribution.map((item: any) =>
          typeof item.category === "string"
            ? item.category
            : JSON.stringify(item.category)
        )
      : [];

  const categoryChartSeries =
    hasProductData && Array.isArray(productStats?.categoryDistribution)
      ? productStats.categoryDistribution.map((item: any) =>
          typeof item.count === "number" ? item.count : Number(item.count)
        )
      : [];

  const categoryChartOptions = {
    chart: {
      type: "pie" as const,
      height: 350,
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ],
    labels: categoryChartLabels,
    legend: {
      position: "bottom" as const,
    },
  };

  const productPerformanceOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: hasProductData
        ? productStats.topSellingProducts.map(
            (item: { name: string }) => item.name
          )
        : defaultProductData.map((item: { name: string }) => item.name),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
  };

  const productPerformanceSeries = [
    {
      name: t("admin.sales"),
      data: hasProductData
        ? productStats.topSellingProducts.map(
            (item: { sales: number }) => item.sales
          )
        : defaultProductData.map((item: { sales: number }) => item.sales),
    },
  ];

  const stockStatusOptions = {
    chart: {
      type: "donut" as const,
      height: 350,
    },
    colors: [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    labels: [
      t("products.inStock"),
      t("products.lowStock"),
      t("products.outOfStock"),
    ],
    legend: {
      position: "bottom" as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom" as const,
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
  };

  const stockStatusSeries = productStats?.stockStatus
    ? [
        productStats.stockStatus.inStock,
        productStats.stockStatus.lowStock,
        productStats.stockStatus.outOfStock,
      ]
    : [60, 30, 10];

  const isValidCategorySeries =
    Array.isArray(categoryChartSeries) &&
    categoryChartSeries.length > 0 &&
    categoryChartSeries.every(
      (item) => typeof item === "number" && !isNaN(item)
    );

  const isValidStockStatusSeries =
    Array.isArray(stockStatusSeries) &&
    stockStatusSeries.length > 0 &&
    stockStatusSeries.every(
      (item) => typeof item === "number" && !isNaN(item)
    );

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-full">
        <CircularProgress />
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
            dispatch(getSalesStats(period));
            dispatch(getVisitorStats(period));
            dispatch(getProductStats());
          }}
        >
          {t("common.tryAgain")}
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Box className="flex justify-between mb-6">
        <Typography variant="h4" component="h1" className="mb-6 font-josefin">
          {t("admin.analytics")}
        </Typography>
        <FormControl variant="outlined" size="small" className="min-w-[200px]">
          <InputLabel id="period-select-label">{t("admin.period")}</InputLabel>
          <Select
            labelId="period-select-label"
            value={period}
            onChange={handlePeriodChange}
            label={t("admin.period")}
          >
            <MenuItem value="7days">{t("admin.daily")}</MenuItem>
            <MenuItem value="30days">{t("admin.last30Days")}</MenuItem>
            <MenuItem value="90days">{t("admin.last90Days")}</MenuItem>
            <MenuItem value="12months">{t("admin.monthly")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t("admin.salesOverTime")} />
            <Divider />
            <CardContent>
              <ReactApexChart
                options={salesChartOptions}
                series={salesChartSeries}
                type="area"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t("admin.visitorStats")} />
            <Divider />
            <CardContent>
              <ReactApexChart
                options={visitorChartOptions}
                series={visitorChartSeries}
                type="area"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t("admin.topCategories")} />
            <Divider />
            <CardContent>
              {isValidCategorySeries ? (
                <ReactApexChart
                  options={categoryChartOptions}
                  series={categoryChartSeries}
                  type="pie"
                  height={350}
                />
              ) : (
                <Typography>لا توجد بيانات للفترة المختارة</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t("admin.productPerformance")} />
            <Divider />
            <CardContent>
              <ReactApexChart
                options={productPerformanceOptions}
                series={productPerformanceSeries}
                type="bar"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t("admin.stockStatus")} />
            <Divider />
            <CardContent>
              {isValidStockStatusSeries ? (
                <ReactApexChart
                  options={stockStatusOptions}
                  series={stockStatusSeries}
                  type="donut"
                  height={350}
                />
              ) : (
                <Typography>لا توجد بيانات للفترة المختارة</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
