import { useState, type ChangeEvent, type SetStateAction } from "react";

function useInput<T>(
  defaultValue: T
): [
  T,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (value: SetStateAction<T>) => void
] {
  const [value, setValue] = useState<T>(defaultValue);

  function onValueChangeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    e.preventDefault();
    setValue(e.target.value as unknown as T);
  }

  return [value, onValueChangeHandler, setValue];
}

export default useInput;
