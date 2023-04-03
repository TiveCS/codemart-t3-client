import { Readable } from "stream";
import { type FileInputDataType } from "~/types";

async function fileArrayToBase64(files: File[]): Promise<string[]> {
  const filePromises = files.map((file) => fileToBase64(file));
  return Promise.all(filePromises);
}

async function fileToBase64(file: File): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  const blobPromise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  });

  return Promise.resolve(blobPromise);
}

async function fileArrayToFileData(
  files: File[]
): Promise<FileInputDataType[]> {
  const filePromises = files.map((file) => fileToFileData(file));
  return Promise.all(filePromises);
}

async function fileToFileData(file: File): Promise<FileInputDataType> {
  const base64 = await fileToBase64(file);
  const match = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!match || match.length < 3) return Promise.reject();

  const mime = match.at(1);
  const body = match.at(2);

  const { name, size, type } = file;

  if (!body || !name || !size || (mime === undefined && type.length === 0))
    return Promise.reject();

  return Promise.resolve({
    body,
    name,
    size,
    type,
    mime,
  });
}

function dataBase64ToBuffer(data: FileInputDataType) {
  const { body } = data;
  return Buffer.from(body, "base64");
}

async function splitFileToBase64(
  file: File,
  chunkSize = 1024 * 1024 // 1 MB chunk size
): Promise<string[]> {
  const chunks = [];
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const chunkReader = new FileReader();
    const chunkPromise = new Promise<string>((resolve, reject) => {
      chunkReader.onload = () => {
        const base64 = chunkReader.result as string;
        resolve(base64);
      };
      chunkReader.onerror = () => {
        reject(chunkReader.error);
      };
    });
    chunkReader.readAsDataURL(chunk);
    chunks.push(chunkPromise);
    offset += chunkSize;
  }

  return Promise.all(chunks);
}

async function mergeBase64ToFile(
  base64Chunks: string[],
  fileType: string,
  fileName: string
): Promise<File> {
  const dataURL = `data:${fileType};base64,${base64Chunks.join("")}`;
  const response = await fetch(dataURL);
  const arrayBuffer = await response.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);

  return new File([byteArray], fileName, { type: fileType });
}

function base64ArrayToReadableStream(base64Chunks: string[]): Readable {
  let currentChunk = 0;

  return new Readable({
    read() {
      if (currentChunk >= base64Chunks.length) {
        this.push(null); // no more data
        return;
      }

      const base64 = base64Chunks[currentChunk];
      const buffer = base64 ? Buffer.from(base64, "base64") : Buffer.alloc(0);

      currentChunk++;
      this.push(buffer);
    },
  });
}

export {
  splitFileToBase64,
  mergeBase64ToFile,
  base64ArrayToReadableStream,
  fileToBase64,
  fileArrayToBase64,
  fileToFileData,
  fileArrayToFileData,
  dataBase64ToBuffer,
};
