export const getPlayerIdsFromQuery = (
  players: (string | string[] | undefined)[]
) => {
  const playerIds: string[] = [];

  players.forEach((player) => {
    if (typeof player === "string") {
      playerIds.push(player);
    } else if (player) {
      player.forEach((id) => playerIds.push(id));
    }
  });
  return playerIds;
};
