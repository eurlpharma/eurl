import { ApexOptions } from "apexcharts";

export const BarChartPaper: ApexOptions = {
  chart: {
    width: 60,
    height: 40,
    type: "bar" as const,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },

  plotOptions : {
    bar: {
      borderRadius: 2,
      columnWidth: "60%",
      horizontal: false,
    },
  },
  dataLabels : {
    enabled: false,
  },
  stroke : {
    curve: "smooth",
  },
  xaxis : {
    type: "datetime",
    labels: { show: false },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
    ],
  },
  yaxis : {
    labels: { show: false },
  },
  legend : {
    show: false,
  },
  grid : {
    show: false,
  },
  tooltip : {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  }
};



