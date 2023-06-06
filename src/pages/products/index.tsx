import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ProductList from "~/components/BrowsePage/ProductList";
import SearchBar from "~/components/BrowsePage/SearchBar";
import CategoryCheckbox from "~/components/BrowsePage/categories/CategoryCheckbox";
import useInput from "~/hooks/useInput";
import { api } from "~/utils/api";

const ProductBrowse: NextPage = () => {
  const { value: search, onValueChangeHandler: onSearchChange } = useInput<
    string | undefined
  >(undefined);
  const [categories, setCategories] = useState<string[]>([]);

  const { data: availableCategories, isLoading: isCategoryLoading } =
    api.products.getLatestCategories.useQuery();

  return (
    <>
      <Head>
        <title>CodeMart | Browse</title>
      </Head>
      <div className="grid grid-flow-col gap-x-4 lg:grid-cols-12">
        <div className="hidden h-screen bg-white px-6 py-8 shadow lg:col-span-3 lg:block">
          <div className="flex flex-col gap-y-2">
            <h6 className="font-medium">Categories</h6>
            {isCategoryLoading && <p>Loading...</p>}

            {availableCategories?.map((category) => (
              <CategoryCheckbox
                key={category}
                category={category}
                setCategories={setCategories}
              />
            ))}
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
