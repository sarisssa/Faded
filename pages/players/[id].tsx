import FadedSelect from "@/components/faded-select";
import LineChart from "@/components/line-chart";
import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";
import useDidMountEffect from "hooks/useDidMountEffect";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { getAllSeasonAverages } from "utils/getAllSeasonAverages";
import { getPlayerIdsFromQuery } from "utils/getPlayersIdsFromQuery";
import { getYears } from "utils/getYears";
import { ISeasonAverage } from "../../interfaces/entities/ISeasonAverage";

type Categories = Exclude<keyof ISeasonAverage, "player_name">;

const lastSeason = new Date().getFullYear() - 1;
const firstShownSeason = new Date().getFullYear() - 6;
const categories: [key: Categories, value: string][] = [
  ["pts", "Points"],
  ["reb", "Rebounds"],
  ["ast", "Assists"],
  ["stl", "Steals"],
  ["blk", "Blocks"],
  ["turnover", "Turnovers"],
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const playerIds = getPlayerIdsFromQuery([
    context.query.id,
    context.query.compareAgainst,
  ]);
  const seasonAverages = await getAllSeasonAverages(playerIds);

  return {
    props: {
      seasonAverages,
    },
  };
};

const PlayerDetails = ({
  seasonAverages,
}: {
  seasonAverages: ISeasonAveragesWithName[];
}) => {
  const router = useRouter();

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [startYear, setStartYear] = useState(firstShownSeason);
  const [endYear, setEndYear] = useState(lastSeason);
  const [category, setCategory] = useState<Categories>("pts");
  const [overridenSeasonAverages, setOverridenSeasonAverages] = useState<
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
        const newSeasonAverages = overridenSeasonAverages.filter((x) =>
          newPlayerIds.includes(String(x.seasonAverages[0].player_id))
        );
        setOverridenSeasonAverages(newSeasonAverages);
        return;
      }

      const seasonAveragesWithName = await getAllSeasonAverages(
        newPlayerIds,
        startYear,
        endYear
      );

      setOverridenSeasonAverages(seasonAveragesWithName);
    };

    fetchNewSeasonAverages();
  }, [startYear, endYear, router.query.id, router.query.compareAgainst]);

  const chartSeasonAveragesWithName =
    overridenSeasonAverages.length > 0
      ? overridenSeasonAverages
      : seasonAverages;

  const selectableYears = getYears();
  const shownYears = getYears(startYear, endYear);

  shownYears.forEach((year) => {
    // Iterate through each player and push a block of empty stats if the player was absent that season
    chartSeasonAveragesWithName.forEach(({ seasonAverages }) => {
      if (!seasonAverages.find((x) => x.season === year)) {
        seasonAverages.push({
          season: year,
          pts: 0,
          ast: 0,
          min: 0,
          blk: 0,
          games_played: 0,
          reb: 0,
        } as ISeasonAverage);
      }
    });
  });

  chartSeasonAveragesWithName.forEach(({ seasonAverages }) =>
    seasonAverages.sort((a, b) => a.season - b.season)
  );

  return (
    <>
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
        onChange={(value) => setCategory(value as Categories)}
      />
      <LineChart
        seasons={shownYears}
        stats={chartSeasonAveragesWithName.map((seasonAveragesWithName, i) => ({
          label: String(seasonAveragesWithName.playerName),
          data: seasonAveragesWithName.seasonAverages.map((x) => x[category]),
        }))}
      />
    </>
  );
};

export default PlayerDetails;
