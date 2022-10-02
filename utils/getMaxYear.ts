import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";

export const getMaxYear = (
  seasonAveragesWithName: ISeasonAveragesWithName[]
) => {
  if (!seasonAveragesWithName) return undefined;

  const latestSeasonAverages = seasonAveragesWithName.reduce((prev, cur) => {
    const prevLast = prev.seasonAverages.length - 1;
    const curLast = cur.seasonAverages.length - 1;

    if (prevLast < 0) return cur;
    if (curLast < 0) return prev;

    return prev.seasonAverages[prevLast].season >
      cur.seasonAverages[curLast].season
      ? prev
      : cur;
  }).seasonAverages;

  const last = latestSeasonAverages.length - 1;
  if (last < 0) {
    return new Date().getFullYear();
  }

  return latestSeasonAverages[last].season;
};
