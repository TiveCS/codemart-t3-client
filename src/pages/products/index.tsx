import { type NextPage } from "next";
import Head from "next/head";
import ProductList from "~/components/BrowsePage/ProductList";

const ProductBrowse: NextPage = () => {
  return (
    <>
      <Head>
        <title>CodeMart | Browse</title>
      </Head>
      <>
        <ProductList />
      </>
    </>
  );
};

export default ProductBrowse;
