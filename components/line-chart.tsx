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

const colors = [
  "rgb(255, 99, 132)",
  "#2E8BC0",
  "#606c38",
  "#E6BE8A",
  "#94162e",
  "#4193ec",
  "#a25fc6",
  "#24ecc4",
  "#281df2",
  "#da09a0",
];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { color: "white" },
    },
    title: {
      display: true,
      color: "white",
      text: "Season Averages",
      font: { size: 30 },
    },
  },
  scales: {
    x: {
      grid: {
        borderColor: "#888",
        color: "#333",
      },
      ticks: {
        color: "#CCC",
      },
    },
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      grid: {
        borderColor: "#888",
        color: "#333",
      },
      ticks: {
        color: "#CCC",
      },
    },
  },
};

export default function LineChart(props: ILineChartProps) {
  const data = convertToLineData(props);

  return (
    <div className="md:h-[500px] h-[350px]">
      <Line options={options} data={data} />
    </div>
  );
}

function convertToLineData(props: ILineChartProps): ChartData<"line"> {
  return {
    labels: props.seasons.map((x) => x.toString()),
    datasets: props.stats.map((x, index) => ({
      label: x.label,
      data: x.data,
      borderColor: colors[index],
      backgroundColor: colors[index],
      tension: 0.1,
      pointRadius: 5,
    })),
  };
}
