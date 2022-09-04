import { IPlayer } from "../interfaces/entities/IPlayer";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";
import {
  IGetPlayerResponse,
  IGetPlayersResponse,
} from "../interfaces/responses/IGetPlayersResponse";
import { BASE_URL } from "./baseUrl";

const sortPlayersByNameAlphabetically = (
  player1: IEssentialPlayerData,
  player2: IEssentialPlayerData
) => player1.name.localeCompare(player2.name);

let cachedPlayers: IEssentialPlayerData[] = [];

export const fetchAllPlayers = async () => {
  if (cachedPlayers.length) {
    return cachedPlayers;
  }

  const maxAmountPerPage = 100;
  const getPlayersUrl = `${BASE_URL}/players?per_page=${maxAmountPerPage}`;
  const firstGetPlayersResponse: IGetPlayersResponse = await fetch(
    getPlayersUrl
  ).then((x) => x.json());
  const totalPages = firstGetPlayersResponse.meta.total_pages;

  let fetchPlayersPromises: Promise<IPlayer[]>[] = [];

  const skipFirstPage = 2;
  for (let i = skipFirstPage; i < totalPages + 1; i++) {
    fetchPlayersPromises.push(
      fetch(`${getPlayersUrl}&page=${i}`)
        .then((res) => {
          if (res.status === 429) {
            throw new Error("Too many balldontlie requests");
          }
          return res.json();
        })
        .then((res: IGetPlayersResponse) => res.data)
    );
  }

  const otherGetPlayersResults = (
    await Promise.all(fetchPlayersPromises)
  ).flat();

  cachedPlayers = [...firstGetPlayersResponse.data, ...otherGetPlayersResults]
    .map((player) => ({
      name: player.first_name + " " + player.last_name,
      id: player.id,
    }))
    .sort(sortPlayersByNameAlphabetically);

  return cachedPlayers;
};

export const fetchPlayer = async (
  playerId: number
): Promise<IGetPlayerResponse> => {
  return fetch(`${BASE_URL}/players/${playerId}`).then((x) => x.json());
};
