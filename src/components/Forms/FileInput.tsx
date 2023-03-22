import { type ChangeEvent, type InputHTMLAttributes } from "react";

interface FileInputProps {
  className?: string;
  name: string;
  id?: string;
  placeholder?: string;
  label?: string;
  onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
}

const FileInput: React.FC<FileInputProps> = ({
  className = "",
  name,
  id,
  placeholder,
  label,
  onChangeHandler,
  accept,
}) => {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    onChangeHandler(event);
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
        />
      </div>
    </>
  );
};

export default FileInput;
