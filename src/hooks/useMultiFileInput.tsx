import { useState } from "react";
import { type FileInputDataType } from "~/types";
import { fileToFileData } from "~/utils/files";
import { fileArrayToFileData } from "~/utils/files";
import useToastsStore from "~/zustand/toastsStore";

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
  const [isEncoding, setIsEncoding] = useState(false);

  const { addToast } = useToastsStore();

  const encodeOneFile = (file: File | null) => {
    if (!file) return;
    setIsEncoding(true);

    fileToFileData(file)
      .then((encoded) => {
        setEncodedDatas([...encodedDatas, encoded]);
        setIsEncoding(false);

        addToast({
          message: "File encoded successfully.",
          variant: "success",
        });
      })
      .catch(() => {
        setIsEncoding(false);
        addToast({
          message: "Error encoding file.",
          variant: "danger",
        });
      });
  };

  const encodeFiles = (fileList: FileList) => {
    if (!fileList) return;
    if (fileList.length == 0) return;
    if (isEncoding) return;

    setIsEncoding(true);

    const newFiles: File[] = Array.from(fileList);

    fileArrayToFileData(newFiles)
      .then((encodedDatas) => {
        setEncodedDatas(encodedDatas);
        setIsEncoding(false);

        addToast({
          message: "Multi files encoded successfully.",
          variant: "success",
        });
      })
      .catch(() => {
        setIsEncoding(false);
        addToast({
          message: "Error encoding multi files.",
          variant: "danger",
        });
      });
  };

  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    if (newFiles.length > 1) {
      encodeFiles(newFiles);
    } else {
      encodeOneFile(newFiles.item(0));
    }
    setFiles([...files, ...newFiles]);
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
    const newEncodedDatas = [...encodedDatas];

    newFiles.splice(index, 1);
    newEncodedDatas.splice(index, 1);

    setFiles(newFiles);
    setEncodedDatas(newEncodedDatas);
  };

  return {
    files,
    encodedDatas,
    onFileChangeHandler,
    onFileDropHandler,
    onDeleteFileHandler,
    encodeFiles,
    isEncoding,
  };
};

export default useMultiFileInput;
