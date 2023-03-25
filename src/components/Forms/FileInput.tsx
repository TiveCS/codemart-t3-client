import { type FormEvent, type InputHTMLAttributes } from "react";

interface FileInputProps {
  className?: string;
  name: string;
  id?: string;
  placeholder?: string;
  label?: string;
  onChangeHandler: (event: FormEvent<HTMLInputElement>) => void | Promise<void>;
  accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
  required?: boolean;
  multiple?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  className = "",
  name,
  id,
  placeholder,
  label,
  onChangeHandler,
  accept,
  required = false,
  multiple = false,
}) => {
  function handleChange(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();
    void onChangeHandler(event);
  }

  return (
    <>
      <div className={className + " inline-flex w-full flex-col gap-y-2"}>
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
        <input
          className="rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-codemart-300"
          id={id}
          name={name}
          type={"file"}
          placeholder={placeholder}
          onChange={handleChange}
          accept={accept}
          required={required}
          multiple={multiple}
        />
      </div>
    </>
  );
};

export default FileInput;
