import { type ChangeEvent, useState } from "react";

export default function useInput(
  defaultValue = ""
): [string, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(defaultValue);

  function onValueChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setValue(e.target.value);
  }

  return [value, onValueChangeHandler];
}
