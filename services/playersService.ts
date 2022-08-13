import { IPlayer } from "../interfaces/entities/IPlayer";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";
import { IGetPlayersResponse } from "../interfaces/responses/IGetPlayersResponse";

let allPlayers: IEssentialPlayerData[] = [];

export const fetchAllPlayers = async () => {
  // Server side caching: gets lost when the server restarts
  if (allPlayers.length) {
    return allPlayers;
  }

  const res: Response = await fetch(
    "https://www.balldontlie.io/api/v1/players?per_page=100"
  );
  const data: IGetPlayersResponse = await res.json();
  const totalPages: number = data.meta.total_pages;

  let promises: Promise<IPlayer[]>[] = []; //promises will be an arr of Promises that return IPlayer arrays

  for (let i = 2; i < totalPages + 1; i++) {
    promises.push(
      //Rare use case of then chaining to transform fetched data without waiting
      fetch(`https://www.balldontlie.io/api/v1/players?page=${i}&per_page=100`)
        .then((res) => {
          if (res.status === 429) {
            throw new Error("Too many balldontlie requests");
          }
          return res.json();
        }) // Functionality of parse within json method
        .then((res: IGetPlayersResponse) => res.data)
    );
  }

  allPlayers = [...data.data, ...(await Promise.all(promises)).flat()]
    .map((player) => {
      return {
        name: player.first_name + " " + player.last_name,
        id: player.id,
      };
    })
    .sort((player1, player2) => player1.name.localeCompare(player2.name)); //Sort players alphabeetically

  return allPlayers;
};
