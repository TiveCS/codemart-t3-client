import { useCallback, useState, type ChangeEvent } from "react";

import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import FileImageInputCard from "./FileImageInputCard";

interface FileImageInputProps {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
  files: File[];
  onChangeHandler: (
    event: ChangeEvent<HTMLInputElement>
  ) => void | Promise<void>;
  onDropHandler: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDeleteHandler: (index: number) => void;
}

const FileImageInput: React.FC<FileImageInputProps> = ({
  className = "",
  name,
  label,
  required = false,
  files,
  onChangeHandler,
  onDropHandler,
  onDeleteHandler,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void onChangeHandler(event);
    event.preventDefault();
  };

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div className="flex flex-col gap-y-2">
      {label && (
        <label htmlFor={name} className="font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={
          className +
          ` rounded-md border border-gray-300 hover:bg-gray-100 ${
            isDragging
              ? "bg-codemart-50 text-gray-600 shadow-md"
              : "bg-gray-50 text-gray-600"
          }`
        }
      >
        <label
          htmlFor={name}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center py-16"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={onDropHandler}
        >
          {files.length > 0 ? (
            <div className="flex flex-col flex-wrap items-center justify-center gap-y-6 mobile-lg:flex-row mobile-lg:gap-x-8">
              {Array.from(files).map((file, index) => (
                <FileImageInputCard
                  key={`${file.name}_${index}`}
                  file={file}
                  index={index}
                  onDeleteHandler={onDeleteHandler}
                  id={`${file.name}_${index}`}
                />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <DocumentArrowUpIcon className="h-8 w-8" />
              </div>
              <div className="text-sm ">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </div>
              <div className="text-sm  ">
                PNG and JPEG files only. Max size is 3MB.
              </div>
            </>
          )}

          <input
            type="file"
            name={name}
            id={name}
            className="hidden"
            onChange={handleChange}
            accept="image/png,image/jpeg"
            multiple
          />
        </label>
      </div>
    </div>
  );
};

export default FileImageInput;
