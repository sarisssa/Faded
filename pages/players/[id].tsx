import LineChart from "@/components/line-chart";
import { ILineConfiguration } from "@/interfaces/props/ILineConfiguration";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getSeasonAverages } from "clients/seasonAverageClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ISeasonAverage } from "../../interfaces/entities/ISeasonAverage";

const statsToShow: ILineConfiguration[] = [
  { stat: "ast", disabled: true, lineColor: "rgb(255, 99, 132)" },
  { stat: "pts", disabled: false, lineColor: "rgb(255, 99, 132)" },
  { stat: "min", disabled: true, lineColor: "rgb(255, 99, 132)" },
  { stat: "blk", disabled: true, lineColor: "rgb(255, 99, 132)" },
  { stat: "games_played", disabled: true, lineColor: "rgb(255, 99, 132)" },
  { stat: "reb", disabled: true, lineColor: "rgb(255, 99, 132)" },
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
  seasonAverages: ISeasonAverage[][];
}) => {
  const router = useRouter();

  const [startYear, setStartYear] = useState(new Date().getFullYear() - 6);
  const [endYear, setEndYear] = useState(new Date().getFullYear() - 1);
  const [overridenSeasonAverages, setOverridenSeasonAverages] = useState<
    ISeasonAverage[][]
  >([]);

  useEffect(() => {
    const fetchNewSeasonAverages = async () => {
      if (!router.query.id) return;

      // promises.push(getSeasonAverages(+router.query.id, startYear, endYear));
      // if (router.query.compareAgainst) {
      //   if (typeof router.query.compareAgainst === "string") {
      //     promises.push(
      //       getSeasonAverages(+router.query.compareAgainst, startYear, endYear)
      //     );
      //   } else {
      //     router.query.compareAgainst.forEach((id: string) => {
      //       promises.push(getSeasonAverages(+id, startYear, endYear));
      //     });
      //   }
      // }

      const playerIds = getPlayerIdsFromQuery([
        router.query.id,
        router.query.compareAgainst,
      ]);

      const newSeasonAverages = await getAllSeasonAverages(
        playerIds,
        startYear,
        endYear
      );

      setOverridenSeasonAverages(newSeasonAverages);
    };

    fetchNewSeasonAverages();
  }, [startYear, endYear, router.query.id, router.query.compareAgainst]);

  const chartSeasonAverages =
    overridenSeasonAverages.length > 0
      ? overridenSeasonAverages
      : seasonAverages;

  const selectableYears = getYears();
  const shownYears = getYears(startYear, endYear);

  // shownYears.forEach((year) => {
  //   if (!chartSeasonAverages.flat().find((x) => x.season === year)) {
  //     chartSeasonAverages.push([{
  //       season: year,
  //       pts: 0,
  //       ast: 0,
  //       min: 0,
  //       blk: 0,
  //       games_played: 0,
  //       reb: 0,
  //     }] as ISeasonAverage[]);
  //   }
  // });

  chartSeasonAverages.forEach((seasonAverages) =>
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
        stats={chartSeasonAverages.map((seasonAverages) => ({
          label: String(seasonAverages[0].player_id),
          data: seasonAverages.map((x) => x.pts),
          lineColor: "rgb(255, 99, 132)",
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

//0 Year Bug
//Player Name
//API Optimizations
//Color Line
