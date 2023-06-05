import Image from "next/image";
import { type ProductBrowseData } from "~/types";
import { Button } from "../Button";
import NoImageCover from "public/assets/img/no-image.jpg";
import Link from "next/link";
import CategoryItem from "../Forms/CategoryItem";

interface ProductCardProps {
  product: ProductBrowseData;
  className?: string;
}

const formatPrice = (price: number) => {
  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const priceString =
    product.price > 0 ? `${formatPrice(product.price)}` : `Free`;

  return (
    <div
      key={product.id}
      id={product.id}
      className={`${className}  min-w-2xs rounded-md bg-white shadow mobile-lg:min-w-xs`}
    >
      <div className="relative h-56 w-full">
        <Image
          src={product.cover_url ?? NoImageCover}
          alt={product.title}
          className="rounded-t-md bg-gray-400 sm:max-w-xs md:min-w-xs"
          sizes="(max-width: 768px) 14rem"
          fill
          priority
        />
      </div>

      <div className="px-4 py-4">
        <div className="mb-8">
          <Link href={"/products/[id]"} as={`/products/${product.id}`}>
            <h6 className="text-lg font-medium text-codemart-600">
              {product.title}
            </h6>
          </Link>

          <Link
            href={"/users/[id]"}
            as={`/users/${product.owner.id}`}
            className="group"
          >
            <p className="text-sm font-medium text-gray-900 group-hover:text-codemart-500">
              {product.owner.name}
            </p>
          </Link>

          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="mt-2 flex flex-row gap-x-1.5">
            {product.categories.map((category) => (
              <CategoryItem text={category} key={category} style="outlined" />
            ))}
          </div>
        </div>

        <div className="grid grid-flow-col items-center justify-between">
          <p className="text-lg font-semibold text-codemart-600">
            {priceString}
          </p>

          <Link href={"/products/[id]"} as={`/products/${product.id}`}>
            <Button className="max-w-2us" style="primary">
              Buy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
