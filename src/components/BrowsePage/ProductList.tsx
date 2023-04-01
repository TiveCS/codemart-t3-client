import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../Button";
import ProductCard from "../ProductCard";

const PRODUCTS_TAKE_AMOUNT = 6;

const ProductList: React.FC = () => {
  const [take, setTake] = useState(PRODUCTS_TAKE_AMOUNT);
  const { data, isLoading } = api.products.getProductsForBrowse.useQuery({
    take,
  });

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    setTake(take + PRODUCTS_TAKE_AMOUNT);
  };

  return (
    <>
      <div
        id="product-list"
        className="flex flex-col flex-wrap gap-y-6 md:max-w-4xl md:flex-row md:items-center md:gap-6 lg:max-w-5xl"
      >
        {data?.products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mx-auto mt-16 w-fit">
        <Button className="min-w-2xs" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    </>
  );
};

export default ProductList;
