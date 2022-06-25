import { ISeasonAverage } from "../entities/ISeasonAverage";

export interface ILineChartProps {
  seasons: number[];
  stats: {
    label: keyof ISeasonAverage;
    data: number[];
    hidden: boolean;
    lineColor: string;
  }[];
}
