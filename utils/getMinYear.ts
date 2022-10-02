import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";

export const getMinYear = (avgs: ISeasonAveragesWithName[]) => {
  if (!avgs) return undefined;

  const averageWithName = avgs.reduce((prev, avgWithName) => {
    if (!prev.seasonAverages.length) {
      return avgWithName;
    }
    if (!avgWithName.seasonAverages.length) {
      return prev;
    }

    return prev.seasonAverages[0].season < avgWithName.seasonAverages[0].season
      ? prev
      : avgWithName;
  });

  if (!averageWithName.seasonAverages.length) {
    return new Date().getFullYear();
  }
  return averageWithName.seasonAverages[0].season;
};
