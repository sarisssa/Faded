import { getSeasonAverages } from "@/services/seasonAverageService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getSeasonAveragesOfPlayers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const seasonAverages = await getSeasonAverages(+req.query.playerId);
    res.status(200).json(seasonAverages);
  } catch (e) {
    if (e instanceof Error && e.message === "Too many balldontlie requests") {
      res.status(500).send(e.message);
    }
    res.status(500);
  }
}
