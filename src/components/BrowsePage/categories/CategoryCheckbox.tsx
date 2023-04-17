import { type SetStateAction } from "react";

interface CategoryCheckboxProps {
  category: string;
  setCategories: (state: SetStateAction<string[]>) => void;
}

const CategoryCheckbox: React.FC<CategoryCheckboxProps> = ({
  category,
  setCategories,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories((prev) =>
      e.target.checked
        ? [...prev, e.target.value]
        : prev.filter((c) => c !== e.target.value)
    );
  };

  return (
    <div className="">
      <input
        type="checkbox"
        id={category}
        name="categories"
        value={category}
        onChange={handleChange}
      />
      <label htmlFor={category}>{category}</label>
    </div>
  );
};

export default CategoryCheckbox;
