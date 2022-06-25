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

const PlayerDetails = ({
  seasonAverages,
}: {
  seasonAverages: ISeasonAverage[];
}) => {
  const router = useRouter();
  const id: string = router.query.id as string;

  return (
    <>
      {seasonAverages.map(({ games_played, season, pts }) => (
        <>
          <div>{id}</div>
          <div>games_played: {games_played}</div>
          <div>season: {season}</div>
          <div>pts: {pts}</div>
        </>
      ))}
    </>
  );
};

export default PlayerDetails;
