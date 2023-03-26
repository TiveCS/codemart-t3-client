import { useState, type ChangeEvent } from "react";

function useInput<T>(
  defaultValue: T
): [T, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  function onValueChangeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    e.preventDefault();
    setValue(e.target.value as unknown as T);
  }

  return [value, onValueChangeHandler];
}

export default useInput;
