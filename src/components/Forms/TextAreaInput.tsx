import { type ChangeEvent } from "react";

interface FormInputProps {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChangeHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  placeholder,
  className = "",
  value,
  onChangeHandler,
}) => {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    onChangeHandler(event);
  }

  return (
    <div className={className + " inline-flex w-full flex-col gap-y-2"}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        className="rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-codemart-300"
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default TextAreaInput;
