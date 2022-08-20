import { fetchPlayer } from "@/services/playersService";
import { getSeasonAverages } from "@/services/seasonAverageService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getSeasonAveragesOfPlayers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const playerInfo = await fetchPlayer(+req.query.playerId);

    const seasonAverages = await getSeasonAverages(
      +req.query.playerId, // + sign to cast string into number
      +req.query.startYear || undefined,
      +req.query.endYear || undefined
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
