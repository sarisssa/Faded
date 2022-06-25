import { ISeasonAverage } from "../entities/ISeasonAverage";

export interface ILineConfiguration {
  stat: keyof ISeasonAverage;
  disabled: boolean;
  lineColor: string;
}
