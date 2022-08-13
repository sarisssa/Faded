import { ILineChartProps } from "@/interfaces/props/ILineChartProps";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Season averages",
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
    },
  },
};

export default function LineChart(props: ILineChartProps) {
  const data = convertToLineData(props);

  return <Line options={options} data={data} />;
}

function convertToLineData(props: ILineChartProps): ChartData<"line"> {
  return {
    labels: props.seasons.map((x) => x.toString()),
    datasets: props.stats.map((x) => ({
      label: x.label,
      data: x.data,
      borderColor: x.lineColor,
      backgroundColor: x.lineColor,
      tension: 0.1,
      pointRadius: 7,
    })),
  };
}
