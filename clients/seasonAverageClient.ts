import { ISeasonAverage } from "@/interfaces/entities/ISeasonAverage";

/**
 * Calls internal API which calls the balldontlie API for last 5 years of season averages
 *
 * @param playerId The player you want to fetch the season averages of
 */
export async function getSeasonAverages(
  playerId: number,
  startYear?: number,
  endYear?: number
): Promise<ISeasonAverage[]> {
  const endpointUrl = new URL("http://localhost:3000/api/season-averages");
  endpointUrl.searchParams.append("playerId", playerId.toString());
  if (startYear) {
    endpointUrl.searchParams.append("startYear", startYear.toString());
  }
  if (endYear) {
    endpointUrl.searchParams.append("endYear", endYear.toString());
  }

  const response = await fetch(endpointUrl.toString());

  if (
    response.status === 500 &&
    (await response.text()) === "Too many balldontlie requests"
  ) {
    throw new Error("Too many balldontlie requests");
  }

  const seasonAverages: ISeasonAverage[] = await response.json();
  return seasonAverages.sort((x) => x.season).reverse();
}
