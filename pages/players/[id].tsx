import LineChart from "@/components/line-chart";
import { ILineConfiguration } from "@/interfaces/props/ILineConfiguration";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getSeasonAverages } from "clients/seasonAverageClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ISeasonAverage } from "../../interfaces/entities/ISeasonAverage";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const playerId = context.query.id;

  let seasonAverages: ISeasonAverage[] = [];
  if (!playerId) {
    seasonAverages = [];
  } else {
    seasonAverages = await getSeasonAverages(+playerId);
  }

  return {
    props: {
      seasonAverages,
    },
  };
};

const PlayerDetails = ({
  seasonAverages,
}: {
  seasonAverages: ISeasonAverage[];
}) => {
  const router = useRouter();

  const statsToShow: ILineConfiguration[] = [
    { stat: "ast", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "pts", disabled: false, lineColor: "rgb(255, 99, 132)" },
    { stat: "min", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "blk", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "games_played", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "reb", disabled: true, lineColor: "rgb(255, 99, 132)" },
  ];

  const [startYear, setStartYear] = useState(new Date().getFullYear() - 6);
  const [endYear, setEndYear] = useState(new Date().getFullYear() - 1);
  const [overridenSeasonAverages, setOverridenSeasonAverages] = useState<
    ISeasonAverage[]
  >([]);

  useEffect(() => {
    const fetchNewSeasonAverages = async () => {
      if (!router.query.id) return;

      setOverridenSeasonAverages(
        await getSeasonAverages(+router.query.id, startYear, endYear)
      );
    };

    fetchNewSeasonAverages();
  }, [startYear, endYear]);

  const chartSeasonAverages =
    overridenSeasonAverages.length > 0
      ? overridenSeasonAverages
      : seasonAverages;

  const selectableYears = getYears();
  const shownYears = getYears(startYear, endYear);

  shownYears.forEach((year) => {
    if (!chartSeasonAverages.find((x) => x.season === year)) {
      chartSeasonAverages.push({
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

  chartSeasonAverages.sort((a, b) => a.season - b.season);

  // years.forEach((year, i) => {
  //   if (chartSeasonAverages.)
  // });

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
            <MenuItem value={year}>{year}</MenuItem>
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
            <MenuItem value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <LineChart
        seasons={shownYears}
        stats={statsToShow.map((stat) => ({
          label: stat.stat,
          data: chartSeasonAverages.map((x) => x[stat.stat]),
          hidden: stat.disabled,
          lineColor: stat.lineColor,
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
