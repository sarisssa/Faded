import { getSeasonAverages } from "clients/seasonAverageClient";

export const getAllSeasonAverages = async (
  playerIds: string[],
  startYear?: number,
  endYear?: number
) => {
  return Promise.all(
    playerIds.map((id) => getSeasonAverages(id, startYear, endYear))
  );
};
