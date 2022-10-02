import { IEssentialPlayerData } from "@/interfaces/props/ISearchBarProps";
import { getPlayers } from "clients/playersClient";
import { ReactElement, useEffect, useState } from "react";
import SearchBar from "./search-bar";

interface ConfigurationBarProps {
  children?: ReactElement;
  onPlayerSelect?: (playerId: number) => void;
}

export default function ConfigurationBar({
  children,
  onPlayerSelect,
}: ConfigurationBarProps) {
  const [allPlayers, setAllPlayers] = useState<IEssentialPlayerData[]>([]);
  const [isInErrorState, setIsInErrorState] = useState(false);

  const fetchPlayers = async () => {
    try {
      setAllPlayers(await getPlayers());
    } catch {
      setIsInErrorState(true);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="flex justify-around md:flex-row flex-col">
      {!allPlayers.length && !isInErrorState && <p>Loading...</p>}
      {allPlayers.length && !isInErrorState && (
        <SearchBar onPlayerSelect={onPlayerSelect} allPlayers={allPlayers} />
      )}
      {isInErrorState && <p>Error while retrieving players</p>}
      {children}
    </div>
  );
}
