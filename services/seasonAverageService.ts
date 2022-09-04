import { ISeasonAverage } from "../interfaces/entities/ISeasonAverage";
import { ISeasonAverageResponse } from "../interfaces/responses/ISeasonAverageResponse";
import { BASE_URL } from "./baseUrl";

const seasonAveragesCache = new Map<string, ISeasonAverage>();
const lastSeason = new Date().getFullYear() - 1;
const firstShownSeason = new Date().getFullYear() - 6;

const sortSeasonsByYearsAscending = (seasonAverages: ISeasonAverage[]) =>
  seasonAverages.sort((a, b) => b.season - a.season);

const getUniqueCacheKey = (season: number, playerId: number) =>
  `${season}_${playerId}`;

export const getSeasonAverages = async (
  playerId: number,
  startYear = firstShownSeason,
  endYear = lastSeason
) => {
  const fetchSeasonAveragesPromises: Promise<ISeasonAverage | undefined>[] = [];

  for (let i = startYear; i <= endYear; i++) {
    const cachedSeasonAverage = seasonAveragesCache.get(
      getUniqueCacheKey(i, playerId)
    );
    if (cachedSeasonAverage) {
      // Because the array is filled with promises, we have to wrap the cached season average in a promise
      fetchSeasonAveragesPromises.push(Promise.resolve(cachedSeasonAverage));
      continue;
    }

    const getSeasonAverageResult = fetch(
      `${BASE_URL}/season_averages?season=${i}&player_ids[]=${playerId}`
    )
      .then((res) => res.json())
      .then((res: ISeasonAverageResponse) => {
        // Return only first element because we only retrieve season averages of 1 player
        return res.data[0];
      });

    fetchSeasonAveragesPromises.push(getSeasonAverageResult);
  }

  const seasonAverages = await Promise.all(fetchSeasonAveragesPromises);
  const definedSeasonAverages = seasonAverages.filter(
    (average) => average
  ) as ISeasonAverage[];

  definedSeasonAverages.forEach((seasonAverage) => {
    seasonAveragesCache.set(
      getUniqueCacheKey(seasonAverage.season, playerId),
      seasonAverage
    );
  });

  const sortedSeasonAverages = sortSeasonsByYearsAscending(
    definedSeasonAverages
  );

  return sortedSeasonAverages;
};
