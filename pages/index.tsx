import ConfigurationBar from "@/components/configuration-bar";
import Image from "next/image";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";
import styles from "../styles/Home.module.css";

interface IHomeProps {
  allPlayers: IEssentialPlayerData[];
}

export default function Home({ allPlayers }: IHomeProps) {
  return (
    <div
      className={`${styles.container} p-0 overflow-hidden -m-16 max-h-screen`}
    >
      <Image
        src="/fadedBackground.webp"
        layout="fill"
        objectFit="cover"
        width="100%"
        height="100%"
      />
      <div
        className="card w-96 bg-gray-200 shadow-xl absolute left-1/2 top-1/2 
        -translate-x-1/2 -translate-y-1/2 bg-opacity-60 backdrop-blur-md"
      >
        <div className="card-body">
          <ConfigurationBar />
        </div>
      </div>
    </div>
  );
}
