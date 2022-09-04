import { ISeasonAverage } from "@/interfaces/entities/ISeasonAverage";
import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";
import { BASE_URL } from "./baseUrl";

const sortSeasonAveragesBySeasonDesc = (seasonAverages: ISeasonAverage[]) => {
  return seasonAverages.sort((x) => x.season).reverse();
};

/**
 * Calls internal API which calls the balldontlie API for last 5 years of season averages
 *
 * @param playerId The player you want to fetch the season averages of
 * @param startYear The first year to fetch season averages
 * @param endYear The last year to fetch season averages
 */
export async function getSeasonAverages(
  playerId: number | string,
  startYear?: number,
  endYear?: number
): Promise<ISeasonAveragesWithName> {
  let endpointUrl = `${BASE_URL}/season-averages?playerId=${playerId}`;
  // let endpointUrl = `http://localhost:3000/api/season-averages?playerId=${playerId}`;
  // let endpointUrl = `/api/season-averages?playerId=${playerId}`;
  if (startYear) {
    endpointUrl += `&startYear=${startYear}`;
  }
  if (endYear) {
    endpointUrl += `&endYear=${endYear}`;
  }

  console.log(endpointUrl);
  const getSeasonAveragesResponse = await fetch(endpointUrl);

  if (
    getSeasonAveragesResponse.status === 500 &&
    (await getSeasonAveragesResponse.text()) === "Too many balldontlie requests"
  ) {
    throw new Error("Too many balldontlie requests");
  }

  const seasonAveragesWithName: ISeasonAveragesWithName =
    await getSeasonAveragesResponse.json();

  seasonAveragesWithName.seasonAverages = sortSeasonAveragesBySeasonDesc(
    seasonAveragesWithName.seasonAverages
  );

  return seasonAveragesWithName;
}
