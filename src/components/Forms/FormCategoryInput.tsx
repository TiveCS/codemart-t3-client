import {
  type SetStateAction,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import CategoryItem from "./CategoryItem";
import { Button } from "../Button";

interface FormCategoryInputProps {
  id?: string;
  name: string;
  label?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  className?: string;
  value?: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddHandler: (state: SetStateAction<string[]>) => void;
  onDeleteHandler: (state: SetStateAction<string[]>) => void;
  required?: boolean;
  items?: string[];
  setCategory: (state: SetStateAction<string>) => void;
}

const FormCategoryInput: React.FC<FormCategoryInputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  value,
  onChangeHandler,
  required = false,
  items,
  setCategory,
  onDeleteHandler,
  onAddHandler,
}) => {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    onChangeHandler(event);
  }

  return (
    <div
      className={className + " relative inline-flex w-full flex-col gap-y-2"}
    >
      {label && (
        <label
          htmlFor={name}
          form="category-input"
          className="text-sm font-medium"
        >
          {label}
          {label && required === true && (
            <span className="text-red-600">*</span>
          )}
        </label>
      )}

      <input
        className={`${className} rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-codemart-300`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        required={required}
      />

      {value && value.length > 0 && (
        <div className="absolute top-full mt-1.5 w-full border border-codemart-200 bg-white shadow">
          <Button
            className="text-left text-sm"
            style="text"
            onClick={(event) => {
              event.preventDefault();
              onAddHandler((prev) => [...prev, value]);
              setCategory("");
            }}
          >
            Add{" "}
            <span className="font-medium text-codemart-700">
              &quot;{value}&quot;
            </span>
          </Button>
        </div>
      )}

      {items && (
        <div className="inline-flex gap-x-2">
          {items.map((item, index) => (
            <CategoryItem
              key={index}
              text={item}
              style="filled"
              onDeleteHandler={onDeleteHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormCategoryInput;
