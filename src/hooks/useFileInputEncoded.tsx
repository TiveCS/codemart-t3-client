import { useState, type FormEvent } from "react";
import { type FileInputDataType } from "~/types";
import { fileToFileData } from "~/utils/files";
import useToastsStore from "~/zustand/toastsStore";

type FileInputEnncodedOptions = {
  chunkSize: number;
  maxFileSize?: number;
};

function useFileInputEncoded(
  options?: FileInputEnncodedOptions
): [
  FileInputDataType | undefined,
  (event: FormEvent<HTMLInputElement>) => Promise<void>
] {
  const sizeInKiloBytes = 1024 * 1024;
  const maxSizeInBytes = options?.maxFileSize
    ? sizeInKiloBytes * options?.maxFileSize
    : 0;

  const { addToast } = useToastsStore();
  const [fileData, setFileEncoded] = useState<FileInputDataType>();

  async function onFileChangeHandler(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    if (!event.currentTarget.files) return;

    const file = event.currentTarget.files?.item(0);
    if (!file) return;

    if (maxSizeInBytes > 0 && file.size > maxSizeInBytes) {
      event.currentTarget.value = "";
      addToast({
        message: `${event.currentTarget.name} tidak bisa lebih dari ${
          maxSizeInBytes / sizeInKiloBytes
        } MB`,
        variant: "danger",
      });
      return;
    }

    const fileData = await fileToFileData(file);

    setFileEncoded(fileData);
  }

  return [fileData, onFileChangeHandler];
}

export default useFileInputEncoded;
