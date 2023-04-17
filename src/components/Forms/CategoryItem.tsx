import classNames from "classnames";
import { type SetStateAction } from "react";

interface CategoryItemProps {
  text: string;
  style?: "filled" | "outlined";
  onDeleteHandler?: (state: SetStateAction<string[]>) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  text,
  onDeleteHandler,
  style = "outlined",
}) => {
  const classes = classNames({
    "bg-codemart-700 text-sm text-white  hover:bg-codemart-900":
      style === "filled",
    "bg-white text-sm text-codemart-700 hover:bg-codemart-100 border border-codemart-700":
      style === "outlined",
  });

  return (
    <div
      className={`w-fit rounded-full px-4 py-1 font-medium hover:cursor-pointer ${classes}`}
      onClick={(event) => {
        event.preventDefault();
        if (onDeleteHandler)
          onDeleteHandler((prev) => prev.filter((item) => item !== text));
      }}
    >
      {text}
    </div>
  );
};

export default CategoryItem;
