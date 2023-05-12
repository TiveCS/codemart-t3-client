import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head key={"home"}>
        <title>CodeMart</title>
        <meta
          name="description"
          content="Marketplace for selling source code"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <></>
    </>
  );
};

export default Home;
