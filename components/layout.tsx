import { getPlayers } from "clients/playersClient";
import { useEffect, useState } from "react";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";
import SearchBar from "./search-bar";

interface ILayoutProps {
  children: JSX.Element;
}

export default function Layout({ children }: ILayoutProps) {
  return <LayoutContent children={children} />;
}

interface ILayoutContentProps {
  children: JSX.Element;
}

const LayoutContent = ({ children }: ILayoutContentProps) => {
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
    <>
      <h1>FADED</h1>
      {!allPlayers.length && !isInErrorState && <p>Loading...</p>}
      {allPlayers.length && !isInErrorState && (
        <>
          <SearchBar allPlayers={allPlayers} />
        </>
      )}
      {isInErrorState && <p>Error while retrieving players</p>}
      <main>{children}</main>
    </>
  );
};
