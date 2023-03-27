import { type Product } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import ProductCard from "../ProductCard";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Array<Product>>([]);

  const productsQuery = api.products.getProductsForBrowse;

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          price={product.price}
          description={product.description}
        />
      ))}
    </div>
  );
};

export default ProductList;
