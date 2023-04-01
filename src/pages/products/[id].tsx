import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const ProductDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{`CodeMart | ${id as string}`}</title>
      </Head>
    </>
  );
};
