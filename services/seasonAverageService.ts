import { ISeasonAverage } from "../interfaces/entities/ISeasonAverage";
import { ISeasonAverageResponse } from "../interfaces/responses/ISeasonAverageResponse";

export const getSeasonAverages = async (
  playerId: number,
  startYear = new Date().getFullYear() - 6,
  endYear = new Date().getFullYear() - 1
) => {
  const promises: Promise<ISeasonAverage>[] = [];
  for (let i = startYear; i <= endYear; i++) {
    promises.push(
      fetch(
        `https://www.balldontlie.io/api/v1/season_averages?season=${i}&player_ids[]=${playerId}`
      )
        .then((res) => res.json())
        .then((res: ISeasonAverageResponse) => {
          return res.data[0];
        })
    );
  }

  const seasonAverages = (await Promise.all(promises))
    .filter((average) => average !== undefined)
    .sort((a, b) => b.season - a.season);

  return seasonAverages; //No await because the return value is not being utilized by this function
};
