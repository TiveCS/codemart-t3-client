import { type FormEvent, type InputHTMLAttributes } from "react";
import useToastsStore from "~/zustand/toastsStore";

type FileAcceptType = "zip" | "image";

interface FileInputProps {
  className?: string;
  name: string;
  id?: string;
  placeholder?: string;
  label?: string;
  onChangeHandler: (event: FormEvent<HTMLInputElement>) => void | Promise<void>;
  acceptType?: FileAcceptType;
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
  acceptType,
  accept,
  required = false,
  multiple = false,
}) => {
  const { addToast } = useToastsStore();

  function validateImage(event: FormEvent<HTMLInputElement>): boolean {
    const files = event.currentTarget.files;

    if (!files) return false;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) return false;

      const isImage = file.type === "image/jpeg" || file.type === "image/png";

      if (!isImage) return false;
    }

    return true;
  }

  function validateZip(event: FormEvent<HTMLInputElement>): boolean {
    const files = event.currentTarget.files;

    if (!files) return false;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) return false;

      const type = file.type;
      const isZip =
        type === "application/zip" ||
        type === "application/x-zip-compressed" ||
        type === "application/x-zip" ||
        type === "application/x-compress" ||
        type === "application/x-compressed" ||
        type === "multipart/x-zip";
      if (!isZip) return false;
    }

    return true;
  }

  function handleChange(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const isValid =
      (acceptType === "image" && validateImage(event)) ||
      (acceptType === "zip" && validateZip(event));

    if (!isValid) {
      addToast({
        message: `Tipe file bukan ${
          acceptType ? acceptType : "yang diijinkan"
        }`,
        variant: "danger",
      });
      event.currentTarget.value = "";
      return;
    }

    void onChangeHandler(event);
  }

  return (
    <>
      <div className={className + " inline-flex w-full flex-col gap-y-2"}>
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {label && required === false && (
            <span className="text- bg-gray-300">(Optional)</span>
          )}
        </label>
        <input
          className={`${className} cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-codemart-300`}
          id={id}
          name={name}
          type={"file"}
          accept={accept}
          placeholder={placeholder}
          onChange={handleChange}
          required={required}
          multiple={multiple}
        />
      </div>
    </>
  );
};

export default FileInput;
