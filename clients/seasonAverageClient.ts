import { ISeasonAverage } from "@/interfaces/entities/ISeasonAverage";

export async function getSeasonAverages(
  playerId: number
): Promise<ISeasonAverage[]> {
  const response = await fetch(
    `http://localhost:3000/api/season-averages?playerId=${playerId}`
  );

  if (
    response.status === 500 &&
    (await response.text()) === "Too many balldontlie requests"
  ) {
    throw new Error("Too many balldontlie requests");
  }

  return await response.json();
}
