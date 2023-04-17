import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ProductList from "~/components/BrowsePage/ProductList";
import SearchBar from "~/components/BrowsePage/SearchBar";
import CategoryCheckbox from "~/components/BrowsePage/categories/CategoryCheckbox";
import useInput from "~/hooks/useInput";

const ProductBrowse: NextPage = () => {
  const [search, onSearchChange] = useInput<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);

  return (
    <>
      <Head>
        <title>CodeMart | Browse</title>
      </Head>
      <div className="grid grid-flow-col gap-x-4 lg:grid-cols-12">
        <div className="hidden h-screen bg-white px-6 py-8 shadow lg:col-span-3 lg:block">
          <div>
            <h6 className="font-medium">Framework</h6>
            <CategoryCheckbox category="Spring" setCategories={setCategories} />
            <CategoryCheckbox
              category="Laravel"
              setCategories={setCategories}
            />
            <CategoryCheckbox category="React" setCategories={setCategories} />
            <CategoryCheckbox category="Echo" setCategories={setCategories} />
          </div>
        </div>
        <div className="lg:col-span-9">
          <SearchBar value={search} onSearchChange={onSearchChange} />

          <ProductList filters={categories} />
        </div>
      </div>
    </>
  );
};

export default ProductBrowse;
