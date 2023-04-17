import Link from "next/link";
import { type ChangeEvent } from "react";
import { Button } from "../Button";
import FormInput from "../Forms/FormInput";

import { useRouter } from "next/router";

interface SearchBarProps {
  value?: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearchChange }) => {
  const router = useRouter();

  const handleSearch = async () => {
    if (!value) {
      await router.push("/products");
      return;
    }

    await router.push(`/products?search=${value}`);
  };

  return (
    <div className="mb-6 grid grid-flow-col grid-cols-4 items-center gap-x-6 lg:grid-cols-6">
      <form
        className="col-span-4 inline-flex items-center gap-x-4 md:col-span-3 lg:col-span-5"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearch();
        }}
      >
        <FormInput
          name="search"
          placeholder="Search product here..."
          onChangeHandler={onSearchChange}
          id="search-bar"
        />
      </form>

      <Link href={"/products/sell"} className="hidden md:block">
        <Button style="outline">Sell Product</Button>
      </Link>
    </div>
  );
};

export default SearchBar;
