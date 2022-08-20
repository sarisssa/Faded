import LineChart from "@/components/line-chart";
import { ISeasonAveragesWithName } from "@/interfaces/entities/ISeasonAveragesWithName";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getSeasonAverages } from "clients/seasonAverageClient";
import useDidMountEffect from "hooks/useDidMountEffect";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ISeasonAverage } from "../../interfaces/entities/ISeasonAverage";

// const statsToShow: ILineConfiguration[] = [
//   { stat: "ast", disabled: true, lineColor: "rgb(255, 99, 132)" },
//   { stat: "pts", disabled: false, lineColor: "rgb(255, 99, 132)" },
//   { stat: "min", disabled: true, lineColor: "rgb(255, 99, 132)" },
//   { stat: "blk", disabled: true, lineColor: "rgb(255, 99, 132)" },
//   { stat: "games_played", disabled: true, lineColor: "rgb(255, 99, 132)" },
//   { stat: "reb", disabled: true, lineColor: "rgb(255, 99, 132)" },
// ];

const colors = [
  "rgb(255, 99, 132)",
  "#1f399d",
  "#53dd1c",
  "#94162e",
  "#4193ec",
  "#a25fc6",
  "#24ecc4",
  "#c9bfe6",
  "#281df2",
  "#da09a0",
];
const getAllSeasonAverages = async (
  playerIds: number[],
  startYear?: number,
  endYear?: number
) => {
  return Promise.all(
    playerIds.map((id) => getSeasonAverages(id, startYear, endYear))
  );
};

const getPlayerIdsFromQuery = (players: (string | string[] | undefined)[]) => {
  const playerIds: number[] = [];

  players.map((player) => {
    if (typeof player === "string") {
      playerIds.push(+player);
    } else if (player) {
      player.forEach((id) => playerIds.push(+id));
    }
  });

  return playerIds;
};

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
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 6);
  const [endYear, setEndYear] = useState(new Date().getFullYear() - 1);
  const [overridenSeasonAverages, setOverridenSeasonAverages] = useState<
    ISeasonAveragesWithName[]
  >([]);

  useDidMountEffect(() => {
    const fetchNewSeasonAverages = async () => {
      if (!router.query.id) return;

      const newPlayers = [router.query.id, router.query.compareAgainst]
        .filter((x) => x)
        .flat() as string[];

      setSelectedPlayers(newPlayers);

      if (newPlayers.length < selectedPlayers.length) {
        const newSeasonAverages = overridenSeasonAverages.filter((x) =>
          newPlayers.includes(String(x.seasonAverages[0].player_id))
        );
        setOverridenSeasonAverages(newSeasonAverages);
        return;
      }

      const playerIds = getPlayerIdsFromQuery(newPlayers);

      const seasonAveragesWithName = await getAllSeasonAverages(
        playerIds,
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
      <FormControl size="small">
        <InputLabel id="demo-simple-select-label">Start year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={startYear}
          label="Start year"
          MenuProps={{ style: { maxHeight: 200 } }}
          onChange={(e) => setStartYear(+e.target.value)}
        >
          {selectableYears.map((year) => (
            <MenuItem disabled={year > endYear} key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel id="demo-simple-select-label">End Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={endYear}
          label="End year"
          MenuProps={{ style: { maxHeight: 200 } }}
          onChange={(e) => setEndYear(+e.target.value)}
        >
          {selectableYears.map((year) => (
            <MenuItem disabled={year < startYear} key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LineChart
        seasons={shownYears}
        stats={chartSeasonAveragesWithName.map((seasonAveragesWithName, i) => ({
          label: String(seasonAveragesWithName.playerName),
          data: seasonAveragesWithName.seasonAverages.map((x) => x.pts),
          lineColor: colors[i],
        }))}
      />
    </>
  );
};

export default PlayerDetails;

function getYears(startYear = 1970, endYear = new Date().getFullYear()) {
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(startYear++);
  }
  return years;
}

//API Optimizations

// Add support for different stats (pts, games_played, ...)
