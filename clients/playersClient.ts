import { IEssentialPlayerData } from "@/interfaces/props/ISearchBarProps";
import { BASE_URL } from "./baseUrl";

const getAllPlayersUrl = `${BASE_URL}/players`;
const allPlayersLocalStorageKey = getAllPlayersUrl;

export const getPlayers = async (): Promise<IEssentialPlayerData[]> => {
  const cachedAllPlayers = localStorage.getItem(allPlayersLocalStorageKey);

  if (cachedAllPlayers) {
    return JSON.parse(cachedAllPlayers);
  }

  const allPlayersResponse = await fetch(getAllPlayersUrl);
  if (
    allPlayersResponse.status === 500 &&
    (await allPlayersResponse.text()) === "Too many balldontlie requests"
  ) {
    throw new Error("Too many balldontlie requests");
  }

  const allPlayers: IEssentialPlayerData[] = await allPlayersResponse.json();
  localStorage.setItem(allPlayersLocalStorageKey, JSON.stringify(allPlayers));
  return allPlayers;
};
