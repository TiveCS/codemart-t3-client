import { Button } from "../Button";

interface ProductCardProps {
  title: string;
  description: string | null;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description = "",
  price = 0,
}) => {
  const priceString = price > 0 ? `$${price}` : `Free`;

  return (
    <div>
      <h6>{title}</h6>
      <p>{description}</p>
      <p>{priceString}</p>

      <Button>Buy</Button>
    </div>
  );
};

export default ProductCard;
