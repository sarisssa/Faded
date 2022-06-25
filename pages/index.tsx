import Head from "next/head";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";
import styles from "../styles/Home.module.css";

interface IHomeProps {
  allPlayers: IEssentialPlayerData[];
}

export default function Home({ allPlayers }: IHomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Faded</title>
        <meta name="description" content="nba basketball stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
