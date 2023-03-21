import { type ChangeEvent, type InputHTMLAttributes } from "react";

interface FormInputProps {
  id?: string;
  name: string;
  label?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  className?: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  onChangeHandler,
}: FormInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    onChangeHandler(event);
  }

  return (
    <div className={className + " inline-flex w-full flex-col gap-y-2"}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        className="rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-codemart-300"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
}
