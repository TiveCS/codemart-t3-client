import { type NextPage } from "next";
import Head from "next/head";
import ProductList from "~/components/BrowsePage/ProductList";
import SearchBar from "~/components/BrowsePage/SearchBar";
import useInput from "~/hooks/useInput";

const ProductBrowse: NextPage = () => {
  const [search, onSearchChange] = useInput<string | undefined>(undefined);

  return (
    <>
      <Head>
        <title>CodeMart | Browse</title>
      </Head>
      <div className="grid grid-flow-col gap-x-4 lg:grid-cols-12">
        <div className="hidden h-screen bg-white shadow lg:col-span-3 lg:block"></div>
        <div className="lg:col-span-9">
          <SearchBar onSearchChange={onSearchChange} />

          <ProductList />
        </div>
      </div>
    </>
  );
};

export default ProductBrowse;
