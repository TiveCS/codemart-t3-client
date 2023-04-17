import { useState, FormEvent } from "react";

function useFileInput(): [
  File | null,
  (event: FormEvent<HTMLInputElement>) => void
] {
  const [file, setFile] = useState<File | null>(null);

  function onFileChangeHandler(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const file = event.currentTarget.files?.item(0);
    if (!file) return

    setFile(file);
  }

  return [file, onFileChangeHandler];
}

export default useFileInput;
