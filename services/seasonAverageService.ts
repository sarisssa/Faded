import { ISeasonAverage } from "../interfaces/entities/ISeasonAverage";
import { ISeasonAverageResponse } from "../interfaces/responses/ISeasonAverageResponse";

const cache = new Map<string, ISeasonAverage>();

export const getSeasonAverages = async (
  playerId: number,
  startYear = new Date().getFullYear() - 6,
  endYear = new Date().getFullYear() - 1
) => {
  const promises: Promise<ISeasonAverage>[] = [];

  for (let i = startYear; i <= endYear; i++) {
    const cachedSeasonAverage = cache.get(`${i}${playerId}`);
    if (cachedSeasonAverage) {
      promises.push(Promise.resolve(cachedSeasonAverage));
      continue;
    }

    const promise = fetch(
      `https://www.balldontlie.io/api/v1/season_averages?season=${i}&player_ids[]=${playerId}`
    )
      .then((res) => res.json())
      .then((res: ISeasonAverageResponse) => {
        return res.data[0];
      });
    promises.push(promise);
  }

  const seasonAverages = (await Promise.all(promises)).filter(
    (average) => average !== undefined
  );
  seasonAverages.forEach((seasonAverage) => {
    cache.set(`${seasonAverage.season}${playerId}`, seasonAverage);
  });

  const sortedSeasonAverages = seasonAverages.sort(
    (a, b) => b.season - a.season
  );

  return sortedSeasonAverages; //No await because the return value is not being utilized by this function
};
