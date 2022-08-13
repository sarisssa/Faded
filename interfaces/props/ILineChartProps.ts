export interface ILineChartProps {
  seasons: number[];
  stats: {
    label: string;
    data: number[];
    lineColor: string;
  }[];
}
