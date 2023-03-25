import { useState, type FormEvent } from "react";
import { z } from "zod";
import { splitFileToBase64 } from "~/utils/files";

type FileInputEnncodedOptions = {
  chunkSize: number;
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
  const [fileData, setFileEncoded] = useState<FileInputDataType>();

  async function onFileChangeHandler(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const file = event.currentTarget.files?.item(0);
    if (!file) return;

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
