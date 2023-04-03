import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface FileImageInputCardProps {
  id: string;
  index: number;
  file: File;
  onDeleteHandler: (index: number) => void;
}

const FileImageInputCard: React.FC<FileImageInputCardProps> = ({
  id,
  index,
  file,
  onDeleteHandler,
}) => {
  return (
    <div
      id={id}
      className="relative z-10 h-32 w-40 rounded-md bg-gray-800 shadow"
    >
      <CardDeleteButton onDeleteHandler={() => onDeleteHandler(index)} />
      <Image
        className="rounded-md"
        src={URL.createObjectURL(file)}
        alt={file.name}
        fill
      />
    </div>
  );
};

interface CardDeleteButtonProps {
  onDeleteHandler: () => void;
}

const CardDeleteButton: React.FC<CardDeleteButtonProps> = ({
  onDeleteHandler,
}) => {
  return (
    <button
      type="button"
      className="relative left-36 bottom-3 z-20 rounded-full border border-gray-300 bg-gray-50 px-0.5 py-0.5 text-red-600 shadow transition-colors hover:bg-red-500 hover:text-white"
      onClick={(event) => {
        event.preventDefault();
        onDeleteHandler();
      }}
    >
      <XMarkIcon className="h-6 w-6" />
    </button>
  );
};

export default FileImageInputCard;
