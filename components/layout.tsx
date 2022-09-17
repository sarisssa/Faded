import Head from "next/head";
import Header from "./header";

interface ILayoutProps {
  children: JSX.Element;
}

export default function Layout({ children }: ILayoutProps) {
  return <LayoutContent children={children} />;
}

interface ILayoutContentProps {
  children: JSX.Element;
}

const LayoutContent = ({ children }: ILayoutContentProps) => {
  return (
    <>
      <Head>
        <title>Faded</title>
        <meta name="description" content="nba basketball stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>{children}</main>
    </>
  );
};
