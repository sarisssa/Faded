export interface ILineChartProps {
  seasons: number[];
  stats: {
    //This is correct but it seems that stats is an array of objects derived by map()
    label: string;
    data: number[];
  }[];
}
