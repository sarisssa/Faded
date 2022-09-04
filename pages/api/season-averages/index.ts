import { fetchPlayer } from "@/services/playersService";
import { getSeasonAverages } from "@/services/seasonAverageService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getSeasonAveragesOfPlayers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { playerId, startYear, endYear } = req.query;
    const playerInfo = await fetchPlayer(+playerId);
    const seasonAverages = await getSeasonAverages(
      +playerId,
      +startYear || undefined,
      +endYear || undefined
    );

    res.status(200).json({
      playerName: `${playerInfo.first_name} ${playerInfo.last_name}`,
      seasonAverages,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Too many balldontlie requests") {
      res.status(500).send(e.message);
    }
    res.status(500);
  }
}
