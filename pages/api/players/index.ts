import { fetchAllPlayers } from "@/services/playersService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getAllPlayers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allPlayers = await fetchAllPlayers();
    res.status(200).json(allPlayers);
  } catch (e) {
    if (e instanceof Error && e.message === "Too many balldontlie requests") {
      res.status(500).send(e.message);
    }
    res.status(500);
  }
}
