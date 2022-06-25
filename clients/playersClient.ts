import { IEssentialPlayerData } from "@/interfaces/props/ISearchBarProps";

export async function getPlayers(): Promise<IEssentialPlayerData[]> {
  // Client side caching: return localstorage if it exists
  const localAllPlayers = localStorage.getItem("/api/players");

  if (localAllPlayers) {
    return JSON.parse(localAllPlayers);
  }

  const response = await fetch("/api/players");
  if (
    response.status === 500 &&
    (await response.text()) === "Too many balldontlie requests"
  ) {
    throw new Error("Too many balldontlie requests");
  }

  const allPlayers: IEssentialPlayerData[] = await response.json();
  localStorage.setItem("/api/players", JSON.stringify(allPlayers));
  return allPlayers;
}
