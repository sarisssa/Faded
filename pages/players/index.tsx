import PlayerConfigurationBar from "@/components/player-configuration-bar";
import { useRouter } from "next/router";

// Return no UI if the user didn't select any player but don't throw an error either
const index = () => {
  const router = useRouter();

  return (
    <PlayerConfigurationBar
      onSeasonAveragesChange={(seasonAveragesWithName) => {
        const playerId = seasonAveragesWithName[0].seasonAverages[0].player_id;
        if (playerId) {
          router.push(`/players/${playerId}`);
        }
      }}
    />
  );
};

export default index;
