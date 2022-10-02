import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";
import useDidMountEffect from "hooks/useDidMountEffect";
import { useRouter } from "next/router";
import { Categories } from "pages/players/[id]";
import { useState } from "react";
import { getAllSeasonAverages } from "utils/getAllSeasonAverages";
import { getPlayerIdsFromQuery } from "utils/getPlayersIdsFromQuery";
import { getYears } from "utils/getYears";
import ConfigurationBar from "./configuration-bar";
import { FadedSelect } from "./faded-select";

const lastSeason = new Date().getFullYear() - 1;
const firstShownSeason = new Date().getFullYear() - 6;
const categories: [key: Categories, value: string][] = [
  ["pts", "Points"],
  ["reb", "Rebounds"],
  ["ast", "Assists"],
  ["stl", "Steals"],
  ["blk", "Blocks"],
  ["fg3m", "Threes"],
  ["fg_pct", "Field Goal %"],
  ["ft_pct", "Free Throw %"],
  ["turnover", "Turnovers"],
];

interface PlayerConfigurationBarProps {
  onSeasonAveragesChange: (
    seasonAveragesWithNames: ISeasonAveragesWithName[]
  ) => void;
  onCategoryChange?: (category: Categories) => void;
}

export default function PlayerConfigurationBar({
  onSeasonAveragesChange,
  onCategoryChange,
}: PlayerConfigurationBarProps) {
  const [startYear, setStartYear] = useState(firstShownSeason);
  const [endYear, setEndYear] = useState(lastSeason);

  const selectableYears = getYears();

  const router = useRouter();

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [seasonAverages, setSeasonAverages] = useState<
    ISeasonAveragesWithName[]
  >([]);

  //useEffect without initial call
  useDidMountEffect(() => {
    const fetchNewSeasonAverages = async () => {
      if (!router.query.id) return;

      const newPlayerIds = getPlayerIdsFromQuery([
        router.query.id,
        router.query.compareAgainst,
      ]);

      setSelectedPlayers(newPlayerIds);

      if (newPlayerIds.length < selectedPlayers.length) {
        const newSeasonAverages = seasonAverages.filter((x) =>
          newPlayerIds.includes(String(x.seasonAverages[0].player_id))
        );
        setSeasonAverages(newSeasonAverages);
        onSeasonAveragesChange(newSeasonAverages);
        return;
      }

      const seasonAveragesWithName = await getAllSeasonAverages(
        newPlayerIds,
        startYear,
        endYear
      );

      setSeasonAverages(seasonAveragesWithName);
      onSeasonAveragesChange(seasonAveragesWithName);
    };

    fetchNewSeasonAverages();
  }, [startYear, endYear, router.query.id, router.query.compareAgainst]);

  return (
    <ConfigurationBar>
      <div className="flex justify-between">
        <FadedSelect
          defaultValue={new Date().getFullYear() - 6}
          items={selectableYears.map((year) => [year, year])}
          label="Start Year"
          onChange={(value) => setStartYear(value as number)}
          isMenuItemDisabled={([curYear]) => curYear > endYear}
        />
        <FadedSelect
          defaultValue={new Date().getFullYear() - 1}
          items={selectableYears.map((year) => [year, year])}
          label="End Year"
          onChange={(value) => setEndYear(value as number)}
          isMenuItemDisabled={([curYear]) => curYear < startYear}
        />
        <FadedSelect
          defaultValue="pts"
          items={categories}
          label="Categories"
          onChange={(value) => onCategoryChange?.(value as Categories)}
        />
      </div>
    </ConfigurationBar>
  );
}
