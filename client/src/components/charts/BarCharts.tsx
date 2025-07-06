import { FC, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const BarCharts: FC<ApexOptions> = ({ ...props }) => {
  const [options] = useState<ApexOptions>({ ...props });

  const [series] = useState([
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width={98}
        height={80}
      />
    </div>
  );
};

export default BarCharts;
