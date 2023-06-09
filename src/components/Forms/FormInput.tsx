import { type ChangeEvent, type InputHTMLAttributes } from "react";

interface FormInputProps {
  id?: string;
  name?: string;
  label?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  className?: string;
  value?: string | number | readonly string[];
  onChangeHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name = undefined,
  label,
  type = "text",
  placeholder,
  className = "",
  value,
  onChangeHandler = undefined,
  required = false,
}) => {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    if (!onChangeHandler) return;

    onChangeHandler(event);
  }

  return (
    <>
      <div className={className + " inline-flex w-full flex-col gap-y-2"}>
        {label && (
          <label htmlFor={name} className="text-sm font-medium">
            {label}
            {label && required === false && (
              <span className="font-normal text-gray-400"> (optional)</span>
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
      </div>
    </>
  );
};

export default FormInput;
