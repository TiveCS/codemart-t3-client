import { Readable } from "stream";

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

export { splitFileToBase64, mergeBase64ToFile, base64ArrayToReadableStream };
