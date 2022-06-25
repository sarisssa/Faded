import { ISeasonAverage } from "../interfaces/entities/ISeasonAverage";
import { ISeasonAverageResponse } from "../interfaces/responses/ISeasonAverageResponse";

export const getSeasonAverages = async (playerId: number) => {
  const curYear = 2021;
  const promises: Promise<ISeasonAverage>[] = [];
  for (let i = curYear; i > curYear - 5; i--) {
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

  const seasonAverages = (await Promise.all(promises)).filter(
    (average) => average !== undefined
  );
  return seasonAverages; //No await because the return value is not being utilized by this function
};
