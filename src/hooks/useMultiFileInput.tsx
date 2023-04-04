import { useState } from "react";
import { type FileInputDataType } from "~/types";
import { fileArrayToFileData } from "~/utils/files";

interface useMultiFileInputOptions {
  maxFiles?: number;
  maxFileSize?: number;
}

const useMultiFileInput = ({
  maxFileSize = 3 * 1024 * 1024,
  maxFiles = 0,
}: useMultiFileInputOptions) => {
  const [files, setFiles] = useState<File[]>([]);
  const [encodedDatas, setEncodedDatas] = useState<FileInputDataType[]>([]);

  const encodeFiles = async () => {
    const encodedDatas = await fileArrayToFileData(files);
    setEncodedDatas(encodedDatas);
  };

  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      setFiles([...files, ...newFiles]);
    }
  };

  const onFileDropHandler = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const newFiles = event.dataTransfer.files;

    if (!newFiles) return;

    if (maxFiles > 0 && newFiles.length > maxFiles) return;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (!file) continue;
      if (file.size > maxFileSize) return;
    }

    setFiles([...files, ...newFiles]);
  };

  const onDeleteFileHandler = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return {
    files,
    encodedDatas,
    onFileChangeHandler,
    onFileDropHandler,
    onDeleteFileHandler,
    encodeFiles,
  };
};

export default useMultiFileInput;
