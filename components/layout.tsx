import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./header";

interface ILayoutProps {
  children: JSX.Element;
}

export default function Layout({ children }: ILayoutProps) {
  return <LayoutContent>{children}</LayoutContent>;
}

interface ILayoutContentProps {
  children: JSX.Element;
}

const LayoutContent = ({ children }: ILayoutContentProps) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Faded</title>
        <meta name="description" content="nba basketball stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {router.pathname !== "/" && <Header />}
      <main>{children}</main>
    </>
  );
};
