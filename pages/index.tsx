import ConfigurationBar from "@/components/configuration-bar";
import { Spinner } from "@/components/spinner";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const onPlayerSelect = () => {
    setIsLoading(true);
  };

  return (
    <div
      className={`${styles.container} p-0 overflow-hidden -m-16 max-h-screen`}
    >
      <Image
        src="/ball.jpg"
        layout="fill"
        objectFit="cover"
        width="100%"
        height="100%"
        alt="Background"
      />
      <div
        className="card md:w-96 w-3/4 bg-gray-600 shadow-xl absolute left-1/2 top-1/2 
        -translate-x-1/2 -translate-y-1/2 bg-opacity-80"
      >
        <div className="card-body">
          <div className="flex justify-center items-center">
            <div className="relative top-1 left-2">
              {isLoading && <Spinner />}
            </div>
            <div className="w-full mb-8">
              <ConfigurationBar onPlayerSelect={onPlayerSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
