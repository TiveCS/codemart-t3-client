import { useEffect, useState } from "react";
import { type ProductBrowseData } from "~/types";
import { api } from "~/utils/api";
import { Button } from "../Button";
import ProductCard from "../ProductCard";

const ProductList: React.FC = () => {
  const productsQuery = api.products.getProductsForBrowse;
  const getProducts = productsQuery.useMutation();

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [products, setProducts] = useState<ProductBrowseData[] | undefined>(
    getProducts.data?.products
  );

  const fetchProducts = async () => {
    const skip = products?.length || 0;
    const response = await getProducts.mutateAsync({ skip });

    const oldProducts = products ?? [];
    const newProducts = response.products;

    setProducts([...oldProducts, ...newProducts]);
    setLoadMoreLoading(false);
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const handleLoadMore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoadMoreLoading(true);
    void fetchProducts();
  };

  return (
    <>
      <div
        id="product-list"
        className="flex flex-col flex-wrap gap-y-6 md:max-w-4xl md:flex-row md:items-center md:gap-6 lg:max-w-5xl"
      >
        {products?.map((product) => (
          <>
            <ProductCard key={product.id} product={product} />
          </>
        ))}
      </div>

      {hasMore && (
        <div className="mx-auto mt-16 w-fit">
          <Button
            className="min-w-2xs"
            onClick={handleLoadMore}
            isLoading={loadMoreLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductList;
