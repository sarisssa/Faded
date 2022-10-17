import LineChart from "@/components/line-chart";
import PlayerConfigurationBar from "@/components/player-configuration-bar";
import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { getAllSeasonAverages } from "utils/getAllSeasonAverages";
import { getPlayerIdsFromQuery } from "utils/getPlayersIdsFromQuery";
import { getYears } from "utils/getYears";
import { ISeasonAverage } from "../../interfaces/entities/ISeasonAverage";

const lastSeason = new Date().getFullYear() - 1;
const firstShownSeason = new Date().getFullYear() - 6;
export type Categories = Exclude<keyof ISeasonAverage, "player_name">;

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
  const [category, setCategory] = useState<Categories>("pts");
  const [startYear, setStartYear] = useState<number>(firstShownSeason);
  const [endYear, setEndYear] = useState<number>(lastSeason);
  const [overridenSeasonAverages, setOverridenSeasonAverages] = useState<
    ISeasonAveragesWithName[]
  >([]);

  const chartSeasonAveragesWithName =
    overridenSeasonAverages.length > 0
      ? overridenSeasonAverages
      : seasonAverages;

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
          turnover: 0,
          fg3m: 0,
          fg_pct: 0,
          ft_pct: 0,
          games_played: 0,
          reb: 0,
          stl: 0,
        } as ISeasonAverage);
      }
    });
  });
  chartSeasonAveragesWithName.forEach(({ seasonAverages }) =>
    seasonAverages.sort((a, b) => a.season - b.season)
  );

  return (
    <>
      <PlayerConfigurationBar
        onSeasonAveragesChange={setOverridenSeasonAverages}
        onCategoryChange={setCategory}
        onStartYearChange={setStartYear}
        onEndYearChange={setEndYear}
        startYear={startYear}
        endYear={endYear}
      />
      <div className="md:m-20 m-4">
        <LineChart
          seasons={shownYears}
          stats={chartSeasonAveragesWithName.map((seasonAveragesWithName) => ({
            label: String(seasonAveragesWithName.playerName),
            data: seasonAveragesWithName.seasonAverages.map((x) => x[category]),
          }))}
        />
      </div>
    </>
  );
};

export default PlayerDetails;
