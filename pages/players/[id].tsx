import LineChart from "@/components/line-chart";
import { ILineConfiguration } from "@/interfaces/props/ILineConfiguration";
import { getSeasonAverages } from "clients/seasonAverageClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
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

const map = {
  ast: "rgb(...)",
  pts: "rgb(...)",
};

const PlayerDetails = ({
  seasonAverages,
}: {
  seasonAverages: ISeasonAverage[];
}) => {
  const router = useRouter();
  const id: string = router.query.id as string;

  const statsToShow: ILineConfiguration[] = [
    { stat: "ast", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "pts", disabled: false, lineColor: "rgb(255, 99, 132)" },
    { stat: "min", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "blk", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "games_played", disabled: true, lineColor: "rgb(255, 99, 132)" },
    { stat: "reb", disabled: true, lineColor: "rgb(255, 99, 132)" },
  ];

  return (
    <>
      <p>ID: {id}</p>
      <LineChart
        seasons={seasonAverages.map((x) => x.season)}
        stats={statsToShow.map((stat) => ({
          label: stat.stat,
          data: seasonAverages.map((x) => x[stat.stat]),
          hidden: stat.disabled,
          lineColor: stat.lineColor,
        }))}
      />
    </>
  );
};

export default PlayerDetails;
