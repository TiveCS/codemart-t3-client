import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../Button";
import ProductCard from "../ProductCard";
import { useRouter } from "next/router";

interface ProductListProps {
  filters?: string[];
}

const PRODUCTS_TAKE_AMOUNT = 6;

const ProductList: React.FC<ProductListProps> = ({ filters }) => {
  const router = useRouter();
  const { search } = router.query;

  const [take, setTake] = useState(PRODUCTS_TAKE_AMOUNT);
  const { data, isLoading } = api.products.getProductsForBrowse.useQuery({
    take,
    search: search as string,
    filters: filters && filters?.length > 0 ? filters : undefined,
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
        {data?.products?.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
        {data?.products?.length === 0 && (
          <div className="w-full text-center">
            <p className="text-xl font-medium">No products found</p>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}
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
