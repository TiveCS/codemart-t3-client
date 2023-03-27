import { useState, type FormEvent } from "react";
import { z } from "zod";
import { splitFileToBase64 } from "~/utils/files";
import useToastsStore from "~/zustand/toastsStore";

type FileInputEnncodedOptions = {
  chunkSize: number;
  maxFileSize?: number;
};

export const FileInputData = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  body: z.array(z.string()),
});

export type FileInputDataType = z.infer<typeof FileInputData>;

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

    const file = event.currentTarget.files?.item(0);
    if (!file) return;

    if (maxSizeInBytes > 0 && file.size > maxSizeInBytes) {
      addToast({
        message: `${event.currentTarget.name} tidak bisa lebih dari ${
          maxSizeInBytes / sizeInKiloBytes
        } MB`,
        variant: "danger",
      });
      return;
    }

    const encoded = await splitFileToBase64(file, options?.chunkSize);

    setFileEncoded({
      name: file.name,
      type: file.type,
      size: file.size,
      body: encoded,
    });
  }

  return [fileData, onFileChangeHandler];
}

export default useFileInputEncoded;
