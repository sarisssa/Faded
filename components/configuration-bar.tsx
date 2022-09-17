import { IEssentialPlayerData } from "@/interfaces/props/ISearchBarProps";
import { getPlayers } from "clients/playersClient";
import { ReactElement, useEffect, useState } from "react";
import SearchBar from "./search-bar";

interface ConfigurationBarProps {
  children?: ReactElement;
}

export default function ConfigurationBar({ children }: ConfigurationBarProps) {
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
    <div className="flex justify-around">
      {!allPlayers.length && !isInErrorState && <p>Loading...</p>}
      {allPlayers.length && !isInErrorState && (
        <SearchBar allPlayers={allPlayers} />
      )}
      {isInErrorState && <p>Error while retrieving players</p>}
      {children}
    </div>
  );
}
